import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import envVars from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';

//Custom Authentication
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {

            const isUserExist = await User.findOne({ email })
            // if (!isUserExist) {
            //     return done(null, false, { message: "User does not exist" })
            // }
            if (!isUserExist) {
                return done("User does not exist");
            }

            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")

            // if(isGoogleAuthenticated){
            //     return done(null, false, {message: "You are authenticated through Google Authentication. For credentials login, login with google first and create a password"})
            // }
            if(isGoogleAuthenticated && !isUserExist.password){
                return done("You are authenticated through Google Authentication. For credentials login, login with google first and create a password")
            }

            const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)
            if (!isPasswordMatch) {
                return done(null, false, { message: "Password does not exist" })
            }

            return done(null, isUserExist);

        } catch (error) {
            // console.log(error);
            done(error);
        }
    })
)


//Google Authentication
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(null, false, { message: "No email found" })
                }

                let user = await User.findOne({ email })

                if (!user) {
                    const picture = profile.photos?.[0]?.value || "";

                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture,
                        role: Role.USER,
                        isVerified: true,
                        auths: [{
                            provider: "google",
                            providerId: profile.id
                        }]
                    })
                }

                return done(null, user);
            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error)
            }
        }
    )
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error)
        done(error)

    }
})