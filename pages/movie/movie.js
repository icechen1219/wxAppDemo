// pages/movie/movie.js
const util = require('../../utils/util.js')
var currentCity = '重庆';
const formatStars = n => {//因为api返回的星数是两位数，不足补0，所以显示时需要去0
  return n[0]=='0'?n[1]:n;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
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
    this.searchCity(currentCity);
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
  showInTheaters: function (e) {
    this.setData({
      index: 1,
    })
    this.searchCity(currentCity);
  },
  showCommingSoon: function (e) {
    this.setData({
      index: 2,
    })
    this.searchCity(currentCity);
  },
  showTop250: function (e) {
    this.setData({
      index: 3,
    })
    this.searchCity(currentCity);
  },
  showDetail: function (e) {
    // console.log(e.target);
    // console.log(e.currentTarget)
    // wx.showToast({
    //   title: '推荐指数：'+e.currentTarget.dataset.stars,
    // })
    var index = e.currentTarget.dataset.index;
    var film = this.data.movies[index];
    wx.showModal({
      title: film.title,
      content: '上映时间：' + film.mainland_pubdate + '\r\n影片时长：' + film.duration + '\r\n推荐指数：' + formatStars(film.stars),
      showCancel: false,
    })
  },
  searchCity: function (city) {
    var _this = this;
    var url = 'https://douban.uieee.com/v2/movie/action?city=' + city.replace('市', '');//接口不能带“市”
    if (this.data.index === 2) {
      url = url.replace('action', 'coming_soon');
    } else if (this.data.index === 3) {
      url = url.replace('action', 'top250');
    } else {
      url = url.replace('action', 'in_theaters');
    }
    console.log(url);
    wx.showLoading({
      title: '小二正在拼命加载中...',
    })
    wx.request({
      url: url,
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        console.log(res);
        // console.log(Array.isArray(res.data.subjects))
        if (res.statusCode == '200') {
          var movies = res.data.subjects;
          var films = [];//由于原数据包含太多无用信息，导致页面解析层次复杂，因此重新组织json对象传给页面渲染
          console.log(movies.length);
          for (var i = 0; i < movies.length; i++) {
            var movie = {};
            movie.title = movies[i].title;
            movie.duration = movies[i].durations[0] && movies[i].durations[0].replace(/(\d+).*/g, "$1分钟");
            movie.casts = [];
            for (var j = 0; j < movies[i].casts.length; j++) {
              movie.casts.push(movies[i].casts[j].name);
            }
            movie.directors = [];
            for (var j = 0; j < movies[i].directors.length; j++) {
              movie.directors.push(movies[i].directors[j].name);
            }
            movie.logo = movies[i].images.small;
            movie.mainland_pubdate = movies[i].mainland_pubdate;
            movie.stars = movies[i].rating.stars;
            films.push(movie);
          }
          console.log(films);

          _this.setData({
            movies: films,
          })
        }
      },
      complete: function (res) {
        currentCity = city;
        _this.setData({
          currentCity: currentCity,
        })
        wx.hideLoading();
        wx.hideNavigationBarLoading();
      }
    })
  },
})