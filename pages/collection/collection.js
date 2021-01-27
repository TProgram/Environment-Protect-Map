// pages/collection/collection.js
var api = require('../../configs/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collections: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      url: api.MyCollections,//todo
      header: {
        'Authorization' : wx.getStorageSync("token"),
      },
      success: function(res) {
        console.log(res.data.data.commentInfoItemList)
        that.setData({
          collections: res.data.data.commentInfoItemList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  detail: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?postid=' + e.currentTarget.dataset.id,
    })
  },
})