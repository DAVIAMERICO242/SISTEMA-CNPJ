import { useState, useEffect } from 'react'
import './index.css'
import {SignIn} from './login/login'
import {Painel} from './logged/painel'
const BACKEND_URL = (import.meta.env.VITE_PROD_ENV==='TRUE')?(`https://${import.meta.env.VITE_BACKEND_PROXY}`):(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`)

function App() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(()=>{
      fetch(`${BACKEND_URL}/is_user_auth`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json' // Assuming JSON data is being sent
        },
        body:JSON.stringify({
          token: localStorage.getItem('token')
        })
      }).then((response)=>{
          if(response.status===200){
            setIsAuth(true);
          }else{
            setIsAuth(0);
          }
      }).catch(()=>{setIsAuth(0);console.log('NAO AUTORIZADO');})
    }
  ,[]);

  return (
    <>
       {(isAuth===null)?
            (<div>Aguarde...</div>):(isAuth===false || isAuth===0)?<SignIn isAuth = {isAuth} setIsAuth={setIsAuth}/>:<Painel/>
       }
    </>
  )
}

export default App
