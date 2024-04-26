const {get_all_cnpj_data} = require('./get_ALL_cnpj_data');
const {remove_array_object_duplicates} = require('../../../essentials/unique-array-json');


async function main_cnpj_model(ufs,cidades,bairros=[], atividades=[]){

   try{
        var out = await get_all_cnpj_data(50,ufs,cidades, bairros, atividades);
        // console.log('PASSOU POR OUT');
        // console.log(out);
        var clean = remove_array_object_duplicates(out,key="CNPJ");
        // console.log('CLEAN');
        // console.log(clean);
        if(clean?.length){
            return clean;
        }else{
            return false;
        }
    }catch(error){
        console.log('erro');
        return false;
    }  

    
}

module.exports={main_cnpj_model}