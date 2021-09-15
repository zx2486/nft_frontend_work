"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;

let isAddressRegistered = false;
let isLogin = false;
/**
 * Setup the orchestra
 */
function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  /*if(location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
	document.querySelector("#btn-connect").style.display = "none";
	document.querySelector("#btn-disconnect").style.display = "none";
	document.querySelector("#btn-account").style.display = "none";
    return;
  }*/

	/*if(localStorage.getItem('provider')){
		provider = JSON.parse(localStorage.getItem('provider'));
		refreshAccountData();
		return;
	}*/
	
  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // API ID
        infuraId: "b5acd841e49740edb7c74a80e91ed5ac",
      }
    },

    /*fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350"
      }
    }
	*/
  };

  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  console.log("Web3Modal instance is", web3Modal);
  if(localStorage.getItem('myAccount')){
	  onConnect();
	  var addressElements = document.getElementsByName("address");
	  for(var i=0;i<addressElements.length;i++){
		addressElements[i].value = localStorage.getItem('myAccount');
	  }
  }
  if(localStorage.getItem('myEmail') && localStorage.getItem('myEmail')!="false"){
	  var addressElements = document.getElementsByName("email");
	  for(var i=0;i<addressElements.length;i++){
		addressElements[i].value = localStorage.getItem('myEmail');
	  }
  }
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {  
  if(document.querySelector("#artworkLoginButton")) 
	  document.querySelector("#artworkLoginButton").style.display = "none";
  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);
	//if(!isLogin) return;
  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);
  //document.querySelector("#network-name").textContent = chainData.name;

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  //document.querySelector("#selected-account").textContent = selectedAccount;
  //Get the balance
  const balance = await web3.eth.getBalance(selectedAccount);
  // ethBalance is a BigNumber instance
  // https://github.com/indutny/bn.js/
  const ethBalance = web3.utils.fromWei(balance, "ether");
  const humanFriendlyBalance = parseFloat(ethBalance).toFixed(6);
  //document.querySelector("#selected-balance").textContent = humanFriendlyBalance;
  var isDifferentAccount = (localStorage.getItem('myAccount') && localStorage.getItem('myAccount') != selectedAccount)?
	true : false;
  localStorage.setItem('myAccount', selectedAccount);

$.ajax({
  url: "/getEmail/"+selectedAccount,
  beforeSend: function( xhr ) {
    xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
  }
})
  .done(function( data ) {
    if(!data || !isJsonString(data)){
		return;
	}else{ 
		var insertID = JSON.parse(data);
		insertID = (insertID.email)? insertID.email : false;
		if(insertID){
			if(document.querySelector("#selected-email")){
				document.querySelector("#selected-email").textContent = insertID;
				document.querySelector("#selected-email").style.display = "block";
			}
			if(document.querySelector("#sign-in_emailform")){
				document.querySelector("#sign-in_emailform").style.display = "block";
			}
			//document.querySelector(".sign-in__input-container").style.display = "none";
			if(document.querySelector("#sign-in-form")){
				document.querySelector("#sign-in-form").style.display = "none";
			}
			if(document.querySelector("#defaultAccTitle"))
				document.querySelector("#defaultAccTitle").style.display = "block";
			if(document.querySelector("#defaultRegisTitle"))
				document.querySelector("#defaultRegisTitle").style.display = "none";
			localStorage.setItem('myEmail', insertID);
			if(localStorage.getItem('myAccount')){
				var addressElements = document.getElementsByName("address");
				for(var i=0;i<addressElements.length;i++){
					addressElements[i].value = localStorage.getItem('myAccount');
				}
			}
			if(localStorage.getItem('myEmail') && localStorage.getItem('myEmail')!="false"){
				var addressElements = document.getElementsByName("email");
				for(var i=0;i<addressElements.length;i++){
					addressElements[i].value = localStorage.getItem('myEmail');
				}
			}
			isAddressRegistered = true;
			if(document.getElementById("main_contact_form")) window.location.href = "/profile";
		}else{
			if(document.querySelector("#selected-email")){
				document.querySelector("#selected-email").style.display = "none";
			}
			if(document.querySelector("#sign-in_emailform")){
				document.querySelector("#sign-in_emailform").style.display = "none";
			}
			//document.querySelector(".sign-in__input-container").style.display = "none";
			if(document.querySelector("#sign-in-form")){
				document.querySelector("#sign-in-form").style.display = "block";
			}
			if(document.querySelector("#defaultAccTitle"))
				document.querySelector("#defaultAccTitle").style.display = "none";
			if(document.querySelector("#defaultRegisTitle"))
				document.querySelector("#defaultRegisTitle").style.display = "block";
			localStorage.setItem('myEmail', insertID);
			isAddressRegistered = false;
			//$('#userModalCenter').modal('show');
			if(!document.getElementById("main_contact_form")) window.location.href = "/sign-up";
		}
		if(document.querySelector("#sendEmailButton")){
			document.querySelector("#sendEmailButton").setAttribute("disabled","disabled");
		}
		if (typeof updateBlockchainData === "function" && updateBlockchainData) updateBlockchainData();
	}
  });
  // Get a handl
  //const template = document.querySelector("#template-balance");
  //const accountContainer = document.querySelector("#accounts");

  // Purge UI elements any previously loaded accounts
  //accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    // Fill in the templated row and put in the document
    //const clone = template.content.cloneNode(true);
    //clone.querySelector(".address").textContent = address;
    //clone.querySelector(".balance").textContent = humanFriendlyBalance;
    //accountContainer.appendChild(clone);
	
	console.log(address);
	console.log(humanFriendlyBalance);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  //document.querySelector("#prepare").style.display = "none";
  //document.querySelector("#connected").style.display = "block";
  //if(isDifferentAccount) $('#userModalCenter').modal('show');
  //document.querySelector("#btn-accountdetails").style.display = "block";
  //$('#btn-accDetailButton').click();
  document.querySelector("#btn-connect").style.display = "none";
  //document.querySelector("#btn-disconnect").style.display = "block";
  document.querySelector("#btn-account").style.display = "block";
  if(localStorage.getItem('myAccount')){
	  var addressElements = document.getElementsByName("address");
	  for(var i=0;i<addressElements.length;i++){
		addressElements[i].value = localStorage.getItem('myAccount');
	  }
  }
  if(localStorage.getItem('myEmail') && localStorage.getItem('myEmail')!="false"){
	  var addressElements = document.getElementsByName("email");
	  for(var i=0;i<addressElements.length;i++){
		addressElements[i].value = localStorage.getItem('myEmail');
	  }
  }
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  //document.querySelector("#connected").style.display = "none";
  //document.querySelector("#prepare").style.display = "block";
  //document.querySelector("#btn-accountdetails").style.display = "none";
  document.querySelector("#btn-connect").style.display = "block";
  //document.querySelector("#btn-disconnect").style.display = "none";
  document.querySelector("#btn-account").style.display = "none";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled");
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {
	isLogin = true;
  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });
	//localStorage.setItem('provider',JSON.stringify(provider));
	
  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  //document.querySelector("#prepare").style.display = "block";
  //document.querySelector("#connected").style.display = "none";
  //document.querySelector("#btn-accountdetails").style.display = "none";
  document.querySelector("#btn-connect").style.display = "block";
  //document.querySelector("#btn-disconnect").style.display = "none";
  document.querySelector("#btn-account").style.display = "none";
  if(document.querySelector("#artworkLoginButton")) 
	  document.querySelector("#artworkLoginButton").style.display = "block";
  isLogin = false;
  //localStorage.setItem('myAccount') = false;
  //localStorage.setItem('myEmail') = false;
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  if(document.querySelector("#btn-connect2")) document.querySelector("#btn-connect2").addEventListener("click", onConnect);
  //document.querySelector("#btn-connect3").addEventListener("click", onConnect);
  //document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});

 function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
var minBid = 0.01;
async function readContractData(recordID){
	if(!recordID) return;
	var currentAddress = localStorage.getItem('myAccount');
	var web3CotnractCaller = new Web3(web3.currentProvider);
	var auctionContract = new web3CotnractCaller.eth.Contract(auctionContractABI,
		auctionContractAddress);
	if(auctionContract){
		//This is really calling a function in metamask
		/*var highestBid = await auctionContract.methods
		.highestBid(thisContractAddress,recordID)
		.send({ from: currentAddress });
		*/
		if($('#highestBid')[0] && $('#highestBidder')[0] && $('#pendingReturns')[0] && $('#tradingTable')[0]){
			var highestBid = await auctionContract.methods
			.highestBid(thisContractAddress,recordID)
			.call({ from: currentAddress });
			var ethBalance = web3CotnractCaller.utils.fromWei(highestBid, "ether");
			var humanFriendlyBalance = parseFloat(parseFloat(ethBalance).toFixed(6)).toString();
			var highestBid = humanFriendlyBalance;
			//$('#highestBid')[0].textContent = humanFriendlyBalance;
			var highestBidder = await auctionContract.methods
			.highestBidder(thisContractAddress,recordID)
			.call({ from: currentAddress });
			//$('#highestBidder')[0].textContent = highestBidder;
			var pendingReturns = await auctionContract.methods
			.pendingReturns(thisContractAddress,recordID,currentAddress)
			.call({ from: currentAddress });
			var ethBalance = web3CotnractCaller.utils.fromWei(pendingReturns, "ether");
			var humanFriendlyBalance = parseFloat(parseFloat(ethBalance).toFixed(6));
			var pendingReturns = 0;
			if(humanFriendlyBalance && humanFriendlyBalance >0){
				//$('#pendingReturns')[0].textContent = "You have placed ETH "+humanFriendlyBalance+" before. Placing 0.1 will equal to a "
				//	+(humanFriendlyBalance+0.1)+" bid";
				//$('#pendingReturns')[0].style.display = "block";	
				pendingReturns = humanFriendlyBalance;
			}else{
				//$('#pendingReturns')[0].textContent = "";
				//$('#pendingReturns')[0].style.display = "none";
			}
			var bidCount = await auctionContract.methods
			.bidCount(thisContractAddress,recordID)
			.call({ from: currentAddress });
			
			if(bidCount && bidCount >0){
				var t = $('#tradingTable').DataTable();
				var rowsss = [];
				for(var i=(bidCount-1);i>=0;i--){
					var bids = await auctionContract.methods
					.bids(thisContractAddress,recordID,i)
					.call({ from: currentAddress });
					var ethBalance = web3CotnractCaller.utils.fromWei(bids, "ether");
					var humanFriendlyBalance = parseFloat(parseFloat(ethBalance).toFixed(6)).toString();
					var bidders = await auctionContract.methods
					.bidders(thisContractAddress,recordID,i)
					.call({ from: currentAddress });
					var bidtime = await auctionContract.methods
					.bidtime(thisContractAddress,recordID,i)
					.call({ from: currentAddress });
					rowsss.push([
						humanFriendlyBalance,
						bidders,
						timeToDate(bidtime)
					]);
					/*t.row.add( [
						humanFriendlyBalance,
						bidders,
						bidtime
					] );
					*/
				}
				t.clear();
				t.rows.add(rowsss).draw();
				//t.draw();
			}
			//Update the UI altogether
			$('#highestBid')[0].textContent = highestBid;
			$('#highestBidder')[0].textContent = highestBidder;
			if(pendingReturns){
				$('#pendingReturns')[0].textContent = "You have placed ETH "+pendingReturns+" before. Placing 0.1 will equal to a "
					+parseFloat((pendingReturns+0.1).toFixed(6))+" bid";
				$('#pendingReturns')[0].style.display = "block";
				//Enable withdraw order only is there is pendingReturns
				document.getElementById("withdrawBidButton").removeAttribute("disabled");
			}else{
				$('#pendingReturns')[0].textContent = "";
				$('#pendingReturns')[0].style.display = "none";
				//Disable withdraw order
				document.getElementById("withdrawBidButton").setAttribute("disabled","disabled");
			}
			//Enable placing order only if the data is get and email address is registered
			if(isAddressRegistered){
				document.getElementById("placeBidButton").removeAttribute("disabled");
				minBid = parseFloat(highestBid) + 0.000001;
				if(minBid <=0) minBid = 0.01;
				minBid = minBid - pendingReturns;
				if(minBid <0) minBid = 0;
				document.getElementById("puttingBid").setAttribute("min",minBid);
			}else document.getElementById("placeBidButton").setAttribute("disabled","disabled");
			
		}
		/*
		if($('#highestBidder')[0]){
			var highestBidder = await auctionContract.methods
			.highestBidder(thisContractAddress,recordID)
			.call({ from: currentAddress });
			$('#highestBidder')[0].textContent = highestBidder;
		}
		if($('#pendingReturns')[0]){
			var pendingReturns = await auctionContract.methods
			.pendingReturns(thisContractAddress,recordID,currentAddress)
			.call({ from: currentAddress });
			var ethBalance = web3CotnractCaller.utils.fromWei(pendingReturns, "ether");
			var humanFriendlyBalance = parseFloat(parseFloat(ethBalance).toFixed(6));
			if(humanFriendlyBalance && humanFriendlyBalance >0){
				$('#pendingReturns')[0].textContent = "You have placed ETH "+humanFriendlyBalance+" before. Placing 0.1 will equal to a "
					+(humanFriendlyBalance+0.1)+" bid";
				$('#pendingReturns')[0].style.display = "block";	
			}else{
				$('#pendingReturns')[0].textContent = "";
				$('#pendingReturns')[0].style.display = "none";
			}
		}
		*/
		/*
		if($('#tradingTable')[0]){
			var bidCount = await auctionContract.methods
			.bidCount(thisContractAddress,recordID)
			.call({ from: currentAddress });
			
			if(bidCount && bidCount >0){
				var t = $('#tradingTable').DataTable();
				var rowsss = [];
				for(var i=(bidCount-1);i>=0;i--){
					var bids = await auctionContract.methods
					.bids(thisContractAddress,recordID,i)
					.call({ from: currentAddress });
					var ethBalance = web3CotnractCaller.utils.fromWei(bids, "ether");
					var humanFriendlyBalance = parseFloat(parseFloat(ethBalance).toFixed(6)).toString();
					var bidders = await auctionContract.methods
					.bidders(thisContractAddress,recordID,i)
					.call({ from: currentAddress });
					var bidtime = await auctionContract.methods
					.bidtime(thisContractAddress,recordID,i)
					.call({ from: currentAddress });
					rowsss.push([
						humanFriendlyBalance,
						bidders,
						bidtime
					]);
				}
				t.clear();
				t.rows.add(rowsss).draw();
				//t.draw();
			}
		}
		*/
	}
}
function timeToDate(unix_timestamp){
	var date = new Date(unix_timestamp * 1000);
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	var formattedTime = day + "/" +month+ "/" +year+ " " +hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;
}
async function auctionPlacebid(recordID){
	var currentAddress = localStorage.getItem('myAccount');
	var web3CotnractCaller = new Web3(web3.currentProvider);
	var auctionContract = new web3CotnractCaller.eth.Contract(auctionContractABI,
		auctionContractAddress);
	if(auctionContract){
		var puttingBid = $('#puttingBid')[0].value;
		puttingBid = parseFloat(puttingBid);
		//if(!puttingBid || puttingBid<0.01){
		if(!puttingBid || puttingBid<minBid){
			alert("Please place enough ether");
			return;
		}
		var humanFriendlyBalance = parseFloat(puttingBid).toFixed(6);
		var ethBalance = web3CotnractCaller.utils.toWei(humanFriendlyBalance, "ether");
		//This is really calling a function in metamask
		await auctionContract.methods
		.placeBid(thisContractAddress,recordID)
		.send({ from: currentAddress,value: ethBalance });
	}
}
async function auctionWithdrawbid(recordID){
	var currentAddress = localStorage.getItem('myAccount');
	var web3CotnractCaller = new Web3(web3.currentProvider);
	var auctionContract = new web3CotnractCaller.eth.Contract(auctionContractABI,
		auctionContractAddress);
	if(auctionContract){
		//This is really calling a function in metamask
		var highestBid = await auctionContract.methods
		.withdraw(thisContractAddress,recordID)
		.send({ from: currentAddress });
		
		
	}
}


var thisContractAddress = "0x1e099bf9c6f027f4ae09da5e0330de9f9f428745";
var auctionContractAddress = "0xCc660F36ddA5e34A06B3F68802CDe16921b3a79E";
var auctionContractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "HighestBidIncreased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "OpenBid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "highestBidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "highestBid",
				"type": "uint256"
			}
		],
		"name": "SettleBid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "WithdrawBid",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAdmin",
				"type": "address"
			}
		],
		"name": "addAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "addAuction",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "admin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "adminWithdraw",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auctionEndTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "beneficiary",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bidCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bidders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bidtime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "divideRatio",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "endAuction",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "highestBid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "highestBidder",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "isEnd",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "pendingReturns",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAdmin",
				"type": "address"
			}
		],
		"name": "removeAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "settleAuction",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "contractAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]