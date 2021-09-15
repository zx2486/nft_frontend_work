var mysql = require('mysql');

var mysqlFront = mysql.createPool({
  host     : 'heynftdb.cw2he70mrmkg.ap-southeast-1.rds.amazonaws.com', 
  user     : 'dbMag',
  password : 'ggVH5RrBmVxlwW5GZ8mV',
  database : 'heynft_front',
  connectionLimit : 100
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
  
module.exports = mysqlFront;

module.exports.runQuery = (query) =>{
    return new Promise((resolve, reject)=>{
        mysqlFront.query(query,  (error, elements)=>{
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
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};