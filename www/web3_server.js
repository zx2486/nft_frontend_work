const Web3 = require('web3'); 
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA));

module.exports = web3;

module.exports.web3Verify = (address,message,signatureObject) =>{
    var signingAddress = web3.eth.accounts.recover(web3.utils.utf8ToHex(message), signatureObject);
	//console.log("Signing message"+signingAddress);
	return (signingAddress == address)? true:false;
};
