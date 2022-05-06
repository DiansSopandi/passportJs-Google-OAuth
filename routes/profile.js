import { Router } from 'express';
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.get('/', ( req,res ) => {
    // console.log(req);
    res.send(`U r logged in this profile ${req?.user?.username}`);
});

export default router;  