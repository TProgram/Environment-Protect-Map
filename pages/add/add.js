const api = require("../../configs/api")
const area = require('../../utils/area.js');
var app = getApp();
// pages/add/add.js
Page({
    data: {
      regionList: [],
      regionIndex: [0,0],
      region: ['全部', '全部', '全部'],
      customItem: '全部',
      userId:2,//写死
      theme:"",
      content:"",
      images:[],
      city:"",
      provience:"",
      is_anonymous:0 ,//是否匿名发布
      isshow: false,
      userInfo: {},
      imageNum: 0,
    },
      /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {

    var that = this
    var province = area
    var regionList = that.data.regionList
    regionList[0] = province
    that.setData({
      regionList:regionList,
      regionIndex:[app.globalData.regionID-1,app.globalData.currentIndex]
    })
    console.log(province)
    this.getCity(app.globalData.regionID)
    var that = this
  },
  
  
    bindRegionChange: function (e) {
      let that = this
      this.setData({
        region: e.detail.value,
      })
    },

    //获取发布主题
    setTheme: function (e) {
      this.setData({
        theme: e.detail.value
      })
    },
    //获取发布内容
    setText: function (e) {
      this.setData({
        content: e.detail.value
      })
    },
    
    bindPublish:function(e){
      let userInfo = wx.getStorageSync('userInfo');
      let token = wx.getStorageSync('token');
      console.log(token)
      console.log('userinfo')
      console.log(userInfo)
   //   // 页面显示
      if (token) {
        this.setData({
          isshow: true
        });
        app.globalData.userInfo = userInfo;

        var that = this
      if (this.data.content.length < 1) {
        wx.showToast({
          image: '../../static/images/ic_warn.png',
          title: '内容不能为空',
        })
        return
      }
      if (this.data.theme.length < 1) {
        wx.showToast({
          image: '../../static/images/ic_warn.png',
          title: '主题不能为空',
        })
        return
      }
      wx.showLoading({
        title: '发布中',
      });
      that.setData({
        is_anonymous:0,
      });
      wx.request({
        url: api.Publish,
        header: {
          'Authorization' : wx.getStorageSync("token"),
        },
        data:{
          userId: this.data.userId,
          cityId:app.globalData.cityID,
          title:this.data.theme,
          commentContent: this.data.content,
          isAnonymous:this.data.is_anonymous,
          pics:this.data.images
        },
        method:'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code === 200) {
            wx.showToast({
            title:'发布成功',
            })
            that.setData({
              imageNum:0
            })
            wx.switchTab({
              url: '../talk/talk',
            })
          } else{
            wx.showToast({
              title: '发送失败',
              image: '../../static/images/ic_warn.png',
            })
          }
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

    bindAnopublish:function(e){
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
        var that=this;
      if (this.data.content.length < 1) {
        wx.showToast({
          image: '../../static/images/ic_warn.png',
          title: '内容不能为空',
        })
        return
      }
      wx.showLoading({
        title: '发布中',
      })
      that.setData({
        is_anonymous:1,
      });
      wx.request({
        url: api.Publish,
        header: {
          'Authorization' : wx.getStorageSync("token"),
        },
        data:{
          userId: this.data.userId,
          cityId:app.globalData.cityID,
          title:this.data.theme,
          commentContent: this.data.content,
          isAnonymous:this.data.is_anonymous,
          pics:this.data.images
        },
        method:'POST',
        success: function (res) {
          //发布成功后隐藏加载
          console.log(res)
          if (res.data.code === 200) {
            wx.showToast({
            title:'发布成功',
            })
            that.setData({
              imageNum:0
            })
            wx.switchTab({
              url: '../talk/talk',
            })
          } else{
            wx.showToast({
              title: '发送失败',
              image: '../../static/images/ic_warn.png',
            })
          }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 上传图片 最多上传六张
   */
  uploadImage: function() {
    // todo 判断图片个数是否大于6 如果大于 则提示
    let that=this
    let imageNum=this.data.imageNum
       // 一次上传一张图片
       wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(res)
        console.log(tempFilePaths)
        wx.request({
          url: api.Policy,
          header: {
            'Authorization' : wx.getStorageSync("token"),
          },
          success: function (res) {
            const policy = res.data.data
            // 文件名称使用时间戳 todo: 此处问题不同用户不能再同一s上传 后续可以增加uID等保证不重复 或者后台生成fileName
            const fileName = policy.dir + "/" + new Date().getTime()
            // todo 上传失败判断
              wx.uploadFile({
                url: policy.host, // 开发者服务器的URL。
                filePath: tempFilePaths[0],
                name: 'file', // 必须填file。
                formData: {
                  'key':fileName,
                  'policy':policy.policy,
                  OSSAccessKeyId: policy.accessKeyId,
                  'signature':policy.signature,
                  //'x-oss-security-token': policy. // 使用STS签名时必传。
                },
                success: (res) => {
                  console.log(res)
                  const imgUrl = policy.host +"/" + fileName
                  if (res.statusCode === 204) {
                    console.log('上传成功, 文件地址为: ' + imgUrl);
                    imageNum=imageNum+1;
                    that.setData({
                      imageNum:imageNum,
                      images: that.data.images.concat(imgUrl)
                    })
                    let images=that.data.images
                    console.log(imageNum)
                    console.log(images)
                  }
                },
                fail: err => {
                  console.log(err);
                }
              });
            }
        })
    }})
    

  },

//选择地区
  bindRegionChange: function (e) {
    let that = this
    var data = e.detail.value
    var curregionID = that.data.regionList[0][data[0]].value
    var cityID = that.data.regionList[1][data[1]].value
    app.globalData.cityID = cityID
    console.log("地区选择发生变化 regionID: " + curregionID + " cityID: " + cityID)
  },

  bindAreaChange:function(e){
    var that = this
    var regionIndex = that.data.regionIndex
    var regionList = that.data.regionList
    regionIndex[e.detail.column] = e.detail.value
    that.setData({
     regionIndex: regionIndex
    })
     if(e.detail.column==0){//判断当前改变的是第一列，下标从0开始
       const index = e.detail.value
       var provinceID = regionList[0][index].value
       this.getCity(provinceID)
     }
   },
 
   /**
    * 根据省份ID 获取市区列表
    */
   getCity: function(provinceId) {
     var that = this
     wx.request({
       url: api.CityList + "?provinceId=" + provinceId,
       success: function(res) {
         console.log(res)
         const city = res.data.data.provinceCityItemList
         var cityName = []
         for (var i = 0 ; i < city.length; i++) {
           cityName.push({
             "name": city[i].cityName,
             "value": city[i].cityId
           })
         }
 
         var regionList = that.data.regionList
         regionList[1] = cityName
         that.setData({
           regionList: regionList,
           cityObject: city
         })
       }
     })
   }
})