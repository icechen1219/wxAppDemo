// pages/emotion/guessEmotion.js
const translateCN = function (name) {
  if (name == 'anger') {
    return '愤怒';
  }
  if (name == 'contempt') {
    return '鄙夷';
  }
  if (name == 'disgust') {
    return '厌恶';
  }
  if (name == 'fear') {
    return '恐惧';
  }
  if (name == 'happiness') {
    return '开心';
  }
  if (name == 'neutral') {
    return '自然';
  }
  if (name == 'sadness') {
    return '忧伤';
  }
  if (name == 'surprise') {
    return '惊喜';
  }
}

const compare = function (face1, face2) {
  return face1.x - face2.x;//升序排列
}

const guessGender=function(gender){
  if(gender<50){
    return "女";
  }
  if(gender>50){
    return "男";
  }
  return "中"
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // this.createNewImg();
    //创建初始化图片
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
  onShareAppMessage: function (res) {
    console.log(res);

    return {
      title: '测颜值、拼颜龄~',
      path: '/pages/emotion/guessEmotion',
      imageUrl: this.data.shareImageUrl,//目前生成不起，待修复
      success: res => {
        console.log(res);
      }
    }
  },

  upload: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],//只允许上传压缩图片，否则影响性能
      success: function (res) {
        wx.showLoading({
          title: '照片分析中...',
        })
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imageUrl: tempFilePaths[0],
          faceTop: 0,
          faceLeft: 0,
          faceWidth: 0,
          faceHeight: 0,
          infoTop: 0,
          infoLeft: 0,
          infoGender: null,
          infoBeauty: 0, 
        })
        //上传到服务器开始
        wx.uploadFile({
          url: 'https://loveboyin.cn/UploadPhoto',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': getApp().globalData.userInfo != null ? getApp().globalData.userInfo.nickName : "未知用户"
          },
          success: function (res) {
            var data = null;
            try {
              data = JSON.parse(res.data);
            } catch (err) {
              that.setData({
                errMsg: '服务器出错，请稍后重试！',
              })
              return;
            }

            // console.log(data);
            console.log(data[0].imageUrl);
            var youtu = JSON.parse(data[0].faceData);
            // console.log("org: ", youtu);
            if (youtu.face[0]) {//返回了面部数据则读取
              //计算图片缩放比例
              var rate = 250 / 250;//500rpx==250px
              var marginLeft = 0;
              var marginTop = 0;
              if (youtu.image_width > youtu.image_height) {//因为图片的缩放模式选的是长边完全显示，所以需要用最长的边来计算比例
                rate = 250 / youtu.image_width;
                //宽完全显示，则图片上下会出现间隙，计算坐标时需要包含上边距
                marginTop = (250 - youtu.image_height * rate) / 2;
              } else {
                rate = 250 / youtu.image_height;
                //高完全显示，则图片左右会出现间隙，计算坐标时需要包含左边距
                marginLeft = (250 - youtu.image_width * rate) / 2;
              }

              console.log("rate: ", rate);
              var faceArr = youtu.face.sort(compare);
              console.log("after sort: ", faceArr);

              that.setData({
                imageUrl: data[0].imageUrl,
                faceList: faceArr,
                remark: data[0].remark,
                resTop: 150 - (faceArr.length > 5 ? 5 : faceArr.length) * 30 + "rpx",
                rate: rate,
                marginLeft: marginLeft,
                marginTop: marginTop,
                errMsg: null,
              })
            } else {
              that.setData({
                imageUrl: data[0].imageUrl,
                errMsg: '请不要用石头来蒙我~',
                remark: data[0].remark,
              })
            }//end if


          },
          complete: function (res) {
            wx.hideLoading();
          }
        })
        //上传到服务器结束
      },
      fail: function (res) {
        console.log("取消选图", res);
      },
    })
  },
  showFaceDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var face = this.data.faceList[index];
    var rate = this.data.rate;
    this.setData({
      faceTop: face.y * rate + this.data.marginTop + "px",
      faceLeft: face.x * rate + this.data.marginLeft + "px",
      faceWidth: face.width * rate + "px",
      faceHeight: face.height * rate + "px",
      infoTop: face.y * rate + this.data.marginTop + (face.height * rate + 11) + "px",
      infoLeft: face.x * rate + this.data.marginLeft + (face.width * rate - 60) / 2 + "px",
      infoGender: guessGender(face.gender),
      infoBeauty: face.beauty, 
    })
  },
  gotoPoem: function () {
    wx.switchTab({
      url: '/pages/imageGame/poem',
    })
  },
})