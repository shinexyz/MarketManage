//导入express框架
let express =require("express");
//初始化express框架
let app=express();
//处理post请求
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
//设置模板引擎相关信息
let ejs=require("ejs");
//设置静态资源的访问
app.use('/public', express.static(__dirname + '/public'));
//导入前台的路由文件
let indexRouter=require("./router/index");
//导入后台的路由文件
let adminRouter=require("./router/admin");
app.use('/',indexRouter);
app.use('/admin',adminRouter);
//设置模板的存放目录
//app.set("views",'./views');
//定义、注册模板引擎
app.engine("html",ejs.__express);
app.set("view engine","html");
//监听服务器
app.listen(3000,function(){
	console.log("node 服务器已启动")
});