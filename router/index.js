let express=require("express");
let router=express.Router();
//前端主页面
router.get('/',function(req,res,next){
	res.send("超市销售管理系统主页面");
});
//前台登录页面
router.get('/login',function(req,res,next){
	res.send("超市销售管理系统登录页面");
});
//前台注册页面
router.get('/reg',function(req,res,next){
	res.send("超市销售管理系统注册页面");
});
module.exports=router;