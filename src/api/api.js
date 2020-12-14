export default {
  api: {
  	getLogin:'Login',//登陆--获取guid
  	getCodeLogin:'CodeLogin',//验证码登陆
  	getCode:'VerificationCode',//获取验证码
  	ModifyPWD:'ModifyPWD',//修改密码
  	getProCate:'ProductHomePage',//获取品类
  	getPro:'ProductByType',//由品类获取产品--查询
  	getSearch:'Search',//关键字查询
  	SearchItem:'SearchItem',//点击”查询“关键字查询
  	ActiveImg:'ActivityShow',//活动轮播图
  	getActivity:'GetActivity',//获取活动产品
  	ActivityState:'ActivityState',//秒杀活动状态判断
  	ActivityItemState:'ActivityItemState',//判断是否已抢，是否抢完
  	FlashSale:'FlashSale',//马上抢
  	cartTotal:'ShoppingCartQty',//购物车总数
  	addCart:'AddShoppingCart',//添加购物车-调用购物车失败
  	delCat:'ShoppingCart',//删除购物车
  	DetailCart:'ShoppingCartValid',//购物车预览
  	PlaceOrder:'PlaceOrder',//购物车预览
  	AdvanceOrder:'AdvanceOrder',//提交订单
  	modifName:'ModifyLogin',//修改用户名
  	EditPass:'EditPWD',//修改密码
  	GetInte:'Integral',//积分查询
  	GetInteFlow:'IntegralFlow',//积分明细
  	GetOrder:'AdvanceOrder',//订单查询
  	Arrival:'Arrival',//确认收货
  	TimeLine:'OrderTimeLine',//物流详情
  	SaleDetails:'SaleDetails',//进货明细
  	ProDetail:'OrderDetails',//产品明细
  	GetStore:'AdvanceStore',//由erpno获取仓库
  	getCart:'ShoppingCart',//购物车缺货查询
  	AddFavorite:'AddFavorite',//添加收藏
  	DelFavorite:'DelFavorite',//取消收藏
  	GetFavorite:'GetFavorite',//收藏查询
  	SaleRecord:'SaleRecord',//购买历史
  	ImportPro:'ImportProducts',//产品批量导入
  	GetMessage:'GetMessage',//未读消息数量
  	MessageRead:'MessageRead',//设置已读
  	GetLiheqi:'Liheqi',//离合器查询
  	GetDhxq:'XianQuan',//点火线圈
    GetYchuan:'YangChuan',//氧传感器
  	WeChatLogin:'WeChatLogin',//微信端登陆
  	VinOCR :'VinOCR', //上传VIN码
    VinCode : "VinCode", //根据VIN码查询数据
    ProductByOemNo : "queryProductByOemNo", //OEM编号对应产品信息查询
    ProductsByProductNo : "queryProductsByProductNo", //产品编号对应产品信息查询
    ProductCategoryByVehicle : "queryVehicleProperty", //车型查询对应匹配的产品分类
    ProductByVehicle : "queryProductByVehicle", //车型查询对应匹配的产品
    VehicleByProductId : "queryVehicleByProductId", //获取车型信息
    ProductCategoryByUsr : "queryProductCategoryByUsr", //用户产品分类
    ProductDetails : "ProductDetails", //查看详情
    ProductImage : "ProductImage", //详情页
    VehiclePropertyByengineModel : "queryVehiclePropertyByengineModel", //发动机型号
    ProductMB001 : "ProductMB001", //查询产品的详情
    VehicleByProductNo : "queryVehicleByProductNo", //适配车型
    Multiple : "Multiple", //首页按属性查询
    RecentSale : "RecentSale", //最近购买记录
    GetProdctList : "GetProdctList" ,//属性查询
    LoginOut:'LoginOut',//退出登陆
    GetProductsByLevelId : 'GetProductsByLevelId', //根据levelId查询产品
    GetHot: 'getHot',//获取轮播产品图片
  },
  imgUrl:'http://120.76.144.84:8088',//图片公共地址
}
