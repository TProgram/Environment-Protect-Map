//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';
import geoJson from './china.js';
const area = require('../../utils/area.js');
var api = require('../../configs/api.js');
const app = getApp()

function randomData() {
  return Math.round(Math.random() * 1000);
}
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  echarts.registerMap('china', geoJson);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    geo: [
      {
        // 地理坐标系组件
        map: "china",
        roam: true, // 可以缩放和平移
        aspectScale: 0.8, // 比例
        layoutCenter: ["50%", "40%"], // position位置
        layoutSize: 330, // 地图大小，保证了不超过 370x370 的区域
        label: {
          // 图形上的文本标签
          normal: {
            show: false,
            textStyle: {
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: '10'
            }
          },
          emphasis: { // 高亮时样式
            color: "#333"
          }
        },
        itemStyle: {
          // 图形上的地图区域
          normal: {
            borderColor: "rgba(0,0,0,0.2)",
            areaColor: "#aaa",
            borderWidth: 0.2,
            borderColor:'#f7f7f7',
          },
          
        }
      }
    ],

    visualMap: {
      min: 0,
      max: 100,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [{
      type: 'map',
      mapType: 'china',
      geoIndex:0,
      label: {
        normal: {
          show: true
        },
        emphasis: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      itemStyle: {

        normal: {
          borderColor: '#389BB7',
          areaColor: '#fff',
        },
        emphasis: {
          areaColor: '#389BB7',
          borderWidth: 0
        }
      },
      animation: false,

      data: [
        { name: '北京', value: 1 },
        { name: '上海', value: 2 },
        { name: '天津', value: 3 },
        { name: '重庆', value: 4 },
        { name: '河北', value: 5 },
        { name: '山西', value: 6 },
        { name: '辽宁', value: 7 },
        { name: '吉林', value: 8 },
        { name: '黑龙江', value: 9 },
        { name: '江苏', value: 10 },
        { name: '浙江', value: 11 },
        { name: '安徽', value: 12 },
        { name: '福建', value: 13 },
        { name: '江西', value: 14 },
        { name: '山东', value: 15 },
        { name: '河南', value: 16 },
        { name: '湖北', value: 17 },
        { name: '湖南', value: 18 },
        { name: '广东', value: 19 },
        { name: '海南', value: 20 },
        { name: '四川', value: 21 },
        { name: '贵州', value: 22 },
        { name: '云南', value: 23 },
        { name: '陕西', value: 24 },
        { name: '甘肃', value: 25 },
        { name: '青海', value: 26 },
        { name: '台湾', value: 27 },
        { name: '西藏', value: 28 },
        { name: '广西', value: 29 },
        { name: '内蒙古', value: 30 },
        { name: '宁夏', value: 31 },
        { name: '新疆', value: 32 },
        { name: '香港', value: 33 },
        { name: '澳门', value: 34 }
      ]


    }],

  };

  chart.setOption(option);
  chart.on('click', (e) => {
    console.log(e)
    app.globalData.regionID = e.value
    app.globalData.currentIndex = 0//从省级跳过去，则currentIndex指向第一个城市
    // 此处使用名称跳转到讨论区
    wx.switchTab({
      url: '/pages/talk/talk'
    })
  })
  return chart;
}

Page({
  bindRegionChange: function (e) {
    let that = this
    var data = e.detail.value
    console.log(data)
    app.globalData.regionID = that.data.regionList[0][data[0]].value
    app.globalData.cityID = that.data.regionList[1][data[1]].value
    console.log('app.globalData')
    console.log(app.globalData)
    // 此处使用名称跳转到讨论区
    wx.switchTab({
      url: '/pages/talk/talk'
    })
  },

  data: {
    regionList: [],
    regionIndex: [0,0],
    cityObject: [],
    region: ['广东省', '广州市'],
    customItem: '全部',
    latestCommentList: [],
    ec: {
      onInit: initChart
    }
  },

  onLoad: function (options) {
    var that = this
    var province = area
    var regionList = that.data.regionList
    regionList[0] = province
    console.log('regionlist',regionList)

    that.getLatestCommentList()

    that.setData({
      regionList:regionList,
    })
    console.log(province)
    this.getCity(province[0].value)
  },

  onShow: function () {
    this.getLatestCommentList()
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
  },

  getLatestCommentList: function() {
    var that = this
    wx.request({
      url: api.LatestComment,
      success: function(res){
        console.log(res.data)
        var latestCommentList = res.data.data.commentInfoItemList
        that.setData({
          latestCommentList: latestCommentList
        })
        console.log(that.data)
      }
    })
  },

  detail: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?postid=' + e.currentTarget.dataset.id,
    })
  },
})
