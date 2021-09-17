const { create } = require('ipfs-http-client')

const projectId = process.env.IPFS_projectId
const projectSecret = process.env.IPFS_projectSecret
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfsAddClient = create({
  host: process.env.IPFS_HOST,
  port: process.env.IPFS_PORT,
  protocol: process.env.IPFS_PROTOCOL,
  //apiPath: '/ipfs/api/v0',
  //apiPath: '/api/v0',
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
