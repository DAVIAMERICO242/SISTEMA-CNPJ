require('dotenv').config();
const cheerio = require('cheerio');
const cell_number_XPATH = process.env.CELL_NUMBER_XPATH;
const capitalsocial_XPATH = process.env.CAPITALSOCIAL_XPATH;
const capitalsocial_SECONDXPATH = process.env.CAPITALSOCIAL_SECONDXPATH;
const fetch = require('node-fetch');
const {getRandomProxy} = require('../../proxy-list/random-proxy')
const {getRandomUserAgent} = require('../../user agents/random-user-agent');
console.log('XPATH TELEFONE');
console.log(cell_number_XPATH);
console.log('XPATH CAPITAL SOCIAL');
console.log(capitalsocial_XPATH);
console.log('SECOND XPATH CAPITAL SOCIAL');
console.log(capitalsocial_SECONDXPATH);


function get_cnpj_XPATH_data(cnpj,current_cnpj_data){
    return new Promise((resolve,reject)=>{
        a = '54258001000160';
        try{
            var random_proxy = getRandomProxy();
            var random_user_agent = getRandomUserAgent();
            fetch(`https://casadosdados.com.br/solucao/cnpj/${cnpj}`,{
                agent: random_proxy,
                method:"GET",
                headers: {
                    'User-Agent': random_user_agent,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                    console.log('PROXY BEM SUCEDIDO AO PEGAR TELEFONE');
                    console.log(random_proxy?.proxy?.origin);
                    console.log('USE AGENT BEM SUCEDIDO AO PEGAR TELEFONE');
                    console.log(random_user_agent);
                    return response.text(); // Reading response as text
            })
            .then(html => {
                const $ = cheerio.load(html);
                var capital_social = $(capitalsocial_XPATH).text();
                if(!capital_social.includes("$")){
                    var capital_social = $(capitalsocial_SECONDXPATH).text();
                }
                resolve(
                    {
                       'current_telefone': $(cell_number_XPATH).text(),
                       'current_capital_social': capital_social,
                       'current_cnpj_data': current_cnpj_data    
                    }
                );
                // Faça algo com os dados recebidos
            }).catch(error => {
                console.log('PROXY MAL SUCEDIDO AO PEGAR TELEFONE');
                console.log(random_proxy?.proxy?.origin);
                console.log('USE AGENT MAL SUCEDIDO AO PEGAR TELEFONE');
                console.log(random_user_agent);
                console.log('foi cnpj particular erro')
                reject(null);
            });
        }catch{
            console.log('erro 2')
            reject(null);
        }
       
    })
}

module.exports={get_cnpj_XPATH_data}