const {get_all_cnpj_data} = require('./get_ALL_cnpj_data');
const {remove_array_object_duplicates} = require('../../../essentials/unique-array-json');


async function main_cnpj_model(ufs,cidades,bairros=[], atividades=[]){

   try{
        var out = await get_all_cnpj_data(50,ufs,cidades, bairros, atividades);
        // console.log('PASSOU POR OUT');
        // console.log(out);
        var clean = remove_array_object_duplicates(out,key="CNPJ");
        console.log(clean);
        var more_clean = clean.filter((e)=>{//tirando telefones invalidos
            if(e.hasOwnProperty('TELEFONE')){
                return e['TELEFONE'] !== 'nao encontrado' && e['CAPITAL SOCIAL'].includes('$') && !e['TELEFONE'].includes('@');
            }else{
                return false;
            }
        });
        more_clean.sort((a,b)=>{//ordenando por capital social
            if(a.hasOwnProperty('CAPITAL SOCIAL') && b.hasOwnProperty('CAPITAL SOCIAL')){
                var clean_a = a['CAPITAL SOCIAL'].replace('R','').replace('$','').replace('.','').trim().replace(" ",'');
                var clean_b = b['CAPITAL SOCIAL'].replace('R','').replace('$','').replace('.','').trim().replace(" ",'');
                return -1*(parseFloat(clean_a) - parseFloat(clean_b));
            }else{
                return a-b;
            }
        })
        // console.log('CLEAN');
        // console.log(clean);
        if(more_clean?.length){
            return more_clean;
        }else if(clean.length){//indica problema no xpath
            console.log('XPATH WARNING: CLEAN VAZIO AO LIMPAR NUMEROS')
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