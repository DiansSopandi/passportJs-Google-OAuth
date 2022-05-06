import express from "express";
import mongoose from "mongoose";
import passport from 'passport';
import passportSetup from './config/passport-setup.js';
import { key } from './config/keys.js'
import authRoute from "./routes/auth.js";
import profileRoute from "./routes/profile.js";
import cookiesSession from 'cookie-session';


const app = express();

//set view engine
app.set('view engine','ejs');

// set up routes
app.use('/auth',authRoute);
app.use('/profile',profileRoute);

app.use(cookiesSession({
    maxAge: 24*60*60*1000,
    keys: [key.session.cookieKey],
}));

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// craete home route
app.get('/', ( req,res ) => {
    res.render('home');
});

const appListen = () => {
    const DOMAIN = key.domain;
    const PORT = key.port;    

    return  app.listen(PORT, () => {
                console.log(`Server running on ${DOMAIN}`);
            });
}

const main = async () => {
    try {
        const DB = key.mongodb.local;
        // const DB = key.mongodb.atlas;

        await   mongoose.connect(DB,{
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
                .then( appListen() )
                // .then(app.listen(PORT, () => {
                //         console.log(`Server running on ${DOMAIN}`);
                // }))
                .catch( (error) => console.log(`connection error ${error.message}`) );
    } catch (error) {
        console.log(`unable to start server : \n ${error}`);
    }
} 

main();