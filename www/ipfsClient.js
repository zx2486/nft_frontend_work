const { create } = require('ipfs-http-client')

const projectId = '1yDTSBQWLUgeIFh8shye7WDzEGl'
const projectSecret = '02d0ab9bec00372c06b7b56ca3490476'
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfsAddClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
})

module.exports = ipfsAddClient;

/*module.exports.addAFile = (file) =>{
    const added = await client.add(file)
	//console.log("Signing message"+signingAddress);
	return added;
};*/