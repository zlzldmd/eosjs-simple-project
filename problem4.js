const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { PrivateKey, PublicKey, Signature, Aes, key_utils, config } = require('eosjs-ecc');
const { TextEncoder, TextDecoder } = require('util');
const fetch = require('node-fetch');

let privateKeys = [];// user private keys
const rpc = new JsonRpc('http://192.168.1.75:8010', { fetch });
const signatureProvider = new JsSignatureProvider(privateKeys);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

async function main() {
let arr = [];
try {
const info = await rpc.get_info();
const firstBP = info.head_block_producer;
const firstBlockNumber = info.head_block_num;
arr.push(info.head_block_producer);
while(1) {
const info = await rpc.get_info();
const nextBP = info.head_block_producer;
const nextBlockNumber = info.head_block_num;
if(arr[0] === nextBP) {
if(nextBlockNumber >= firstBlockNumber + 12)
break;
} else {
if(arr.indexOf(nextBP) == -1)
arr.push(nextBP);
}
}
for(let i=0; i<arr.length; i++)
console.log(arr[i]);
} catch (error) {
console.error(error);
}
}

main();