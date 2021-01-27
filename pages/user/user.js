var util = require('../../utils/util.js');
var api = require('../../configs/api.js');
var app = getApp();
// pages/user/user.js
Page({
  data: {
    userInfo: {},
    hasMobile: '',
    fUser: {},
    commission: {
      allProfit: 0,
      getProfit: 0
    },
    isshow: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {

  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
     let token = wx.getStorageSync('token');
     console.log(token)
     console.log(userInfo)
  //   // 页面显示
     if (token) {
       this.setData({
         isshow: true
       });
       app.globalData.userInfo = userInfo;
       //app.globalData.token = token;
     } else {
       wx.redirectTo({
         url: '../login/login'
       })
       //wx.removeStorageSync('userInfo');
     }
     this.setData({
       userInfo: app.globalData.userInfo
     });
   },
  noLogin() {
    console.log('-----*noLogin*******---------', wx.getStorageSync('token'))
    if (!wx.getStorageSync('token')) {
      console.log("}}}}}}")
      wx.showToast({
        title: '请先登录～',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
  },
  onHide: function () {
    // 页面隐藏 
  },
  onUnload: function () {
    // 页面关闭 
  },
  onShareAppMessage: function () {
    this.noLogin();
    return {
      title: '邀请好友',
      path: 'pages/product/product?id=-1&userId=' + wx.getStorageSync('uId')
    }
  },
  //退出登录
  exitLogin: function () {
    let that = this
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        console.log("------:", res)
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('userId');
          //app.globalData.userInfo = {}
          that.setData({
            userInfo: {},
          });
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  },
  callus: function() {
    wx.navigateTo({
      url: '../callus/callus',
    })
  },
  collection: function() {
    wx.navigateTo({
      url: '../collection/collection',
    })
  }
})