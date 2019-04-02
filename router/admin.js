let express=require("express");
let router=express.Router();
//后台页面首页
router.get('/',function(req,res,next){
	res.render("admin/index");
});

//管理员页面
let adminRouter=require('./admin/admin');
router.use('/admin',adminRouter);
//进货管理页面
let purRouter=require('./admin/purchase');
router.use('/purchase',adminRouter);
//销售管理页面
let sellRouter=require('./admin/sell');
router.use('/sell',adminRouter);
//库存管理页面
let storRouter=require('./admin/stock');
router.use('/stock',adminRouter);
//统计报表页面
let formRouter=require('./admin/form');
router.use('/form',adminRouter);
//员工管理页面
let staffRouter=require('./admin/staff');
router.use('/staff',adminRouter);
//系统设置页面
let sysRouter=require('./admin/sys');
router.use('/sys',adminRouter);
module.exports=router;