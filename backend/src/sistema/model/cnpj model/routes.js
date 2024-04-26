require('dotenv').config();
const {main_cnpj_model} = require('./functions/main_model');
const cnpj_routes = require('express').Router();
const {array_json_to_excel} = require('../../essentials/json-array-to-excel');
const {getCurrentDateTimeString} = require('../../essentials/getCurrentFormatedDate');
const return_excel = process.env.RETURN_EXCEL==='TRUE'?true:false;
const secretKey = '32RK342TG90354NGYT30NH'; // Change this to a secure random key
const jwt = require('jsonwebtoken');
console.log('ENV RETURN EXCEL:');
console.log(return_excel);

cnpj_routes.post('/cnpj_data', async (req,res)=>{
    try{
        console.log('oi');
        console.log(req.body);
        var {token} = req.body;
        if(!token){
            return res.status(400).end();
        }
        try{
            jwt.verify(token,secretKey);
        }catch{
            return res.status(400).end();
        }
        var {ufs} = req.body;
        var {cidades} = req.body;
        var {bairros} = req.body;
        var {atividades} = req.body;
        if(!ufs){
            ufs = [];
        }
        if(!cidades){
            cidades = [];
        }
        if(!bairros){
            bairros = [];
        }else{
            bairros = bairros.filter((e)=>e)
        }
        if(!atividades){
            atividades = [];
        }
        console.log('ASSIM QUE ENTROU');
        console.log([ufs,cidades,bairros,atividades]);
        const output = await main_cnpj_model(ufs,cidades,bairros,atividades);
        if(return_excel){
            await array_json_to_excel(output, prefix=getCurrentDateTimeString());
        }
        console.log('OUTPUT');
        console.log(output);
        if(!output){
            return res.status(500).send('falha');
        }
        return res.status(200).send(output);
    }catch(error){
        console.log(error);
        res.status(500).end();

    }
});

module.exports={
    cnpj_routes
}

