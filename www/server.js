require('dotenv').config(); //Load config from .env file
const express = require('express');
const app = express();

//Accepting form data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit:'20mb', extended: true }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');
const router = express.Router();

//Setup request to get data from Wordpress
'use strict';
var request = require("request");
var requestAgentOptions;
var wordpressURL = process.env.wordpressURL;
var wordpressGMT = process.env.wordpressGMT;
//var requestAgent;

//Moment JS
const moment = require('moment');

//Cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser('solon_is_handsome'));

//Multiform data handling
const multer  = require('multer');
//const upload = multer({ dest: 'uploads/' });
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
  }
});
const upload = multer({ storage: storage });
*/
const storageS3 = require("./imageUpload");
const upload = multer({ storage: storageS3 });
//app.use(express.limit('20M')); //Limit file upload to be 20MB or below


//IPFS client
var ipfsClient = require("./ipfsClient");

requestAgentOptions = {
  host: wordpressURL
, port: '443'
, path: '/'
, rejectUnauthorized: false
};

//Database connection
var mysqlFront = require("./database");

//web3 connection
var web3 = require("./web3_server");

//requestAgent = new https.Agent(requestAgentOptions);

//Get realtime ETH price from CryptoCompare
const {getEthPriceNow}= require('get-eth-price');

const pathjs = __dirname + '/views/js';
const pathcss = __dirname + '/views/css';
const pathimg = __dirname + '/views/img';
const pathfonts = __dirname + '/views/fonts';
const pathtemplate = __dirname + '/views/template';
const pathupload = __dirname + '/uploads';
const path = __dirname + '/views';
const port = 80;

//Webpage builder
/*const trumpet = require('trumpet');
const tr = trumpet();
*/
router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/', function(req,res){
  //res.sendFile(path + 'index.html');
	var pagetitle = "NFT platform";
	res.render('pages/index', {
		pagetitle: pagetitle
	});
});

router.get('/category', async function(req,res){
	var categoryDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_category' );
	//console.log(categoryDB);
	if(!categoryDB) categoryDB = [];
	//Add the dot in class
	for ( const i in categoryDB ) {
		if(categoryDB[ i ] && categoryDB[ i ].tag) 
			categoryDB[ i ].tag = '.'+categoryDB[ i ].tag;
	}
	var category = [ { tag: '*', name: "All"}, ];
	for ( const i in categoryDB ) {
		category.push(categoryDB[ i ]);
	}
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid' );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
	var subtitle = "NFT divided by Category";
	var pagetitle = "Category NFT";
	res.render('pages/discover-2', {
		pagetitle: pagetitle,
		subtitle: subtitle,
		category: category,
		items: items,
	});
});

router.get('/feature', async function(req,res){
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE a.tag LIKE "%feature%"' );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
	var pagetitle = "Feature NFT";
	res.render('pages/discover-2', {
		pagetitle: pagetitle,
		subtitle: "",
		category: [],
		items: items,
	});
});

/*router.get('/fanclub', function(req,res){
	var pagetitle = "Fan Club";
	var topfan = [
		{rank: "01",author: "Smith Wright",authorimg: "img/authors/1.png",authorid: 1,authorspending:3.3},
		{rank: "02",author: "Amillia Nnor",authorimg: "img/authors/2.png",authorid: 2,authorspending:3.0},
		{rank: "03",author: "Naretor-Nole",authorimg: "img/authors/3.png",authorid: 3,authorspending:2.9},
		{rank: "04",author: "Johan Donem",authorimg: "img/authors/4.png",authorid: 4,authorspending:2.5},
	];
	var topfan2 = [
		{rank: "05",author: "Smith Wright",authorimg: "img/authors/1.png",authorid: 1,authorspending:3.3},
		{rank: "06",author: "Amillia Nnor",authorimg: "img/authors/2.png",authorid: 2,authorspending:3.0},
		{rank: "07",author: "Naretor-Nole",authorimg: "img/authors/3.png",authorid: 3,authorspending:2.9},
		{rank: "08",author: "Johan Donem",authorimg: "img/authors/4.png",authorid: 4,authorspending:2.5},
	];
	var topfan3 = [
		{rank: "09",author: "Smith Wright",authorimg: "img/authors/1.png",authorid: 1,authorspending:3.3},
		{rank: "10",author: "Amillia Nnor",authorimg: "img/authors/2.png",authorid: 2,authorspending:3.0},
		{rank: "11",author: "Naretor-Nole",authorimg: "img/authors/3.png",authorid: 3,authorspending:2.9},
		{rank: "12",author: "Johan Donem",authorimg: "img/authors/4.png",authorid: 4,authorspending:2.5},
	];
	var topstars = [
		{lastworkimg: "img/art-work/c1.png",author: "Morgan Wright",authorimg: "img/authors/1.png",authorid: 1,
		profileText:"Short descriptions"},
		{lastworkimg: "img/art-work/c2.png",author: "Sendos Ali",authorimg: "img/authors/2.png",authorid: 2,
		profileText:"Short descriptions"},
		{lastworkimg: "img/art-work/c3.png",author: "Kamilia Norsh",authorimg: "img/authors/3.png",authorid: 3,
		profileText:"Short descriptions"},
		{lastworkimg: "img/art-work/c4.png",author: "Semova Altena",authorimg: "img/authors/4.png",authorid: 4,
		profileText:"Short descriptions"},
		{lastworkimg: "img/art-work/c1.png",author: "LarySmith-30",authorimg: "img/authors/1.png",authorid: 5,
		profileText:"Short descriptions"},
		{lastworkimg: "img/art-work/c2.png",author: "Samantha Ko",authorimg: "img/authors/2.png",authorid: 6,
		profileText:"Short descriptions"},
	]; 
	res.render('pages/authors', {
		pagetitle: pagetitle,
		topfan:topfan,
		topfan2:topfan2,
		topfan3:topfan3,
		topstars:topstars,
	});
});*/

router.get('/explore', async function(req,res){
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid' );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
	var subtitle = "NFT From Our Stars";
	var pagetitle = "Explore";
	res.render('pages/discover-2', {
		pagetitle: pagetitle,
		subtitle: subtitle,
		category: [],
		items: items,
	});
});

router.get('/auction', async function(req,res){  
	var pagetitle = "Live Auctions";
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE endbidtime IS NOT NULL' );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
	res.render('pages/auctions', {
		pagetitle: pagetitle,
		items: items,
	});
});

router.get('/item/:itemid', async function(req,res){
  //req.params.itemid
	var pagetitle = "Item Details";
	var ETHpriceArray = await getEthPriceNow();
	ETHpriceArray = Object.values(ETHpriceArray);
	ETHpriceArray = ETHpriceArray[0];
	var ETH_price = (ETHpriceArray && ETHpriceArray.ETH && ETHpriceArray.ETH.USD)? ETHpriceArray.ETH.USD : 0;
	//var ETH_price = "1571.34";
	var itemid = req.params.itemid;
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE a.itemid = '+itemid );
	//var itemDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_item WHERE itemid = '+itemid );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
		itemDB[i].tag = (itemDB[i].tag)? itemDB[i].tag.split(" ") : [];
	}
	var focusItem = (itemDB && itemDB[0])? itemDB[0] : { };
	
	focusItem.collection = " ";
	//Get bidding prices
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_bids a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE a.itemid = '+itemid+' ORDER BY ID DESC' );
	focusItem.highest_bid = (itemDB && itemDB[0])? itemDB[0]: {};
	focusItem.bids = (itemDB)? itemDB: [ ];
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_history a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE a.itemid = '+itemid+' ORDER BY ID DESC' );
	focusItem.history = (itemDB)? itemDB: [ ];
	
	var itemDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_author ORDER BY authorspending DESC LIMIT 0,12' );
	var topfan = [ ];
	var topfan2 = [ ];
	var topfan3 = [ ];
	for ( const i in itemDB ) {
		if(!itemDB[ i ]) continue;
		var singleTopFan = itemDB[ i ];
		singleTopFan.rank = (i<10)? "0"+i : ""+i;
		if(topfan.length <4) topfan.push(singleTopFan);
		else if(topfan2.length <4) topfan2.push(singleTopFan);
		else if(topfan3.length <4) topfan3.push(singleTopFan);
	}
	
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid ORDER BY likes DESC LIMIT 0,4' );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
	
	res.render('pages/item-detail', {
		pagetitle: pagetitle,
		topfan:topfan,
		topfan2:topfan2,
		topfan3:topfan3,
		items:items,
		ETH_price: ETH_price,
		focusItem: focusItem,
	});
	
});

router.get('/blogs', function(req,res){
	var pagetitle = "Blogs";
	var items = [
		{ itemid: 1, tag: "branding", title: "After Snow: Attraction", img:"img/blog-img/1.jpg",
		author: "@Johan Done",authorimg: "img/blog-img/1.png",authorid: 1,price:0.081,
		endbidtime: "Apr 10, 2021",comments: 7,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 2, tag: "design", title: "Guest Blog: Gene Kogan on the art of credit assignment.", img:"img/blog-img/2.jpg",
		author: "@LarySmith-3",authorimg: "img/blog-img/2.png",authorid: 2,price:3.3,bid:2.8,
		endbidtime: "Apr 12, 2021",comments: 5,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 3, tag: "development", title: "NFT???s smart contracts are verified and open source.", img:"img/blog-img/3.jpg",
		author: "@Smith Wright",authorimg: "img/blog-img/3.png",authorid: 1,price:2,
		endbidtime: "Apr 13, 2021",comments: 1,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 4, tag: "design", title: "Scarecrow in daylight", img:"img/blog-img/3.jpg",
		author: "@Hey",authorimg: "img/authors/2.png",authorid: 2,bid:0.5,
		endbidtime: "Apr 15, 2021",comments: 8,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		
	];
	var features = [
		{ itemid: 5, tag: "branding", title: "Super-Neumorphism #7", img:"img/art-work/5.png",
		author: "@Hey",authorimg: "img/authors/2.png",authorid: 2,price:3.3,bid:2.8,
		endbidtime: "Apr 21, 2021",comments: 2,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 6, tag: "development", title: "Exe Dream Sequence", img:"img/art-work/6.png",
		author: "@Hey",authorimg: "img/authors/2.png",authorid: 2,price:3.3,bid:2.8,
		endbidtime: "Apr 23, 2021",comments: 4,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 7, tag: "design", title: "Darklight Angel 01", img:"img/art-work/7.png",
		author: "@Smith Wright",authorimg: "img/authors/1.png",authorid: 1,price:3.3,bid:2.8,
		endbidtime: "Apr 26, 2021",comments: 3,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 8, tag: "development", title: "Becoming one with Nature", img:"img/art-work/8.png",
		author: "@Hey",authorimg: "img/authors/2.png",authorid: 2,price:3.3,bid:2.8,
		endbidtime: "Apr 18, 2021",comments: 5,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
	];
	res.render('pages/blog-with-sidebar', {
		pagetitle: pagetitle,
		items: items,
		totalItems: 70,
		features: features,
	});
});

router.get('/blog/:blogid', function(req,res){
  //req.params.blogid
	var blogid = req.params.blogid;
	var pagetitle = "Blog Details";
	var blog = { itemid: 1, tag: "branding", title: "After Snow: Attraction", img:"img/blog-img/1.jpg",
		author: "@admin",authorimg: "img/blog-img/1.png",authorid: 1,price:0.081,
		endbidtime: "Apr 10, 2021",comments: 7,
	};
	blog.description = "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptas tempora inventore minima consectetur fugit deserunt neque modi, culpa atque fugiat unde amet quidem, at corrupti dignissimos repudiandae, totam sapiente.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.Expedita fugit eum doloribus iste voluptatum perferendis dolorem qui! Vel magnam provident, laudantium voluptates sit, sint iure sunt harum distinctio ab, aliquam est voluptas minus id explicabo illum odio? Officia omnis minima similique, eveniet eos. Rem itaque laboriosam quas est omnis, mollitia possimus eveniet. Veritatis nihil, aliquid quisquam, laborum quis ut rem repellendus animi repellat, alias suscipit nostrum incidunt. Quis, quas.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque necessitatibus laborum eveniet eaque laboriosam in officia reprehenderit quas itaque numquam sit ipsum libero consequuntur quia non quod esse rem corporis vero, consequatur nam, labore. Assumenda dolores possimus voluptatem deleniti, ipsa doloribus voluptatibus adipisci, ex voluptatum doloremque perspiciatis sunt. A earum natus quisquam deserunt nulla saepe, cumque, distinctio fuga animi dignissimos. Fuga, autem. Rem eveniet animi repellendus voluptatibus officiis sit cum doloremque dolorem labore maxime, ipsa cumque deleniti distinctio tempora vitae eos debitis. Voluptatum enim in ab facilis sapiente, quidem numquam, maxime ex veritatis assumenda, accusamus similique.</p><blockquote><h5>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident, vero excepturi repellendus quae ipsum. Cum totam cumque quis eveniet saepe nisi.</h5><span>- Smith, CEO RaReable Marketplace</span></blockquote><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente quasi earum dolores sed pariatur molestias, aliquid eligendi, non consequatur quisquam repudiandae debitis numquam? Eligendi nostrum laborum, labore minima quaerat at eius tempora quos numquam dolores cum cupiditate voluptates necessitatibus, quis esse, ea. Tempora excepturi quia magnam itaque consequuntur iusto, dolore, nulla omnis, doloremque magni, amet pariatur! Maxime libero temporibus, soluta, qui veniam laudantium cupiditate corporis similique! Consectetur rerum, fuga! Quia nam fuga magnam quas aliquam in, saepe beatae. Culpa soluta, rerum id ex voluptate veniam maxime odit ad modi odio, molestiae est deserunt assumenda voluptatibus fuga accusamus placeat a quam!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur commodi expedita accusantium sapiente culpa rem vel voluptas soluta error adipisci doloremque corporis inventore molestias architecto, iusto tempora rerum. Molestias tempora possimus ea, cumque culpa corrupti dolor harum, alias, voluptatem at ex laborum excepturi iusto asperiores optio suscipit consectetur quis quos dolorum deleniti dicta aut similique, eius fuga. Rem natus deserunt, harum? Quasi, fuga, culpa.</p>";
	var comments = [
		{ itemid: 1, author: "Johan Done",authorimg: "img/test-img/1.jpg",authorid: 1,
		endbidtime: "Apr 10, 2021",description: "Efficitur lorem sed tempor. Integer aliquet tempor cursus. Nullam vestibulum convallis risus vel condimentum. Nullam auctor lorem in libero luctus, vel volutpat quam tincidunt.",
		children: [
			{
			itemid: 2, author: "Lim Sarah",authorimg: "img/test-img/1.jpg",authorid: 1,
			endbidtime: "Apr 12, 2021",description: "Efficitur lorem sed tempor.  Nvel volutpat quam tincidunt.",
			},
		],
		},
		{ itemid: 3, author: "Lim Sarah",authorimg: "img/test-img/1.jpg",authorid: 1,
		endbidtime: "Apr 15, 2021",description: "Efficitur lorem sed tempor. Integer aliquet tempor cursus. Nullam vestibulum convallis risus vel condimentum. Nullam auctor lorem in libero luctus, vel volutpat quam tincidunt.",
		children: [ ],
		},
	];
	var features = [
		{ itemid: 5, tag: "branding", title: "Super-Neumorphism #7", img:"img/art-work/5.png",
		author: "@Hey",authorimg: "img/authors/2.png",authorid: 2,price:3.3,bid:2.8,
		endbidtime: "Apr 21, 2021",comments: 2,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 6, tag: "development", title: "Exe Dream Sequence", img:"img/art-work/6.png",
		author: "@Hey",authorimg: "img/authors/2.png",authorid: 2,price:3.3,bid:2.8,
		endbidtime: "Apr 23, 2021",comments: 4,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 7, tag: "design", title: "Darklight Angel 01", img:"img/art-work/7.png",
		author: "@Smith Wright",authorimg: "img/authors/1.png",authorid: 1,price:3.3,bid:2.8,
		endbidtime: "Apr 26, 2021",comments: 3,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
		{ itemid: 8, tag: "development", title: "Becoming one with Nature", img:"img/art-work/8.png",
		author: "@Hey",authorimg: "img/authors/2.png",authorid: 2,price:3.3,bid:2.8,
		endbidtime: "Apr 18, 2021",comments: 5,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
		},
	];
	/*res.render('pages/index-single-blog', {
		pagetitle: pagetitle,
		features: features,
		comments: comments,
		blog: blog,
	});
	*/
	getWPPost(req, res, pagetitle,features,comments,blog,blogid);
});

var getWPPost = function(req, res, pagetitle,features,comments,blog,blogid){
    var headers, options;

    // Set the headers
    headers = {
        'Content-Type':'application/x-www-form-urlencoded'
    }

    // Configure the request
    options = {
        url: 'https://'+wordpressURL+'/?rest_route=/wp/v2/posts/'+blogid+'/',
        method: 'GET',
        headers: headers, 
		agentOptions: requestAgentOptions,
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var blogContent = JSON.parse(body);
			if(blogContent.title.rendered) blog.title = blogContent.title.rendered;
			if(blogContent.content.rendered) blog.description = blogContent.content.rendered;
			if(blogContent.id) blog.itemid = blogContent.id;
			if(blogContent.date){
				var localDate = moment(blogContent.date+wordpressGMT, "YYYY-MM-DDTHH:mm:ss Z");
				if(localDate && localDate.toDate()) localDate = localDate.toDate();
				if(localDate && localDate.toString() && !isNaN(localDate.getFullYear())){
					var year = localDate.getFullYear();
					var month = localDate.getMonth() + 1;
					var date = localDate.getDate();
					var a_p = "";
					var curr_hour = localDate.getHours();
					if (curr_hour < 12)
					   {
					   a_p = "AM";
					   }
					else
					   {
					   a_p = "PM";
					   }
					if (curr_hour == 0)
					   {
					   curr_hour = 12;
					   }
					if (curr_hour > 12)
					   {
					   curr_hour = curr_hour - 12;
					   }
					var curr_min = (localDate.getMinutes()<10?'0':'') + localDate.getMinutes();
					var timezone = /\((.*)\)/.exec(localDate.toString())[1];
					blog.endbidtime = year+"/"+month+"/"+date;
				}else blog.endbidtime = localDate;
			}else{
				blog.endbidtime = "No date";
			}
			
			blog.img = "uploads/2023.jpg";
			
			//tag (no need)
			//img
			//author (no need)
			//authorimg (no need)
			//authorid (no need)
			//comments
			//,"author":[{"embeddable":true,"href":"https:\/\/ec2-13-214-38-205.ap-southeast-1.compute.amazonaws.com\/index.php?rest_route=\/wp\/v2\/users\/1"}]
			//"wp:featuredmedia":[{"embeddable":true,"href":"https:\/\/ec2-13-214-38-205.ap-southeast-1.compute.amazonaws.com\/index.php?rest_route=\/wp\/v2\/media\/2025"}]
			//"wp:term":[{"taxonomy":"category","embeddable":true,"href":"https:\/\/ec2-13-214-38-205.ap-southeast-1.compute.amazonaws.com\/index.php?rest_route=%2Fwp%2Fv2%2Fcategories&post=2023"},{"taxonomy":"post_tag","embeddable":true,"href":"https:\/\/ec2-13-214-38-205.ap-southeast-1.compute.amazonaws.com\/index.php?rest_route=%2Fwp%2Fv2%2Ftags&post=2023"}]
			//featured_media = 2025
			//"replies":[{"embeddable":true,"href":"https:\/\/ec2-13-214-38-205.ap-southeast-1.compute.amazonaws.com\/index.php?rest_route=%2Fwp%2Fv2%2Fcomments&post=2023"}]
			//https://stackoverflow.com/questions/57552033/file-upload-and-move-problem-with-express-fileupload
			res.render('pages/index-single-blog', {
				pagetitle: pagetitle,
				features: features,
				comments: comments,
				blog: blog,
			});
        } else {
            console.log(error);
			res.render('pages/index-single-blog', {
				pagetitle: pagetitle,
				features: features,
				comments: comments,
				blog: blog,
			});
        }
     });
	return [];
   };


router.get('/trade', function(req,res){
	var pagetitle = "Trade History";
	var activity = [
		{ itemid: 5, tag: "branding", title: "Erotic 35mm and polaroid photography",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "10 editions listed by @Nola_Naser for 0.23 ETH Each"
		},
		{ itemid: 5, tag: "branding", title: "Lucky 4 Leaf Clover (charms)",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "Recently Liked by @Nola_Naser"
		},{ itemid: 5, tag: "branding", title: "Skrrt Cobain Official",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
		},{ itemid: 5, tag: "branding", title: "Reach 1k Sales",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "10 editions listed by @Nola_Naser for 0.23 ETH Each"
		},{ itemid: 5, tag: "branding", title: "Our Journey Start",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "10 editions listed by @Nola_Naser for 0.23 ETH Each"
		},{ itemid: 5, tag: "branding", title: "Create A Module",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "10 editions listed by @Nola_Naser for 0.23 ETH Each"
		},{ itemid: 5, tag: "branding", title: "Erotic 35mm and polaroid photography",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "10 editions listed by @Nola_Naser for 0.23 ETH Each"
		},{ itemid: 5, tag: "branding", title: "Erotic 35mm and polaroid photography",time: "14:15",
		date: "Apr 21, 2021",comments: 2,description: "10 editions listed by @Nola_Naser for 0.23 ETH Each"
		},
	];
	var tags = [
		{ itemid:5, tag:"Listings", img: "img/icons/f1.png" },
		{ itemid:5, tag:"Likes", img: "img/icons/f5.png" },
		{ itemid:5, tag:"Purchases", img: "img/icons/f2.png" },
		{ itemid:5, tag:"Sales", img: "img/icons/f3.png" },
		{ itemid:5, tag:"Transfer", img: "img/icons/f4.png" },
		{ itemid:5, tag:"Burns", img: "img/icons/f6.png" },
		{ itemid:5, tag:"Bids", img: "img/icons/f7.png" },
	];
	res.render('pages/trade', {
		pagetitle: pagetitle,
		activity: activity,
		tags: tags,
	});
});

router.get('/create-item', async function(req,res){
	var pagetitle = "Create Item";
	/*Related to the boy*/
	var address = (req.signedCookies.loginAddress)? req.signedCookies.loginAddress:"Xjo03s-osi6732asdasd-5465460-fgdfgdfg";
	var profile = { };
	var itemDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_author WHERE LOWER(longAddr) = LOWER("'
	+address+'") LIMIT 0,2' );
	if(!itemDB) itemDB = [];
	if(itemDB && itemDB.length >0 && itemDB[ 0 ] && itemDB[ 0 ].email){ 
		profile.name = itemDB[ 0 ].authorname;
		profile.title = itemDB[ 0 ].profileText;
		profile.description = itemDB[ 0 ].description;
		profile.shortAddr = (address.length >14)? address.substring(0,14)+"..." : address;
		profile.longAddr = address;
		profile.id = itemDB[ 0 ].authorid;
		if(itemDB[ 0 ].authorimg){
			if(isJson(itemDB[ 0 ].authorimg)){
				var authorimgObj = JSON.parse(itemDB[ 0 ].authorimg);
				profile.authorimg = authorimgObj.local;
				profile.authorIPFSimg = 'https://gateway.ipfs.io/ipfs/'+authorimgObj.ipfs;
			}else profile.authorimg = itemDB[ 0 ].authorimg;
		}else profile.authorimg = "/img/art-work/profile-header.jpg";
		if(itemDB[ 0 ].authorheader){
			if(isJson(itemDB[ 0 ].authorheader)){
				var authorimgObj = JSON.parse(itemDB[ 0 ].authorheader);
				profile.authorheader = authorimgObj.local;
				profile.authorIPFSheader = 'https://gateway.ipfs.io/ipfs/'+authorimgObj.ipfs;
			}else profile.authorheader = itemDB[ 0 ].authorheader;
		}else profile.authorheader = "/img/authors/2.png";
		if(itemDB[ 0 ].socialnetwork && isJson(itemDB[ 0 ].socialnetwork)){
			profile.socialnetwork = JSON.parse(itemDB[ 0 ].socialnetwork);
		}else profile.socialnetwork = {};
	}else{	
		profile = {
			id: 0,
			name: "Bill Star",
			title: "Creative KOL",
			description: "A famous star who have a lot of ideas on NFT",
			shortAddr: "Xjo03s-osi6732...",
			longAddr: "Xjo03s-osi6732asdasd-5465460-fgdfgdfg",
			socialnetwork: {}
		};
	}
	var categoryDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_category' );
	//console.log(categoryDB);
	if(!categoryDB) categoryDB = [];
	var category = [ ];
	for ( const i in categoryDB ) {
		category.push(categoryDB[ i ]);
	}
	res.render('pages/create-item', {
		pagetitle: pagetitle,
		profile: profile,
		category: category,
	});
});
router.get('/profile', async function(req,res){
	/*Related to the boy*/
	var address = (req.signedCookies.loginAddress)? req.signedCookies.loginAddress:"Xjo03s-osi6732asdasd-5465460-fgdfgdfg";
	var profile = { };
	var itemDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_author WHERE LOWER(longAddr) = LOWER("'
	+address+'") LIMIT 0,2' );
	if(!itemDB) itemDB = [];
	if(itemDB && itemDB.length >0 && itemDB[ 0 ] && itemDB[ 0 ].email){ 
		profile.name = itemDB[ 0 ].authorname;
		profile.title = itemDB[ 0 ].profileText;
		profile.description = itemDB[ 0 ].description;
		profile.shortAddr = (address.length >14)? address.substring(0,14)+"..." : address;
		profile.longAddr = address;
		profile.id = itemDB[ 0 ].authorid;
		if(itemDB[ 0 ].authorimg){
			if(isJson(itemDB[ 0 ].authorimg)){
				var authorimgObj = JSON.parse(itemDB[ 0 ].authorimg);
				profile.authorimg = authorimgObj.local;
				profile.authorIPFSimg = 'https://gateway.ipfs.io/ipfs/'+authorimgObj.ipfs;
			}else profile.authorimg = itemDB[ 0 ].authorimg;
		}else profile.authorimg = "/img/art-work/profile-header.jpg";
		if(itemDB[ 0 ].authorheader){
			if(isJson(itemDB[ 0 ].authorheader)){
				var authorimgObj = JSON.parse(itemDB[ 0 ].authorheader);
				profile.authorheader = authorimgObj.local;
				profile.authorIPFSheader = 'https://gateway.ipfs.io/ipfs/'+authorimgObj.ipfs;
			}else profile.authorheader = itemDB[ 0 ].authorheader;
		}else profile.authorheader = "/img/authors/2.png";
		if(itemDB[ 0 ].socialnetwork && isJson(itemDB[ 0 ].socialnetwork)){
			profile.socialnetwork = JSON.parse(itemDB[ 0 ].socialnetwork);
		}else profile.socialnetwork = {};
	}else{	
		profile = {
			id: 0,
			name: "Bill Star",
			title: "Creative KOL",
			description: "A famous star who have a lot of ideas on NFT",
			shortAddr: "Xjo03s-osi6732...",
			longAddr: "Xjo03s-osi6732asdasd-5465460-fgdfgdfg",
			socialnetwork: {}
		};
	}
	/*Related to items*/
	var categoryDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_category' );
	//console.log(categoryDB);
	if(!categoryDB) categoryDB = [];
	//Add the dot in class
	for ( const i in categoryDB ) {
		if(categoryDB[ i ] && categoryDB[ i ].tag) 
			categoryDB[ i ].tag = '.'+categoryDB[ i ].tag;
	}
	var category = [ { tag: '*', name: "All"}, ];
	for ( const i in categoryDB ) {
		category.push(categoryDB[ i ]);
	}
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE b.authorid = '+profile.id );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
		
	var editID = 10;
	var pagetitle = "Profile";
	res.render('pages/profile', {
		pagetitle: pagetitle,
		category: category,
		items: items,
		profile: profile,
		editID: editID,
	});
});
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
router.get('/profile/:profileid', async function(req,res){
	var profileid = req.params.profileid;
	var profile = { };
	var itemDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_author WHERE authorid = '
	+profileid+' LIMIT 0,2' );
	if(!itemDB) itemDB = [];
	if(itemDB && itemDB.length >0 && itemDB[ 0 ] && itemDB[ 0 ].email){ 
		profile.name = itemDB[ 0 ].authorname;
		profile.title = itemDB[ 0 ].profileText;
		profile.description = itemDB[ 0 ].description;
		var address = itemDB[ 0 ].longAddr;
		profile.shortAddr = (address.length >14)? address.substring(0,14)+"..." : address;
		profile.longAddr = address;
		profile.id = itemDB[ 0 ].authorid;
		if(itemDB[ 0 ].authorimg){
			if(isJson(itemDB[ 0 ].authorimg)){
				var authorimgObj = JSON.parse(itemDB[ 0 ].authorimg);
				profile.authorimg = authorimgObj.local;
				profile.authorIPFSimg = 'https://gateway.ipfs.io/ipfs/'+authorimgObj.ipfs;
			}else profile.authorimg = itemDB[ 0 ].authorimg;
		}else profile.authorimg = "/img/art-work/profile-header.jpg";
		if(itemDB[ 0 ].authorheader){
			if(isJson(itemDB[ 0 ].authorheader)){
				var authorimgObj = JSON.parse(itemDB[ 0 ].authorheader);
				profile.authorheader = authorimgObj.local;
				profile.authorIPFSheader = 'https://gateway.ipfs.io/ipfs/'+authorimgObj.ipfs;
			}else profile.authorheader = itemDB[ 0 ].authorheader;
		}else profile.authorheader = "/img/authors/2.png";
		if(itemDB[ 0 ].socialnetwork && isJson(itemDB[ 0 ].socialnetwork)){
			profile.socialnetwork = JSON.parse(itemDB[ 0 ].socialnetwork);
		}else profile.socialnetwork = {};
	}else{	
		profile = {
			id: 0,
			name: "Bill Star",
			title: "Creative KOL",
			description: "A famous star who have a lot of ideas on NFT",
			shortAddr: "Xjo03s-osi6732...",
			longAddr: "Xjo03s-osi6732asdasd-5465460-fgdfgdfg",
			socialnetwork: {}
		};
	}
	/*Related to items*/
	var categoryDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_category' );
	//console.log(categoryDB);
	if(!categoryDB) categoryDB = [];
	//Add the dot in class
	for ( const i in categoryDB ) {
		if(categoryDB[ i ] && categoryDB[ i ].tag) 
			categoryDB[ i ].tag = '.'+categoryDB[ i ].tag;
	}
	var category = [ { tag: '*', name: "All"}, ];
	for ( const i in categoryDB ) {
		category.push(categoryDB[ i ]);
	}
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE b.authorid = '+profile.id );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
	
	
	
	var pagetitle = "Profile";
	res.render('pages/profile', {
		pagetitle: pagetitle,
		category: category,
		items: items,
		profile: profile,
	});
});

router.get('/nft-holding', async function(req,res){
	var pagetitle = "NFT Holding";
	var address = (req.signedCookies.loginAddress)? req.signedCookies.loginAddress:"Xjo03s-osi6732asdasd-5465460-fgdfgdfg";
	var profile = { };
	var itemDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_author WHERE LOWER(longAddr) = LOWER("'
	+address+'") LIMIT 0,2' );
	if(!itemDB) itemDB = [];
	if(itemDB && itemDB.length >0 && itemDB[ 0 ] && itemDB[ 0 ].email){ 	
		profile.id = itemDB[ 0 ].authorid;
	}else{	
		profile = {
			id: 0,
		};
	}
	/*Related to items*/
	var categoryDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_category' );
	//console.log(categoryDB);
	if(!categoryDB) categoryDB = [];
	//Add the dot in class
	for ( const i in categoryDB ) {
		if(categoryDB[ i ] && categoryDB[ i ].tag) 
			categoryDB[ i ].tag = '.'+categoryDB[ i ].tag;
	}
	var category = [ { tag: '*', name: "All"}, ];
	for ( const i in categoryDB ) {
		category.push(categoryDB[ i ]);
	}
	var itemDB = await mysqlFront.runQuery( 'SELECT a.*, b.authorname as author, b.authorimg FROM spotlight_item a INNER JOIN spotlight_author b ON a.authorid = b.authorid WHERE b.authorid = '+profile.id );
	if(!itemDB) itemDB = [];
	for ( const i in itemDB ) {
		var updatetime = (itemDB[i].updatetime)? itemDB[i].updatetime : itemDB[i].dt_create_time ;
		var relativeTime = new moment(updatetime).fromNow();
		itemDB[i].updatetime = (relativeTime)? relativeTime : updatetime;
	}
	var items = [ ];
	for ( const i in itemDB ) {
		items.push(itemDB[ i ]);
	}
	/*Related to items*/
	res.render('pages/profile', {
		pagetitle: pagetitle,
		category: category,
		items: items,
	});
});

router.get('/sign-up', function(req,res){
	var pagetitle = "Sign Up";
	var address = (req.signedCookies.loginAddress)? req.signedCookies.loginAddress :"Xjo03s-osi6732asdasd-5465460-fgdfgdfg";
	res.render('pages/register', {
		pagetitle: pagetitle,
		address: address,
	});
});

router.post('/register', async function(req,res){
	//console.log(req.body);
	var returnObj = {};
	returnObj.result = "failed";
	
	if(req.body && req.body.name && req.body.email && req.body.address && req.body.signatureObject){
		var name = req.body.name;
		var email = req.body.email;
		var address = req.body.address;
		var signatureObject = req.body.signatureObject;
		var actualAddress = web3.web3Verify(address,"By signning up, you are agreed to our Terms & Conditions",signatureObject);
		//console.log(name,email,address,signatureObject,actualAddress);
		if(actualAddress){
			var insertResult = await mysqlFront.runInsertQuery( 'INSERT INTO spotlight_author(authorname,email,longAddr) VALUES(?,?,?)' , [name,email,address] );
			console.log("new insert id"+insertResult+" and "+insertResult.insertId);
			returnObj.result = "success";
			returnObj.insertId = insertResult.insertId;
		}
	}
		
	res.json(returnObj);
});

router.post('/editprofile'
, upload.fields([{ name: 'profile-header', maxCount: 1 }, { name: 'profile-img', maxCount: 1 }])
, function(req,res){
	//console.log(req.body);
	var returnObj = {};
	returnObj.result = "failed";
	var address = (req.signedCookies.loginAddress)? req.signedCookies.loginAddress:false;
	if(!address){
		returnObj.msg = "Please login first";
		res.json(returnObj);
		return;
	}
	//console.log("Before the req bdody check"+req.body);
	if(req.body && req.body.name && req.body.wallet && req.body.signatureObject){
		//console.log("Correct path");
		var name = req.body.name;
		//var email = req.body.email;
		var clientWallet = req.body.wallet;
		var signatureObject = req.body.signatureObject;
		var actualAddress = web3.web3Verify(address,"Confirm editing the information",signatureObject);
		if(!actualAddress){
			returnObj.msg = "Please sign the changes";
			res.json(returnObj);
			return;
		}
		//req.files['profile-header'][0] -> File
		//req.body will contain the text fields
		//var newProfileHeader = false;
		if(req.files && req.files['profile-header'] && req.files['profile-header'][0]){
			//There is a new profile header image
			/*var IPFSHash = await ipfsClient.add(req.files['profile-header'][0]);
			if(IPFSHash) IPFSHash = ""+IPFSHash.cid;
			*/
			var IPFSHash = "0000000000000000";
			console.log("about header"+req.files['profile-header'][0].location);
			var localImageName = req.files['profile-header'][0].location;
			newProfileHeader = JSON.stringify({ ipfs: IPFSHash, local: localImageName});
		}
		//var newProfileImage = false;
		if(req.files && req.files['profile-img'] && req.files['profile-img'][0]){
			//There is a new profile image
			/*var IPFSHash = await ipfsClient.add(req.files['profile-img'][0]);
			if(IPFSHash) IPFSHash = ""+IPFSHash.cid;
			*/
			var IPFSHash = "0000000000000000";
			console.log("about img"+req.files['profile-img'][0].location);
			var localImageName = req.files['profile-img'][0].location;
			newProfileImage = JSON.stringify({ ipfs: IPFSHash, local: localImageName});
		}
		var title = req.body.title;
		var description = req.body.description;
		var socialnetworkobject = JSON.stringify({
			facebook: req.body.facebook,
			twitter: req.body.twitter,
			linkedin: req.body.linkedin,
			instagram: req.body.instagram,
		});
		
		var updateStatement = 'UPDATE spotlight_author SET authorname = ?, profileText = ?, description = ?, socialnetwork=?';
		var updateArray = [name,title,description,socialnetworkobject];
		
		if(newProfileHeader){
			updateStatement += ", authorheader = ?";
			updateArray.push(newProfileHeader);
		}
		if(newProfileImage){
			updateStatement += ", authorimg = ?";
			updateArray.push(newProfileImage);
		}
		
		updateStatement += 'WHERE longAddr = ? ';
		updateArray.push(address);
		
		//var updateResult = await mysqlFront.runInsertQuery(updateStatement,updateArray);
		//console.log("new update id"+updateResult+" and "+updateResult.insertId);
		//console.log("Start updating profile");
		mysqlFront.query(updateStatement,updateArray,  (error, elements)=>{
            if(error){
                console.log("Cannot update profile"+error);
            }
			//console.log("Successfully update profile"+elements);
			//mysqlFront.release();
            //return resolve(elements);
        });
		returnObj.result = "success";
		//returnObj.insertId = updateResult.insertId;
	}
	
	res.json(returnObj);
});

router.post('/createNewStep1' 
, upload.fields([{ name: 'profile-header', maxCount: 1 }])
, function(req,res){
	var returnObj = {};
	returnObj.result = "failed";
	var address = (req.signedCookies.loginAddress)? req.signedCookies.loginAddress:false;
	if(!address){
		returnObj.msg = "Please login first";
		res.json(returnObj);
		return;
	}
	if(req.body && req.body.name && req.body.signatureObject){
		//console.log("Correct path");
		var name = req.body.name;
		var description = req.body.Description;
		var tagLine = req.body.categoryArray;
		if(tagLine) tagLine = tagLine.trim();
		//var email = req.body.email;
		var clientWallet = req.body.wallet;
		var createHash = req.body.signatureObject;
		//var actualAddress = web3.web3Verify(address,"Confirm editing the information",signatureObject);
		if(!createHash){
			returnObj.msg = "Please create NFT";
			res.json(returnObj);
			return;
		}
		var newProfileHeader = false;
		if(req.files && req.files['profile-header'] && req.files['profile-header'][0]){
			//There is a new profile header image
			/*var IPFSHash = await ipfsClient.add(req.files['profile-header'][0]);
			if(IPFSHash) IPFSHash = ""+IPFSHash.cid;
			*/
			var IPFSHash = "0000000000000000";
			console.log("about header"+req.files['profile-header'][0].location);
			var localImageName = req.files['profile-header'][0].location;
			newProfileHeader = JSON.stringify({ ipfs: IPFSHash, local: localImageName});
		}
					
		var updateStatement = (newProfileHeader)? 
		'INSERT INTO spotlight_item(tag,title,img,des,txhash,address) VALUES(?,?,?,?,?,?)':
		'INSERT INTO spotlight_item(tag,title,des,txhash,address) VALUES(?,?,?,?,?)';
		var updateArray = (newProfileHeader)? 
		[tagLine,name,newProfileHeader,description,createHash,address]:
		[tagLine,name,description,createHash,address];
	
		mysqlFront.query(updateStatement,updateArray,  (error, elements)=>{
            if(error){
                console.log("Cannot insert new NFT into database: "+error);
            }
        });
		returnObj.result = "success";
		//returnObj.insertId = updateResult.insertId;
	}
	
	res.json(returnObj);
	
});

router.get('/createNewStep2', async function(req,res){
	var itemDB = await mysqlFront.runQuery( 'SELECT * FROM spotlight_item WHERE contractID IS NULL AND txhash is NOT NULL LIMIT 0,10' );
	for ( const i in itemDB ) {
		//items.push(itemDB[ i ]);
		var itemID = itemDB[ i ].itemid;
		var txhash = itemDB[ i ].txhash;
		var address = itemDB[ i ].address;
		var receipt = web3.eth.getTransactionReceipt(txhash).then(console.log);
				
	}
	
	var returnObj = {};
	returnObj.result = "success";
	returnObj.items = itemDB;
	res.json(returnObj);
});

router.get('/getEmail/:address', async function(req,res){
	var address = req.params.address;
	//Return this object
	var returnObj = {};
	returnObj.result = "failed";
	
	var itemDB = await mysqlFront.runQuery( 'SELECT email FROM spotlight_author WHERE LOWER(longAddr) = LOWER("'
	+address+'") LIMIT 0,2' );
	if(!itemDB) itemDB = [];
	if(itemDB && itemDB.length >0 && itemDB[ 0 ] && itemDB[ 0 ].email){ 
		returnObj.result = "success";
		returnObj.email = itemDB[ 0 ].email;
	}
	//if(!req.signedCookies.loginAddress) {
        res.cookie('loginAddress', address, { signed: true });
    //}
	res.json(returnObj);
});

/*router.get('/sharks', function(req,res){
  res.sendFile(path + 'sharks.html');
});
*/
app.use('/js',express.static(pathjs));
app.use('/css',express.static(pathcss));
app.use('/img',express.static(pathimg));
app.use('/fonts',express.static(pathfonts));
app.use('/template',express.static(pathtemplate));
app.use('/uploads',express.static(pathupload));

//app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})