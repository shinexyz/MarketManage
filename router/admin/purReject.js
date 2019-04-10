let express = require("express");
let router = new express.Router();
//导入数据库连接
const mysql = require("../../config/db.js");
const moment = require("moment");
router.get('/',function(req,res,next){
	
	let search = req.query.search ? req.query.search :"";
	// //查询数据
	mysql.query("select * from purRejRecord where name like ? order by id",[`%${search}%`],function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			//遍历data
			data.forEach(item=>{
				item.time = moment(item.time*1000).format("YYYY-MM-DD");
			});
			res.render("admin/purManage/purRejManage.html",{data:data,search:search});
		}

	});
});
router.get('/add',function(req,res,next){
	//数据库查询获得供货商信息
	//
	mysql.query("select * from supply",function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			data.forEach(item=>{
				item.time = moment(item.time*1000).format("YYYY-MM-DD");
			});
			res.render("admin/purManage/reject.html",{data:data});
			//console.log(data);

		}

	});
});
//退货记录增加功能
router.post('/add',function(req,res,next){
	let {name,price,rprice,depot,rtype,num,supply} = req.body;
	//console.log(req.body);
	//判断
	if (name) {
		if (price) {
			if (rprice) {
				if (num) {
					//添加记录
					let time = Math.round((new Date().getTime())/1000) ;
					mysql.query("insert into purRejRecord(name,rprice,price,supply,num,rtype,depot,time) values(?,?,?,?,?,?,?,?)",
					[name,rprice,price,supply,num,rtype,depot,time],function(err,data){
						if (err) {
							console.log(err);
							return "";

						}else{
							//判断是非执行成功
							if (data.affectedRows==1) {
								//res.send("<script>alert('添加成功');location.href='admin/admin/add.html'</script>");
								res.send("<script>alert('添加成功');history.go(-2)</script>");
							}else{

									res.send("<script>alert('添加失败');history.go(-1)</script>");
							}

						}

					});
				}else{
					res.send("<script>alert('请输入进货件数');history.go(-1)</script>");

				}

			}else{
				
				res.send("<script>alert('请输入退货价格');history.go(-1)</script>");
			}

		}else{

			res.send("<script>alert('请输入进货价格');history.go(-1)</script>");
		}

	}else{

		res.send("<script>alert('请输入商品名称');history.go(-1)</script>");
	}
	
});
//删除
router.get('/ajax_del',function(req,res,next){
	//接受地址栏数据
	let id = req.query.id;
	//删除数据
	mysql.query(`delete from purRejRecord where id = ${id}`,function(err,data){
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

});
//修改
router.get('/edit',function(req,res,next){
	//获取id
	let id = req.query.id;
	//查询ID对应的数据
	mysql.query("select * from purRejRecord where id = "+id,function(err,data){
		if (err) {
			console.log(err);
			return "";

		}else{
			 //加载修改页面
			 res.render("admin/purManage/rejEdit.html",{data:data[0]});
		}
	});
});
router.post('/edit',function(req,res,next){
	let {id,name,rprice,depot,num,rtype} = req.body;
	
	//修改的时间
	let time  = Math.round((new Date().getTime())/1000) ;
	let sql=`update purrejrecord set rprice = '${rprice}',depot = '${depot}',num = '${num}',time = '${time}' where id = ${id}`;
	mysql.query(sql,function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			//判断是否执行成功
			if (data.affectedRows==1) {
				res.send("<script>alert('修改成功');history.go(-2)</script>");

			}else{
				res.send("<script>alert('修改失败');history.go(-1)</script>");

			}
		}
	});
});
module.exports=router;