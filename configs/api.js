// var EpmApiRootUrl ='http://127.0.0.1:8081/';
var EpmApiRootUrl ='http://ip:8081/';//这里填写自己的ip地址
module.exports = {
  //登录
  Wx_login: EpmApiRootUrl+'user/login',
  Wx_register:EpmApiRootUrl+'user/register',
  Publish:EpmApiRootUrl+'comment/add_comment',//发布新的帖子
  Policy: EpmApiRootUrl+'aliyun/oss/policy',// 获取阿里云对象存储签名
  CityList: EpmApiRootUrl+'province/city_list',//获得某省的城市列表
  CommentList: EpmApiRootUrl+'comment/all_list',//获得某个市的帖子列表
  Detail: EpmApiRootUrl+'comment/detail',//获得某个帖子的具体内容
  LatestComment: EpmApiRootUrl+'comment/latest',//获得最新的五个帖子
  MyCollections: EpmApiRootUrl + 'comment/collect_list',//获得我的收藏列表
  AddCollect: EpmApiRootUrl + 'comment/collect'//添加收藏与取消收藏
}