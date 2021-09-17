var mysql = require('mysql');

var mysqlFront = mysql.createPool({
  host     : process.env.DB_HOST, 
  user     : process.env.DB_USER,
  password : process.env.DB_PW,
  database : process.env.DB_DB,
  connectionLimit : 100,
  connectTimeout  : 30 * 1000,
  acquireTimeout  : 30 * 1000,
  timeout         : 30 * 1000, //30 seconds inactivity waiting
});
mysqlFront.on('connection', function (connection) {
  console.log('DB Connection established');
  mysqlFront.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  mysqlFront.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });
});

mysqlFront.query("select * from spotlight_category",  (error, elements)=>{
	if(error){
		console.log("Error on loading database"+error);
	}
	console.log("First query to db with contents"+elements);
});

module.exports = mysqlFront;

module.exports.runQuery = (query) =>{
    return new Promise((resolve, reject)=>{
        mysqlFront.query(query,  (error, elements)=>{
            //mysqlFront.release();
			if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
module.exports.runInsertQuery = (query,items) =>{
    return new Promise((resolve, reject)=>{
        mysqlFront.query(query,items,  (error, elements)=>{
            //mysqlFront.release();
			if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
