//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'hi~威扬咨询欢迎你~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //获取一言api开始
    wx.request({
      url: 'https://v1.hitokoto.cn/?encode=json',
      success:res=>{
        this.getSomeWords(res);
      },
    })
    //获取api结束
  },
  getUserInfo:function(e) {
    console.log(e)
    if (!e.detail.userInfo) return;//用户拒绝授权，则无法获取数据，直接返回
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage:e=>{

  },
  getSomeWords:function(res){
    // console.log(this,res)
    this.setData({
      content:res.data.hitokoto,
      author: '-「' + res.data.from +'」',
    })
  },
})
