require('dotenv').config();
const login_router = require('express').Router()
const jwt = require('jsonwebtoken');
const secretKey = '32RK342TG90354NGYT30NH'; // Change this to a secure random key
const users = [{'admin':'896321574'},{'comercial':'Skyler@1997'}]

login_router.post('/auth', async (req, res) => {
    console.log('entrou');
    console.log(req.body)
    const {user} = req.body;
    const {pass} = req.body;
    console.log([user,pass])
    if(!(user && pass)){
        return res.status(404).end();
    }
    const userObject = { [user]: pass };
    const exists = users.some(obj => JSON.stringify(obj) === JSON.stringify(userObject));
    if(exists){
        const token = jwt.sign({ username: user }, secretKey, { expiresIn: 60 * 60 * 24 * 7 });
        return res.status(200).json({token});
    }else{
        return res.status(404).end();
    }
});

login_router.post('/is_user_auth', async (req,res)=>{
    console.log('entrou');
    if(req.body.token){
        const token = req.body.token;
        try{
            jwt.verify(token, secretKey);
            res.status(200).end();
            console.log('AUTH');
        }catch(error){
            console.log(error);
            res.status(400).end();
        }
    }else{
        console.log('UNAUTH');
        res.status(400).end();
    }
}
);

module.exports={
    login_router
}