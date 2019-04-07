let express = require("express");
let router = new express.Router();
let crypto = require('crypto');
//导入数据库连接
const mysql = require("../../config/db.js");

//管理员管理页面
router.get('/',function(req,res,next){
	//搜索功能,获得地址栏数据req.query;获得表单数据req.body
	let search = req.query.search ? req.query.search :"";
	//显示管理员功能
	//从数据库中检索数据
	mysql.query("select * from admin where username like ? order by id",[`%${search}%`],function(err,data){
		if (err) {
			return "";
		}else{
			//将数据传递给页面
			res.render("admin/adminManage/adminManage.html",{data:data,search:search});
			//console.log(data);
		}

	});
	
});

//管理员修改页面
router.get('/edit',function(req,res,next){
	//接受数据的id
	let id = req.query.id;
	//查询对应数据
	mysql.query("select * from admin where id ="+id,function(err,data){
		if (err) {
			return "";
		}else{
			//加载修改页面
			res.render("admin/adminManage/edit.html",{data:data[0]});

		}

	});

});
//管理员数据修改功能
router.post('/edit',function(req,res,next){
	//接收表单中的数据
	let {id,username,tel,password,repassword,permission} = req.body;
	//判断用户是否修改密码
	let sql="";
	if (password) {
		//修改了密码
		let md5=crypto.createHash('md5');
		password=md5.update(password).digest('hex');
		sql = `update admin set tel = '${tel}',password = '${password}',permission = '${permission}' where id = ${id}`;

	}else{
		//没有修改密码
		sql = `update admin set tel = '${tel}',permission = '${permission}' where id = ${id}`;
	}
	//执行SQL语句
	mysql.query(sql,function(err,data){
		if (err) {
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

//管理员添加页面
router.get('/add',function(req,res,next){
	res.render("admin/adminManage/add.html");
});

//管理员的添加功能
router.post("/add",function(req,res,next){
	let {username,tel,password,repassword,permission}=req.body;
	//判断账号是否为空
	if(username){
		//电话号码是否为空
		if (tel) {
			//密码是否为空
		if (password) {
			if (password==repassword) {
				//判断账号是否已存在
				mysql.query("select * from admin where username=?",[username],function(err,data){
					if (err) {
						console.log("判断出错");
						return "";
					}else{
						//判断账号是否已存在
						if(data.length==0){
							//没有注册。插入数据
							//密码，MD5加密
						
							let md5=crypto.createHash('md5');
							password=md5.update(password).digest('hex');
							//mysql.query("insert into admin(username,password,permission) values('admin','123456','全部')",function(){});
							mysql.query("insert into admin(username,tel,pwd,permission) values(?,?,?,?)",
								[username,tel,password,permission],function(err,data){
									if(err){
										
										return "插入出错";
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
							res.send("<script>alert('该账号已存在');history.go(-1)</script>");
						}
					}
				});

			}else{
				res.send("<script>alert('两次密码不一致');history.go(-1)</script>");
			}

		}else{

			res.send("<script>alert('请输入密码');history.go(-1)</script>");
		}

		}else{
			res.send("<script>alert('请输入手机号');history.go(-1)</script>");

		}


	}else{
		res.send("<script>alert('请输入账号');history.go(-1)</script>");
	}
});

//无刷新删除数据
router.get('/ajax_del',function(req,res,next){
	//接受地址栏数据
	let id = req.query.id;
	//删除数据
	mysql.query(`delete from admin where id = ${id}`,function(err,data){
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

module.exports=router;