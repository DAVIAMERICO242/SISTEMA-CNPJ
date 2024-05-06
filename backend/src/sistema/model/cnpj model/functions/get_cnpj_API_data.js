const {getRandomUserAgent} = require('../../user agents/random-user-agent');
const fetch = require('node-fetch');
const {getRandomProxy} = require('../../proxy-list/random-proxy')

function get_cnpj_API_data(page,ufs,cidades, bairros = [], atividades=[]){
    return new Promise((resolve,reject)=>{
        try{
            var random_proxy = getRandomProxy();
            var random_user_agent = getRandomUserAgent();
            console.log('DADOS DA REQUISIÇÃO');
            console.log([page,ufs,cidades,bairros,atividades]);
            console.log('USER AGENT');
            console.log(random_user_agent);
            console.log('RANDOM PROXY');
            console.log(random_proxy.proxy.origin);
            fetch('https://api.casadosdados.com.br/v2/public/cnpj/search', {//dados pagina 3
                agent: random_proxy,
                method: 'POST',
                headers: {
                    'User-Agent': random_user_agent,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "query": {
                    "termo": [],
                    "atividade_principal": atividades,
                    "natureza_juridica": [],
                    "uf": ufs,
                    "municipio": cidades,
                    "bairro": bairros,
                    "situacao_cadastral": "ATIVA",
                    "cep": [],
                    "ddd": []
                    },
                    "range_query": {
                    "data_abertura": {
                        "lte": null,
                        "gte": null
                    },
                    "capital_social": {
                        "lte": null,
                        "gte": null
                    }
                    },
                    "extras": {
                    "somente_mei": false,
                    "excluir_mei": false,
                    "com_email": false,
                    "incluir_atividade_secundaria": false,
                    "com_contato_telefonico": false,
                    "somente_fixo": false,
                    "somente_celular": false,
                    "somente_matriz": false,
                    "somente_filial": false
                    },
                    "page": parseInt(page)
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao fazer a requisição: ' + response.statusText);
                }
                return response.json();
            })
            .then(page_data => {
            // Faça algo com os dados recebidos
                resolve(page_data.data?.cnpj);
            })
            .catch(error => {
                console.log('FOI API GERAL REQUEST ERROR')
                console.log(error)
                reject(null);
            });

        }catch(error){
            reject(null);
        }
    })
}

module.exports={
    get_cnpj_API_data
}