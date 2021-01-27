// pages/login/login.js
var util = require('../../utils/util.js');
var api = require('../../configs/api.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse:wx.canIUse('button.open-type.getUserInfo'), //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    openid: "",
    sessionkey:"",//会话状态
    username:"",
    userInfo:{},
    showModal: false,//定义登录弹窗
  },
  //在页面加载的时候,判断用户是否已经授权，完成相应页面跳转
  onLoad: function () {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success:function(res){
        console.log("wx.getSetting")
        console.log(res)
        if(res.authSetting['scope.userInfo']){
          wx.showLoading({
            title: '登录中',
            mask: true,
          })
          wx.getUserInfo({
            //从数据库中获取用户信息
            success:function(res){
              console.log("wx.getUserInfo(")
              console.log(res)
              that.queryUsreInfo();
            //用户已经授权过,直接登录并跳转到“我的”界面
            wx.switchTab({
              url: '/pages/index/index',
              //url: '/pages/user/user'
            })
            }
          })
        }
      }
    })
  },

//微信授权登录
  bindGetUserInfo:function(e){
    wx.showLoading({
      title: '登录中',
      mask: true,
    })
    if(e.detail.userInfo){
      //用户授权登录
      var that=this;
      var userInfo = e.detail.userInfo
      wx.login({
        success:res=>{
          wx.request({
            url:api.Wx_register,
            data:{
              code:res.code,
              group:0,
              iv:e.detail.iv,
              encryptedData: e.detail.encryptedData
            },
            method:'POST',
            header:{
              'content-type': 'application/json'
            },
            success:function(res){
              //注册成功
              console.log("成功授权");
              console.log(userInfo);
              console.log(res)
              const token = res.data.data.tokenHead + res.data.data.token
              //wx.setStorageSync('token', res.data.openid);
              wx.setStorageSync('token', token);
              wx.setStorageSync('userInfo', userInfo);
              that.queryUsreInfo();
            }
          });
          //授权登录成功后，自动跳转至首页
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      })
    }else{
      //用户点击拒绝按钮
      wx.showModal({
        title:'警告',
        content:'您点击了拒绝授权，将影响小程序部分功能的使用，请授权之后重新进入',
        showCancel:false,
        confirmText:'返回授权',
        success:function(res){
          if(res.confirm){
            console.log('用户点击了“返回授权”')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
  },
  //获取已授权用户信息
  queryUsreInfo: function (){
    wx.login({
      success: function(res) {
        console.log('wx.login 返回的')
        console.log(res)
        //发送 code 到后端服务器获取 openid 和其它信息
        wx.request({
          url: api.Wx_login,
          method: 'POST',
          data: {
            code: res.code,
          },
          success: function(res) {
            console.log('api.wx_login 返回的')
            console.log(res)
            if(res.code==200){
              wx.hideLoading();
              wx.showModal({
                title: '登录成功',
                mask:true,
              })
              return;
            }
            if (res.code == 500) {
              //后台不存在，去授权登录
              wx.navigateTo({
                url: '/pages/login/login',
              })
              return;
            }
            if (res.code == 100) {
              //登录微信验证失败
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            const token = res.data.data.tokenHead + res.data.data.token
            wx.setStorageSync('token', token);
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})