// pages/imageGame/poem.js
var tips = [
  '李白狂饮酒',
  '杜甫忙盖房',
  '陆游猛搓手',
  '白居易听小曲儿',
  '苏轼今儿赏月',
  '李清照在上课',
  '辛弃疾忙找人',
  '王国维狂摘豆'
];
var tempFilePaths = [];
var someTips = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    upButton: '开始写诗',
    chooseButton: '选择照片',
    canChoose: true,
    poemType: "classic",
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
    return {
      title: '~为你写诗~',
      path: '/pages/imageGame/poem',
      success: res => {
        console.log(res);
      }
    }
  },
  selectImage: function () {
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],//只允许上传压缩图片，否则影响性能
      success: function (res) {
        tempFilePaths = res.tempFilePaths;
        that.setData({
          fileChoosed: true,
          canChoose: false,
          canUpload: true,
          imageUrl: tempFilePaths[0],
        })
      },
      fail: function (res) {
        console.log("取消选图", res);
      },
    })//end choose
  },
  getTips: function (e) {
    someTips = e.detail.value;
  },
  upload: function () {
    console.log("upload start...", this.data)
    if (this.data.fileChoosed == false) {
      this.setData({
        canChoose: true,
        upButton: '开始写诗',
        canUpload: false,
        poems: [],
        imageUrl: null,
      })
      return;
    }
    console.log("已选图片，可以上传")
    var that = this;
    var username = getApp().globalData.userInfo != null ? getApp().globalData.userInfo.nickName : "佚名";
    wx.showLoading({
      title: tips[Math.floor(Math.random() * tips.length)],
    });

    wx.uploadFile({
      url: 'https://loveboyin.cn/GeneratePoem',
      filePath: tempFilePaths[0],
      name: 'file',
      formData: {
        'user': username,
        'tips': someTips,
        'type': that.data.poemType,
      },
      success: function (res) {
        console.log(res);
        var data = JSON.parse(res.data);
        // console.log(data);
        if (data.length > 0) {
          var content = data[0];
          that.setData({
            // imageUrl: content.imageUrl,
            poems: content.OpenPoems,
            upButton: '再写一首',
            fileChoosed: false,
            canChoose: false,
            canUpload: true,
            author: username,
          });
        } else {
          that.setData({
            poems: [{ Optimum: true, PoemContent: "诗人都在忙，请稍后再试~", TimeStamp:""}],
            upButton: '再写一首',
            fileChoosed: false,
            canChoose: false,
            canUpload: true,
            author: "",
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })//end upload
  },
  swapPoem: function (e) {
    var index = e.currentTarget.dataset.index;
    var newPoems = this.data.poems.map(function (poem, i) {
      if (i === index) {
        poem.Optimum = true;
      } else {
        poem.Optimum = false;
      }
      return poem;
    });
    this.setData({
      poems: newPoems,
    })
  },
  switch1Change: function (e) {
    this.setData({
      poemType: e.detail.value ? "classic" : "modern",
    })
  },
  gotoBeauty: function () {
    wx.switchTab({
      url: '/pages/emotion/guessEmotion',
    })
  },
})