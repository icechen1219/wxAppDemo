// pages/kidstory/baoyin.js
const context = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    stories: [],
    baseUrl: "https://loveboyin.cn/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载服务器的故事列表数据
    wx.request({
      url: 'https://loveboyin.cn/KidStory',
      method: 'get',
      dataType: 'json',
      success: res=> {
        console.log(res);
        this.setData({
          stories: res.data.contents,
          count: res.data.count,
        })
      }
    })


    context.onWaiting(() => {
      console.log("loading...")
    });
    context.onPrev(() => {
      console.log("点击上一曲...")
    })
    context.onNext(() => {
      console.log("点击下一曲...")
    })
    context.onStop(() => {
      console.log("点击了停止...")
    })
    context.onEnded(() => {
      console.log('播放完毕');
      var tmp = this.data.stories.map(function (story, i) {
        if (story.state != 0) {
          story.state = 0;
        }
        return story;
      });
      this.setData({
        stories: tmp,
      })
    })
    context.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
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
  playStory: function (event) {
    var index = event.currentTarget.dataset.index;
    console.log(index);
    if (this.data.stories[index].state == 0) {//如果故事停止，就可以播放
      var tmp = this.data.stories.map(function (story, i) {
        if (index == i) {
          story.state = 1;
        } else {
          story.state = 0;
        }
        return story;
      });
      this.setData({
        stories: tmp,
      })
    } else {//如果播放，就应该停止
      context.stop();
      var tmp = this.data.stories.map(function (story, i) {
        if (index == i) {
          story.state = 0;
        }
        return story;
      });
      this.setData({
        stories: tmp,
      })
      return;
    }

    context.title = this.data.stories[index].title
    context.epname = this.data.stories[index].album
    context.singer = ''
    context.coverImgUrl = this.data.baseUrl + this.data.stories[index].cover
    context.src = this.data.baseUrl + this.data.stories[index].url;

    if (this.data.stories[index].state == 1) {
      context.play();
    }

  },
  showDetail: function (event) {
    console.log(event)
  }
})