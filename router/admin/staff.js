let express = require("express");
let router = new express.Router();
//导入数据库连接
const mysql = require("../../config/db.js");

router.get('/',function(req,res,next){

	let p = req.query.p ? req.query.p : 1;
	let size = 5;
	let start = (p-1)*size;
	//计算总数据
	mysql.query("select count(*) total from staff",function(err,data){
		if (err) {
			console.log(err);
			return "";
		}else{
			//console.log(data[0]);
			let total = data[0].total;
			let pages = Math.ceil(total/size);
			//let search = req.query.search ? req.query.search :"";
			mysql.query("select * from staff  order by id desc limit ?,?",[start,size],function(err,data){
				if (err) {
						console.log(err);
						return "";
				}else{
			
						res.render("admin/staffManage/staffManage.html",
									{
										data:data,
										page:p,
										pages:pages
									});
					}

			}); 
		}
	});
	
});
router.get('/add',function(req,res,next){

	res.render("admin/staffManage/staffAdd.html");

});
router.post('/add',function(req,res,next){

	let {name,tel,sex,position,age} = req.body;
	if (name) {

		if (tel) {

			//插入数据库
			mysql.query("insert into staff(name,tel,sex,position,age) values(?,?,?,?,?)",
					[name,tel,sex,position,age],function(err,data){
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

			res.send("<script>alert('请输入联系电话');history.go(-1)</script>");

		}

	}else{
		res.send("<script>alert('请输入员工姓名');history.go(-1)</script>");

	}

});
module.exports=router;