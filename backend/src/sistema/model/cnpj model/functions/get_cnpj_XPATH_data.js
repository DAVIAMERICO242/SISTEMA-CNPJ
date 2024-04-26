require('dotenv').config();
const cheerio = require('cheerio');
const cell_number_XPATH = process.env.CELL_NUMBER_XPATH;
const capitalsocial_XPATH = process.env.CAPITALSOCIAL_XPATH;
const capitalsocial_SECONDXPATH = process.env.CAPITALSOCIAL_SECONDXPATH;

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
        fetch(`https://casadosdados.com.br/solucao/cnpj/${cnpj}`,{
            method:"GET",
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
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
            console.log(error);
            console.log('foi cnpj particular erro')
            reject(null);
        });
    })
}

module.exports={get_cnpj_XPATH_data}