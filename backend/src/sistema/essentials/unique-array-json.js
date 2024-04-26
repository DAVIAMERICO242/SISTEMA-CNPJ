function remove_array_object_duplicates(array_obj,key="CNPJ"){//[obj1,obj2,...]
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

module.exports={
    remove_array_object_duplicates
}