let express=require("express");
let router=new express.Router();
//采购进货
router.get('/',function(req,res,next){
	res.send("采购进货");
});
//采购退货
router.get('/ret',function(req,res,next){
	res.send("采购退货");
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