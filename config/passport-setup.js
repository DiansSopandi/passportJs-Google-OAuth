import passport from 'passport';
// import passportGoogleOauth from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { key } from './keys.js';
import User from '../models/User.js';

// const GoogleStrategy = passportGoogleOauth.Strategy;

passport.serializeUser(( user, done) =>{    
    done(null,user.id); // id table mongodb (_ids)
});

passport.deserializeUser(( id, done) =>{    
    User.findById(id)
    .then((user) => { 
        done(null,user);
    })
    .catch((error) => console.log(` Error Find By ID ${error.emails}`));
});

passport.use(
    // new GoogleStrategy({
    new Strategy({
            // option for google strategy
            clientID : key.google.clientID,
            clientSecret : key.google.clientSecret,
            callbackURL : 'http://localhost:3000/auth/google/redirect'
            // callbackURL : 'auth/google/redirect',
            // passReqToCallback :  true
        },  
            (accessToken, refreshToken, profile, done) => {
                // passport callback function()
                // User.findOrCreate( {googleid:profile.id}, ( err, user ) => {
                //     return done( err, user );
                // });
                // console.log(profile);
                
                User.findOne({googleId : profile?.id})
                .then((currUser) => {
                    if (currUser) {
                        console.log(`User ${currUser.username} \n ${currUser.email} already exist`);
                        done(null,currUser);
                    } else {
                        let user = new User({
                            googleId : profile.id,
                            email : profile.emails[0].value,
                            username : profile.displayName,
                        });
        
                        user.save()
                        .then( (newUser) => {
                            console.log(`user ${newUser} created`)
                            done(null,newUser);
                        })
                        .catch( (error) => console.log(`save fail ${error.message}`));
                    }
                })
                .catch((error) => console.log(` Error Query ${error.message}`));                
            }
        )
);

export default passport;