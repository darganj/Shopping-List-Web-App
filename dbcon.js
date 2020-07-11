var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_gershunz',
  password        : '7737',
  database        : 'cs361_gershunz'
});
module.exports.pool = pool;
