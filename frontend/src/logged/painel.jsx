import {useState,useEffect} from 'react';
import Select from 'react-select'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`)

function remove_array_object_duplicates(array_obj,key="value"){//[obj1,obj2,...]
    console.log('input key')
    console.log(key)
    if(!array_obj){
        return [];
    }
    var empiric = [];
    var new_array_obj = array_obj.map((e)=>{
        if(e.hasOwnProperty(key)){
            if(!(empiric.includes(e[key]))){
                empiric.push(e[key]);//nao passa por esse valor de cnpj novamente
                return e;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }).filter((e1)=>e1);
    return new_array_obj;
}

function remove_array_object_duplicates_deep1(array_obj,key_deep0="classe",key_deep1="id"){//[obj1:obj11,obj2:obj22,...]
    if(!array_obj){
        return [];
    }
    var empiric = [];
    var new_array_obj = array_obj.map((e)=>{
        if(e.hasOwnProperty(key_deep0)){
            if(e[key_deep0].hasOwnProperty(key_deep1)){
                if(!(empiric.includes(e[key_deep0][key_deep1]))){
                    empiric.push(e[key_deep0][key_deep1]);//nao passa por esse valor de cnpj novamente
                    return e;
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }else{
            return null;
        }
    }).filter((e1)=>e1);
    return new_array_obj;
}


function getCurrentDateTimeString() {
    const currentDate = new Date();

    // Get day, month, year, hour, and minute components
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');

    // Format the date string as day_month_year_hour_minute
    return `${day}_${month}_${year}_${hour}h${minute}m`;
}




export const Painel = () => {
    const [BRStates,setBRStates] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [availableCities,setAvailableCities] = useState([]);
    const [selectedCities,setSelectedCities] = useState([]);
    const [bairros, setBairros] = useState([]);
    const [CNAEs,setCNAEs] = useState([]);
    const [selectedCNAEs,setSelectedCNAEs] = useState([]);
    const [loading,setLoading] = useState(null);
    const [success, setSuccess] = useState(null);
    const [cnpjData, setCnpjData] = useState([]);

    useEffect(()=>{//api estados
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then((data)=>data.json())
        .then((uf_data)=>{
            uf_data.map((uf)=>{
                setBRStates((prev)=>[...prev,{value: [uf.sigla,uf.id], label:uf.nome}])
            })
        })
    },[]);

    useEffect(()=>{//api cidades
        if(selectedStates.length){
            const pattern_state_ids = selectedStates.map((e)=>e[1]).join("|");
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${pattern_state_ids}/distritos`).then((data)=>data.json())
            .then((cidade_data)=>{
                var found_cidades = cidade_data.map((e)=>e.nome)
                cidade_data.map((cidade)=>{
                    setAvailableCities((prev)=>
                        remove_array_object_duplicates([...prev,{value: cidade.nome, label: cidade.nome}].filter((e)=>{
                            if(e?.value){
                                return found_cidades.includes(e.value);
                            }else{
                                return false;
                            }
                        }))
                    );
                });
            });
        }else{
            setAvailableCities([]);
        }
    },[selectedStates]);

    useEffect(()=>{//api CNAE geral
        fetch("https://servicodados.ibge.gov.br/api/v2/cnae/subclasses").then((data)=>data.json())
        .then((CNAE_data)=>{
            var CNAE_data_unique_major_classes = remove_array_object_duplicates(remove_array_object_duplicates_deep1(CNAE_data),"id").sort((a, b) => parseInt(a.id) - parseInt(b.id));
            console.log('final CNAE');
            console.log(CNAE_data_unique_major_classes);
            CNAE_data_unique_major_classes.map((cnae)=>{
                setCNAEs((prev)=>[...prev,{value: cnae.id, label: cnae.descricao}]);
            });
            setCNAEs((prev)=>remove_array_object_duplicates(prev));
        })

    },[]);

    useEffect(()=>{
        console.log('CNAES CARREGADOS NO ESTADO');
        console.log(CNAEs)

    },[CNAEs])





    const manage_selected_states = (e)=>{
        setSelectedStates(e.map((e)=>e?.value));
    }

    const manage_selected_cities = (e)=>{

        setSelectedCities(e.map((e)=>e.value.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
        
    }

    const manage_selected_cnaes = (e)=>{
        setSelectedCNAEs(e.map((e)=>e?.value));
    }

    const manage_bairros = (e)=>{
        console.log('onchange bairros');
        console.log(e.target.value);
        setBairros(e.target.value.split(",").map((e)=>e.trim()));
    }

    useEffect(()=>{
        console.log('ESTADOS SELECIONADOS');
        console.log(selectedStates);
        console.log('CIDADES SELECIONADAS');
        console.log(selectedCities);
        console.log('BAIRROS SELECIONADOS');
        console.log(bairros);
        console.log('CNAES SELECIONADOS');
        console.log(selectedCNAEs);
    },[selectedStates,selectedCities, bairros, selectedCNAEs])

    const search = async ()=>{
        setSuccess(null);
        console.log('trigado');
        setLoading(true);
        fetch(`${BACKEND_URL}/cnpj_data`,{
            method:'POST',
            headers: {
              'Content-Type': 'application/json' // Assuming JSON data is being sent
            },
            body:JSON.stringify({
              token: localStorage.getItem('token'),
              ufs : selectedStates.map((e)=>e[0]),
              cidades : selectedCities,
              bairros : bairros,
              atividades : selectedCNAEs
            })
          }).then((response)=>{
                return response.json()
          }).then((cnpj_data)=>{
                setCnpjData(cnpj_data);
                setLoading(false);
                setSuccess(true);
                console.log(cnpj_data);
          })
          .catch((error)=>{console.log(error);setLoading(false); alert('Nenhum dado encontrado para os filtros selecionados, caso o problema persistir, logue e tente novamente!')})
    }

    const download = async (e)=>{

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(cnpjData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign Data');
  
        // Generate a Blob object containing the workbook
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
        // Save the Blob object as a file using FileSaver.js
        saveAs(blob, `CNPJS_${getCurrentDateTimeString()}.xlsx`);
    }

    const logout = async ()=>{
        localStorage.clear();
        location.reload();
    }


  return (
    <div id="painel">
        <div id="pseudo_form">
            <a className="sair" href="#" onClick={()=>{logout()}}>Sair</a>
            <div className="title">
                <img src="cnpj.png" alt="" />
                <div className="main_title">BUSCADOR DE CNPJs EM MASSA</div>
            </div>
            <div className="group">
                <div>
                    <div className="generic_label">
                        Estados:
                    </div>
                    <div style={{width: '300px'}}>
                        <Select style={{width: '300px'}}  className="basic-multi-select" classNamePrefix="select" isMulti options={BRStates} onChange={(e)=>manage_selected_states(e)} />
                    </div>
                </div>
                <div>
                    <div className="generic_label">
                        Cidades:
                    </div>
                    <div style={{width: '300px'}}>
                        <Select style={{width: '300px'}} className="basic-multi-select" classNamePrefix="select" isMulti options={availableCities} onChange={(e)=>manage_selected_cities(e)} />
                    </div>
                </div>
            </div>
            <div className="group">
                <div>
                    <div className="generic_label">
                        Bairros (separar por vírgula):
                    </div>
                    <input onChange = {(e)=>manage_bairros(e)} className="generic_input" type="text" />
                </div>
                <div>
                    <div className="generic_label">
                        Atividade (CNAE):
                    </div>
                    <div style={{width: '300px'}}>
                        <Select style={{width: '300px'}} className="basic-multi-select" classNamePrefix="select" isMulti options={CNAEs} onChange={(e)=>manage_selected_cnaes(e)} />
                    </div>
                </div>
            </div>
            {loading?<div className="wait">Aguarde, esse processo pode levar alguns segundos...</div>:null}
            {success?<div className="success">Operação concluida com sucesso <a onClick={()=>{download()}} href="#">baixar excel</a></div>:null}
            <button onClick={()=>{search()}} className={"generic_button " + (loading?'loading':'')}>Buscar</button>
        </div>
    </div>
  )
}

