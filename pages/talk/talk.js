var api = require('../../configs/api.js')
var app = getApp(),
  _this
Page({
  data: {
    regionID: app.globalData.regionID,
    cityID: app.globalData.cityID,
    navData: [{
      id: 0,
      cat_name: '全部'
    }, ],
    currentTab: 0,
    navScrollLeft: 0,
    lists: [],
    talks: []
  },
  init() {
    isEnd = false, page = 1
    _this.setData({
      lists: []
    })
  },
  onShow(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    _this = this;
    var regionID = app.globalData.regionID
    var cityID = app.globalData.cityID
    _this.setData({
      regionID: regionID,
      cityID: cityID
    })
    //获取所有的分类
    _this.getCategory(regionID, cityID)
  },
  getCategory(regionID, cityID) {
    console.log("当前页面讨论省份 "+ regionID + " cityID" + cityID)
    var that = this
    wx.request({
      url: api.CityList + "?provinceId=" + regionID,
      success: function(res) {
        console.log(res)
        const city = res.data.data.provinceCityItemList
        console.log('city:',city)
        var navData = []
        // 根据cityName 定位到对应的子tab
        var currentTab = 0
        app.globalData.cityID = city[0].cityId
        for (var i = 0 ; i < city.length; i++) {
          if (cityID == city[i].cityId) {
            currentTab = i
            app.globalData.currentIndex = i
            app.globalData.cityID = city[i].cityId
          }
          navData.push({
            "id": city[i].cityId,
            "cat_name": city[i].cityName
          })
        }
        that.setData({
          navData: navData,
          currentTab: currentTab
        })
        that.getCommentList()
        app.globalData.cityID = city[currentTab].cityId
        that.changeTalks(currentTab)
      }
    })
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    this.getCommentList()
    this.changeTalks(cur)
  },

  // 切换对应的讨论信息
  changeTalks(index) {
    var that = this
    app.globalData.currentIndex = index
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (index - 2) * singleNavWidth
    })
    if (this.data.currentTab == index) {
      return false;
    } else {
      this.setData({
        currentTab: index
      })
    }
    console.log("currentTab: " + index)
    var data = that.data.navData[index]
    console.log(data)
    app.globalData.cityID = data.id
    that.getCommentList()
    var talks = that.data.talks
    console.log(talks)

    // todo 此处需要调用APi 
    for(var i = 0 ; i < talks.length ; i++) {
      talks[i].cat_name = data.cat_name
    }

    that.setData({
      talks: talks
    })
    //
    console.log("ti")
  },

    /**
   * 带参跳转
   */
  newPost: function(e) {
    wx.navigateTo({
      url: '../add/add'
    })
  },

  detail: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?postid=' + e.currentTarget.dataset.id,
    })
  },

  getCommentList: function () {
    var that = this
    wx.request({
      url: api.CommentList+'?cityId='+app.globalData.cityID,
      success:function(res) {
        // console.log('该城市的列表'+app.globalData.cityID)
        // console.log(res.data.data.commentInfoItemList)
        var talkList = res.data.data.commentInfoItemList
        that.setData({
          talks:talkList
        })

      }

    })
  }

})