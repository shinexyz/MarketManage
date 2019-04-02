//导入数据库模块
const mysql = require("mysql");
//设置数据路连接属性
let connect = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"123456",
	database:"market"
});
//开始数据库连接
connect.connect();
//抛出此模块以便其他模块引用
module.exports = connect;