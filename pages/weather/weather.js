// pages/weather/weather.js
const util = require('../../utils/util.js')
var currentCity = null;
var isNight = function (hour) {
  return hour > 18 || hour < 6;
}
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getLocation(this.searchCity);
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
    wx.showNavigationBarLoading();
    this.queryWeather();
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
  bindKeyInput: function (e) {
    currentCity = e.detail.value;
  },
  queryWeather: function (e) {
    this.searchCity(currentCity);
  },
  /**
   * 封装查询某个城市的函数已备调用
   */
  searchCity: function (city) {
    var _this = this;
    var now = new Date();
    // now.setHours(20);

    wx.request({
      url: 'https://api.map.baidu.com/telematics/v3/weather?output=json&ak=cXElaABOrshpldV9amGWqrewaQUyVdwN&location=' + city,
      success: function (res) {
        console.log(res)
        if (res.data.error !== 0) {
          wx.showToast({
            title: '城市名错误！',
            duration: 2000,
          })
          return;
        }
        var result = res.data.results[0];
        var weatherData = result.weather_data[0];
        var tips = result.index[0];
        _this.setData({
          city: result.currentCity,
          today: weatherData.date.replace(/(\S+)\s+(\S+)\s+\((\S+)\)/g, "$2 $1\n$3"),
          pic: isNight(now.getHours()) ? weatherData.nightPictureUrl : weatherData.dayPictureUrl,
          weather: weatherData.weather,
          wind: weatherData.wind,
          temp: weatherData.temperature,
          tips: tips.tipt + "：" + tips.des,
        })
      },
      complete: function (res) {
        currentCity=city;
        console.log("Done.")
        wx.hideNavigationBarLoading();
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  
  
})