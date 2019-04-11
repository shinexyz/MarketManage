let express = require("express");
let router = new express.Router();
//导入数据库连接
const mysql = require("../../config/db.js");
const moment = require("moment");
const page = require("../../common/page.js");
//进货管理页面
router.get('/',function(req,res,next){


	let p = req.query.p ? req.query.p : 1;
	 let size = 5;
	 let start = (p-1)*size;
	let search = req.query.search ? req.query.search :"";
	//计算总数据
	mysql.query("select count(*) total from purRecord where name like ?",['%'+search+'%'],function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			//console.log(data[0]);
			total = data[0].total;
			let fpage = page(total,p,size,search);
			//let pages = Math.ceil(total/size);
			//let search = req.query.search ? req.query.search :"";
			mysql.query("select * from purRecord where name like ? order by id desc limit ?,?",
				['%'+search+'%',fpage.start,fpage.size],function(err,data){
				if (err) {
						console.log(err);
						return "";
				}else{
						//遍历data
						data.forEach(item=>{
						item.time = moment(item.time*1000).format("YYYY-MM-DD h:mm a");
							});
						res.render("admin/purManage/purchaseManage.html",
									{
										data:data,
										show:fpage.show,
										search:search
									});
					}

			}); 
		}
	});
	
});
//采购进货
router.get('/add',function(req,res,next){
	mysql.query("select * from supply",function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			res.render("admin/purManage/purchase.html",{data:data});
			//console.log(data);

		}

	});
	
});
//库存表添加数据
function insertStorage(name,depot,type,num){

	mysql.query("insert into storage(name,depot,type,num) values(?,?,?,?)",[name,depot,type,num],function(err,data){
		if (err) {
			console.log(err);
			return "";
		}
		else{

			if (data.affectedRows==1) {
				return 1;
			}else{
				return 0;

			}

		}

	});

}
//库存表修改
function updateStorage(name,depot,num){
	console.log(num);
	let sql=`update storage set num = ${num} where name = '${name}' and depot = '${depot}'`;
	mysql.query(sql,function(err,data){
		if (err) {
			console.log(err);
			return "";
		}
		else{

			if (data.affectedRows==1) {
				return 1;
			}else{
				return 0;

			}

		}
	});
}
//采购信息的添加功能
router.post('/add',function(req,res,next){
	let {name,price,gtype,depot,num,supply,unit,gsize} = req.body;
 	let total = price * num;
 	let result=0;
 	//库存中是否有此商品的对应数据
 	let sql = `select * from storage where name ='${name}' and depot = '${depot}'`;
 	mysql.query(sql,function(err,data){
 		if (err) {
 			console.log(err);
 			return "";
 		}else{
 			//不存在，添加数据
 			if (data.length==0) {

 				 result = insertStorage(name,depot,gtype,num);
 			}else{

 				//存在,更新库存数
 				let n = data[0].num + Number(num);
 				result = updateStorage(name,depot,n);
 			}
 		}

 	});

 	//采购单据信息添加
 	let time = Math.round((new Date().getTime())/1000) ;
	mysql.query("insert into purRecord(name,price,type,depot,num,supply,time,unit,tot,gsize)values(?,?,?,?,?,?,?,?,?,?)",[name,price,gtype,depot,num,supply,time,unit,total,gsize],
		function(err,data){
			if (err) {
				console.log(err);
				return "";
			}else{

				//判断是否成功
				if (data.affectedRows==1) {

					//res.send("<script>alert('添加成功');location.href='admin/admin/add.html'</script>");
					res.send("<script>alert('添加成功');history.go(-2)</script>");
				}else{

					res.send("<script>alert('添加失败');history.go(-1)</script>");
					}
			}

	});
 	
});

//采购信息修改
router.get('/edit',function(req,res,next){
	//获得id
	let id = req.query.id;
	mysql.query("select * from purrecord where id = "+id,function(err,data){
		if (err) {
			console.log(err);
			return "";

		}else{
			 //加载修改页面
			 res.render("admin/purManage/purEdit.html",{data:data[0]});
		}
	});
	
});
//采购信息修改功能
// router.post('/edit',function(req,res,next){
// 	let {id,name,price,gsize,num,depot,enum} = req.body;
// 	//修改的时间
// 	let time  = Math.round((new Date().getTime())/1000) ;
// 	let total = price * num;
// 	let sql=`update purrecord set price = ${price},gsize = '${gsize}',num = ${enum},time = ${time},tot = ${total} where id = ${id}`;
// 	mysql.query(sql,function(err,data){
// 		if (err) {
// 			console.log(err);
// 			return "";
// 		}
// 		else{
// 			//判断是否执行成功
// 			if (data.affectedRows==1) 
// 			{
// 				res.send("<script>alert('修改成功');history.go(-2)</script>");
// 				console.log(sql);
// 			}else{
// 				res.send("<script>alert('修改失败');history.go(-1)</script>");

// 			}
// 		}
// 	});
// 	//更新库存信息
// 	//查询商品的num
// 	mysql.query("select * from storage where name =? and depot =?",[name,depot],function(err,data){

// 		if (err) {
// 			return "";
// 		}else{

// 			let gap = num-enum;
// 			let result = updateStorage(name,depot,data.num+gap);
// 		}
// 	});
	

// });
//采购数据删除
router.get('/ajax_del',function(req,res,next){
	//接受地址栏数据
	let {id,name,depot,num}= req.query.id;
	//删除数据
	mysql.query(`delete from purrecord where id = ${id}`,function(err,data){
		if (err) {
			return "";
		}else{
			//判断是否执行成功
			if (data.affectedRows==1) {

				res.send("1");
			}else{
				res.send("0");

			}
		}
	});
	//删除库存中的库存量
	mysql.query("select * from storage where name =? and depot =?",[name,depot],function(err,data){

		if (err) {
			return "";
		}else{

			let result = updateStorage(name,depot,data.num-num);
		}
	});
});


module.exports=router;