import { Router, json, urlencoded } from "express";
import passport from 'passport';
// import cors from 'cors'
// import { json, urlencoded } from 'body-parser';
import bodyParser from 'body-parser';


const  router = Router();

router.use(bodyParser.urlencoded({ extended : true }));
router.use(bodyParser.json());

// auth login
router.get('/login', ( req,res) => {
    res.render('login');
});

// auth logout
router.get('/logout', ( req,res ) => {
    // handle with passport
    res.send('logging Out');
});

// auth login with google
// app.get('/google', (req,res)=>{
//     res.send('logging in with google');
// });
router.get('/google', passport.authenticate('google',{ scope : ['profile','email'] }));

// callback route for google to redirect
router.get('/google/redirect', passport.authenticate('google'), ( req,res ) => {
    // console.log(req);
    // res.send(req.user);
    res.redirect('/profile/');
});


export default router;