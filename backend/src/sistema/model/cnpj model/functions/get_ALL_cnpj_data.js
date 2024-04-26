const {get_cnpj_API_data} = require('./get_cnpj_API_data');
const {get_cnpj_XPATH_data} = require('./get_cnpj_XPATH_data');
const {sleep} = require('../../../essentials/promise-sleep');
const {formatDate} = require('../../../essentials/date-formate');

function get_all_cnpj_data(n_pages,ufs,cidades, bairros, atividades){
        return new Promise(async (resolve_all_loop,reject_all_loop)=>{
            const cnpj_data_promises = [];//nao precisa
            const XPATH_promises = [];//nao precisa
            const last_promises = [];//util p krl
            var future_excel = [];
            var current_page_data = undefined;
            var current_telefone = undefined;
            for(let i=0;i<=n_pages;i++){
                await sleep(500);
                try{
                    var get_cnpj_API_data_promise = get_cnpj_API_data(i,ufs,cidades, bairros, atividades);
                    cnpj_data_promises.push(get_cnpj_API_data_promise);
                    get_cnpj_API_data_promise.then((current_page_data)=>{
                        // console.log('deu')
                        if(current_page_data?.length){
                            for(let j=0;j<=current_page_data.length;j++){
                                var current_cnpj_data = current_page_data[j];
                                if(current_cnpj_data?.cnpj){
                                    var get_cnpj_XPATH_data_promise = get_cnpj_XPATH_data(current_cnpj_data['cnpj'], current_cnpj_data);
                                    XPATH_promises.push(get_cnpj_XPATH_data_promise)
                                    var last_promise = get_cnpj_XPATH_data_promise.then(({current_telefone, current_capital_social ,current_cnpj_data})=>{
                                        future_excel.push({
                                            "TELEFONE":current_telefone || 'nao encontrado',
                                            "RAZAO": current_cnpj_data['razao_social'] || 'nao encontrado',
                                            "CNPJ":current_cnpj_data['cnpj'],
                                            "MEI":current_cnpj_data['cnpj_mei']?'sim':'nao',
                                            "CAPITAL SOCIAL": current_capital_social,
                                            "DATA ABERTURA": formatDate(current_cnpj_data['data_abertura']) || 'nao encontrado',
                                            "CODIGO ATIVIDADE":  current_cnpj_data?.atividade_principal?.codigo || 'nao encontrado',
                                            "ATIVIDADE": current_cnpj_data?.atividade_principal?.descricao || 'nao encontrado',
                                            "ESTADO": current_cnpj_data['uf'] || 'nao encontrado',
                                            "MUNICIPIO": current_cnpj_data['municipio'] || 'nao encontrado',
                                            "BAIRRO": current_cnpj_data['bairro'] || 'nao encontrado',
                                            "LOGRADOURO": current_cnpj_data['logradouro'] || 'nao encontrado',
                                            "NUMERO": current_cnpj_data['numero'] || 'nao encontrado'
                                            
                                        })
                                        return future_excel;
                                        // console.log(future_excel.length)
                                    }).catch(()=>null);
                                    last_promises.push(last_promise);
                                }
                            }
                        }
    
                    }).catch(()=>console.log('instabilidade'));// é a pagina atual nao cnpj atual
                }catch(error){
                    console.log('instabilidade na requisição');
                }
            }

            if(last_promises[last_promises.length-1] instanceof Promise){
                last_promises[last_promises.length-1].then((future_excel)=>{
                    resolve_all_loop(future_excel);
                }).catch(()=>reject_all_loop(null))
            }else{
                reject_all_loop(null)
            }

            // var reverted_promises = last_promises.reverse();

            // console.log('reverted promises');
            // console.log(reverted_promises);
            // console.log('reverted promises 0');
            // console.log(reverted_promises[0]);

            // var was_solved = 0;

            // var isResolved = false; // Variável de controle para indicar se uma promessa foi resolvida

            // for (var k = 0; k < reverted_promises.length; k++) {
            //     if (isResolved) break; // Se uma promessa já foi resolvida, saia do loop
            //     reverted_promises[k].then((future_excel) => {
            //         console.log('PROMISE NO LOOP');
            //         console.log(reverted_promises[k]);
            //         if (future_excel) {
            //             console.log(resolveu);
            //             resolve_all_loop(future_excel);
            //             isResolved = true; // Define a variável de controle para true para indicar que uma promessa foi resolvida
            //         }
            //     }).catch(() => {});
            // }
            
            
            // if(!was_solved){
            //     reject_all_loop([]);
            // }
        })
    
    // console.log('FINAL');
    // console.log(future_excel);
}

module.exports={get_all_cnpj_data}
