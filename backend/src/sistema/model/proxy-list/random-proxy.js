const { HttpsProxyAgent } = require('https-proxy-agent');

const proxies = [
     'http://20.206.106.192:3128',
     'http://195.154.184.80:8080',
     'http://103.113.71.230:3128',
     'http://117.250.3.58:8080',
     'http://5.252.23.220:3128',
     'http://20.111.54.16:80',
     'http://20.210.113.32:80',
     'http://212.112.113.178:3128'
];

function getRandomProxy() {
    if(process.env.IS_PROXY==='TRUE'){
        return new HttpsProxyAgent(proxies[Math.floor(Math.random() * proxies.length)]);
    }else{
        return null;
    }
}

module.exports={
    getRandomProxy
}
