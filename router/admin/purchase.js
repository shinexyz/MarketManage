let express = require("express");
let router = new express.Router();
//导入数据库连接
const mysql = require("../../config/db.js");
const moment = require("moment");
//进货管理页面
router.get('/',function(req,res,next){
	//搜索
	let search = req.query.search ? req.query.search :"";
	// //查询数据
	mysql.query("select * from purRecord where name like ? order by id",[`%${search}%`],function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			//遍历data
			data.forEach(item=>{
				item.time = moment(item.time*1000).format("YYYY-MM-DD");
			});
			res.render("admin/purManage/purchaseManage.html",{data:data,search:search});
		}

	});
	
});
//采购进货
router.get('/add',function(req,res,next){
	res.render("admin/purManage/purchase.html")
});

//采购信息的添加功能
router.post('/add',function(req,res,next){

	//let time = Math.round((new Date().getTime())/1000) ;
	//日期格式转换为年月日
	//let time_convert = moment(time*1000).format("YYYY-MM-DD");
	//判空
	let {name,price,gtype,depot,num,supply} = req.body;
	//let p = Math.round(parseFloat(price)*100)/100;
	//console.log(p);
	if (name) {
		if (price) {
			if (num) {
				//插入数据
				let time = Math.round((new Date().getTime())/1000) ;
				mysql.query("insert into purRecord(name,price,type,depot,num,supply,time) values(?,?,?,?,?,?,?)",
					[name,price,gtype,depot,num,supply,time],function(err,data){
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

			}else{
				res.send("<script>alert('请输入采购数量');history.go(-1)</script>");

			}

		}else{
			res.send("<script>alert('请输入进价');history.go(-1)</script>");
		}

	}else{
		res.send("<script>alert('请输入商品名称');history.go(-1)</script>");
	}

});

//库粗查询
router.get('/search',function(req,res,next){
	res.send("库存查询");
});
//采购单据查询
router.get('/receipt',function(req,res,next){
	res.send("采购单据查询");
});


module.exports=router;