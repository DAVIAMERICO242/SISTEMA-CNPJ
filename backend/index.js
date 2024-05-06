require('dotenv').config();
const backend_port = process.env.BACKEND_PORT;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {cnpj_routes} = require('./src/sistema/model/cnpj model/routes');
const {login_router} = require('./src/sistema/auth/login')
const cors = require('cors');
const FRONTEND_URL = (process.env.PROD_ENV==="TRUE")?(`https://${process.env.FRONTEND_PROXY}`):(`http://localhost:${process.env.FRONTEND_PORT}`);

process.on('uncaughtException', (err) => {
  if (err.code === 'ECONNRESET') {
    console.error('Erro de conexão resetada:', err);
    // Lógica para lidar com o erro ou apenas logá-lo, se necessário
  } else {
    // Se não for um erro 'ECONNRESET', deixe o Node.js encerrar normalmente
    console.error('Erro não tratado:', err);
  }
});


app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
  }));


app.use('/',login_router);
app.use('/',cnpj_routes);

app.listen(backend_port,()=>{
    console.log(`rodando na porta ${backend_port}`);
})