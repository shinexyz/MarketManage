let express = require("express");
let router = new express.Router();
//导入数据库连接
const mysql = require("../../config/db.js");
const moment = require("moment");
router.get('/',function(req,res,next){
	
	res.render("admin/purManage/purRejManage.html");
});
router.get('/add',function(req,res,next){
	res.render("admin/purManage/reject.html");
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
module.exports=router;