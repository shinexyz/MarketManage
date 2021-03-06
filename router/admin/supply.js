let express = require("express");
let router = new express.Router();
//导入数据库连接
const mysql = require("../../config/db.js");

router.get('/',function(req,res,next){
	//数据查询、显示
	let search = req.query.search ? req.query.search :"";
	// //查询数据
	mysql.query("select * from supply where name like ? order by id",[`%${search}%`],function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			
			res.render("admin/supplyManage/supply.html",{data:data,search:search});
		}

	});
});
router.get('/add',function(req,res,next){
	res.render("admin/supplyManage/supply_add.html");
});
//供货商添加功能
router.post('/add',function(req,res,next){
	let {name,tel,adress,stype} = req.body;
	//判断
	if (name) {

		if (tel) {
				//判断是否存在
				mysql.query("select * from supply where name = ?",[name],function(err,data){
					if (err) {

						return "";
					}
					else{
						//不存在
						if (data.length==0) {
							//不存在，添加
							mysql.query("insert into supply(name,tel,type,adress) values(?,?,?,?)",
								[name,tel,stype,adress],function(err,data){
									if (err) {
										return "";
									}else{
										//判断是否成功
										if (data.affectedRows==1) {
								
											res.send("<script>alert('添加成功');history.go(-2)</script>");
										}else{

											res.send("<script>alert('添加失败');history.go(-1)</script>");
											}
									}
								});

						}else{

							res.send("<script>alert('该供货商已存在');history.go(-1)</script>");
						}
						
					}
				});

		}else{

			res.send("<script>alert('请输入供货商联系电话');history.go(-1)</script>");
		}

	}else{
	
		res.send("<script>alert('请输入供货商名称');history.go(-1)</script>");
	}
});
//供应商修改
router.get('/edit',function(req,res,next){
	let id = req.query.id;
	//查询ID对应的数据
	mysql.query("select * from supply where id = "+id,function(err,data){
		if (err) {
			console.log(err);
			return "";

		}else{
			 //加载修改页面
			 res.render("admin/supplyManage/supplyEdit.html",{data:data[0]});
		}
	}); 
});
//修改
router.post('/edit',function(req,res,next){
	let {id,name,tel,adress} = req.body;
	//修改数据库数据
	let sql=`update supply set tel = '${tel}',adress = '${adress}' where id = ${id}`;
	mysql.query(sql,function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			if (data.affectedRows==1) {
				res.send("<script>alert('修改成功');history.go(-2)</script>");

			}else{
				res.send("<script>alert('修改失败');history.go(-1)</script>");

			}
		}
	})
});
//删除数据
router.get('/ajax_del',function(req,res,next){
	//接受地址栏数据
	let id = req.query.id;
	//删除数据
	mysql.query(`delete from supply where id = ${id}`,function(err,data){
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
module.exports = router;