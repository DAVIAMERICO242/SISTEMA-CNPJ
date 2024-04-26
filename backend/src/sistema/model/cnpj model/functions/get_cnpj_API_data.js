const {getRandomUserAgent} = require('../../user agents/random-user-agent');

function get_cnpj_API_data(page,ufs,cidades, bairros = [], atividades=[]){
    console.log('DADOS DA REQUISIÇÃO');
    console.log([page,ufs,cidades,bairros,atividades]);
    console.log('USER AGENT');
    console.log(getRandomUserAgent());
    return new Promise((resolve,reject)=>{
        fetch('https://api.casadosdados.com.br/v2/public/cnpj/search', {//dados pagina 3
            method: 'POST',
            headers: {
                'User-Agent': getRandomUserAgent(),
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
            console.log(error)
            reject(null);
        });
    })
}

module.exports={
    get_cnpj_API_data
}