const util = require('../../utils/util.js');
const api = require("../../configs/api");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contentLoaded: true,
    imagesLoaded: true,
    commentLoaded: true,
    detail: {},
    imageUrls: [],
    //collected: false,
    inputBoxShow: true,
    maxContentLength: 300,
    comment: '',
    comments: [],
    postid: '',
    comment_value: '',
    openid: '',
    isCollect:false,
    userId:2,
    isAnonymous:0,
  },
  //刷新评论
  refreshComment: function (postid) {
    var that = this
    // todo 调用获取评论函数
    // var comments = [{
    //   name: "commentsTest",
    //   time: 0,
    //   content: "comment",
    //   avatarUrl: "../../static/images/headimg.jpg"
    // }]
    wx.request({
      url: api.Detail +'?commentId='+that.data.postid,
      header: {
        'Authorization' : wx.getStorageSync("token"),
      },
      success: function(res){
        // console.log(res)
        var comments = res.data.data.commentInfoItemList
        console.log('??')
        console.log(comments.slice(1,comments.length))
        console.log(res.data.data.commentInfoItemList)
        that.setData({
          detail:res.data.data.commentInfoItemList[0],
          comments:comments.slice(1,comments.length)
        })
      }
    })
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    console.log('postid', options.postid)
    this.setData({
      postid: options.postid
    })

    // 获取发帖详情
    wx.request({
      url: api.Detail +'?commentId='+that.data.postid,
      header: {
        'Authorization' : wx.getStorageSync("token"),
      },
      success: function(res){
        console.log(res)
        var detailData = res.data.data.commentInfoItemList[0];
        that.setData({
          detail:detailData,
          isCollect:detailData.collect,
          imageUrls: detailData.pics,
          imagesLoaded: true
        })
      }
    })

    //结束符2.0
    //})
    // 获取评论
    this.refreshComment(options.postid)
    wx.hideLoading()
  },
  /**
   * 从数据库获取图片的fileId，然后去云存储下载，最后加载出来
   */
  downloadImages: function (image_urls) {
    var that = this
    if (image_urls.length == 0) {
      that.setData({
        imageUrls: [],
        imagesLoaded: true
      })
    } else {
      var urls = []
      for (let i = 0; i < image_urls.length; i++) {
        that.setData({
          imageUrls: image_urls,
          imagesLoaded: true
        })
        // wx.cloud.downloadFile({
        //   fileID: image_urls[i],
        //   success: res => {
        //     // get temp file path
        //     console.log(res.tempFilePath)
        //     urls.push(res.tempFilePath)
        //     if (urls.length == image_urls.length) {
        //       console.log(urls)
        //       that.setData({
        //         imageUrls: urls,
        //         imagesLoaded: true
        //       })
        //       this.checkLoadFinish()
        //     }
        //   },
        //   fail: err => {
        //     // handle error
        //   }
        // })

      }
    }
    this.checkLoadFinish()
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

  sendComment: function () {
    
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
      
      var that = this
      if (this.data.comment.length < 1) {
        wx.showToast({
          image: '../../images/ic_warn.png',
          title: '评论不能为空',
        })
  
        return
      }
      wx.showLoading({
        title: '发布中',
      })
      wx.request({
        url: api.Publish,
        header: {
          'Authorization' : wx.getStorageSync("token"),
        },
        data: {
          commentId: this.data.detail.commentId,
          userId:this.data.userId,
          commentContent: this.data.comment,
          cityId: app.globalData.cityId,
          isAnonymous:this.isAnonymous,
          title:this.data.detail.title
        },
        method:'POST',
        success: function (res) {
          //评论成功后隐藏加载
          wx.hideLoading()
          that.refreshComment(that.data.postid)
          that.setData({
            comment_value: ''
          })
        }
      })
    } else {
      wx.showModal({
        title:'温馨提示',
        content:'您还没有登录，不能发帖',
        showCancel:false,
        confirmText:'去登录',
        success:function(res){
          if(res.confirm){
            console.log('用户点击了“去登录”')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });

  },
  input: function (e) {
    if (e.detail.value.length >= this.data.maxContentLength) {
      wx.showToast({
        title: '已达到最大字数限制',
      })
    }
    this.setData({
      comment: e.detail.value
    })
  },
  //如果所有数据加载完毕，隐藏加载弹窗
  checkLoadFinish: function () {
    const that = this
    if (that.data.contentLoaded &&
      that.data.imagesLoaded &&
      that.data.commentLoaded) {
      wx.hideLoading()
    }
  },
  delclick: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'del_post',
      data: {
        postid: this.data.postid
      },
      success: function (res) {
        var pages = getCurrentPages(); //  获取页面栈
        var prevPage = pages[pages.length - 2]; // 上一个页面
        prevPage.setData({
          update: true
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }, )
    // console.log('1234')
  },
  // wowtap:function(){
  //   if ((this.data.detail.collecter.includes(app.globalData.wechatOpenid)))
  //   {
  //     console.log("删除前"+this.data.detail.collecter)
  //     this.data.detail.collecter.splice(this.data.detail.collecter.indexOf(app.globalData.wechatOpenid))
  //     console.log("删除后"+this.data.detail.collecter)
  //   }
  //   else
  //   {
  //     this.data.detail.collecter.push(app.globalData.wechatOpenid)
  //   }
  //   wx.cloud.callFunction({
  //     name: 'add_like',
  //     data: {
  //       postid: this.data.postid,
  //       collecter:this.data.detail.collecter
  //     }
  //   })
  //  this.setData({
  //    wow:!this.data.wow
  //  })

  // }
  collect_tap:function() {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        isCollect:!this.data.isCollect
      })
      wx.request({
        url: api.AddCollect+'?commentId='+this.data.detail.commentId+'&isCollect='+this.data.isCollect,
        header: {
          'Authorization' : wx.getStorageSync("token"),
        },
  
      })
    }else{
      wx.showModal({
        title:'温馨提示',
        content:'您还没有登录，不能收藏',
        showCancel:false,
        confirmText:'去登录',
        success:function(res){
          if(res.confirm){
            console.log('用户点击了“去登录”')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
    
  }
})