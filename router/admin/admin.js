let express=require("express");
let router=new express.Router();
let crypto = require('crypto');
//导入数据库连接
const mysql = require("../../config/db.js");

//管理员管理页面
router.get('/',function(req,res,next){
	res.render("admin/adminManage/adminManage.html");
});

//管理员修改页面
router.get('/edit',function(req,res,next){
	res.send("管理员修改页面");
});

//管理员添加页面
router.get('/add',function(req,res,next){
	res.render("admin/adminManage/add.html");
});

//管理员的添加功能
router.post("/add",function(req,res,next){
	let {username,password,repassword,permission}=req.body;
	//判断账号是否为空
	if(username){
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
							mysql.query("insert into admin(username,password,permission) values(?,?,?)",
								[username,password,permission],function(err,data){
									if(err){
										
										return "";
									}else{
										//判断是否成功
										if (data.affectedRows==1) {
											res.send("<script>alert('添加成功');location.href='admin/admin/add'</script>");
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
		res.send("<script>alert('请输入账号');history.go(-1)</script>");
	}
});


//管理员删除页面
router.get('/del',function(req,res,next){
	res.send("管理员删除页面");
});


module.exports=router;