import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";

function passportGoogleMiddleware() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        //console.log("profile from google: \n", profile._json);
        //return done(null, profile);
        try {
          let user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            user = {
              name: profile._json.given_name,
              email: profile._json.email,
              isVerified: profile._json.email_verified,
            };
            await userModel.create(user);
          }

          const jwtToken = jwt.sign(
            { user: { id: user._id, name: user.name, email: user.email } },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          return done(null, { user, token: jwtToken });
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

export default passportGoogleMiddleware;



/*
profile from google: 
 {
  id: '109004197870928286040',
  displayName: 'Deependra Sing Shekhawat',
  name: { familyName: 'Shekhawat', givenName: 'Deependra Sing' },
  emails: [ { value: 'deepshekhawat79999@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a/ACg8ocJt5TLD2p9FkMUOunKKz2gPlDI7lRQb4yL9Sri4GezPECzjTw=s96-c'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "109004197870928286040",\n' +
    '  "name": "Deependra Sing Shekhawat",\n' +
    '  "given_name": "Deependra Sing",\n' +
    '  "family_name": "Shekhawat",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocJt5TLD2p9FkMUOunKKz2gPlDI7lRQb4yL9Sri4GezPECzjTw\\u003ds96-c",\n' +
    '  "email": "deepshekhawat79999@gmail.com",\n' +
    '  "email_verified": true\n' +
    '}',
  _json: {
    sub: '109004197870928286040',
    name: 'Deependra Sing Shekhawat',
    given_name: 'Deependra Sing',
    family_name: 'Shekhawat',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocJt5TLD2p9FkMUOunKKz2gPlDI7lRQb4yL9Sri4GezPECzjTw=s96-c',        
    email: 'deepshekhawat79999@gmail.com',
    email_verified: true
  }
}
*/