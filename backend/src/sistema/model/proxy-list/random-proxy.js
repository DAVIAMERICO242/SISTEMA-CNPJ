const { HttpsProxyAgent } = require('https-proxy-agent');
const proxies = [
      'http://darodriguesufc:8jaAbKMAbn@200.239.217.184:51523',
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
