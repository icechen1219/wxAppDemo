const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const todayCanAuth = now => {
  var yestoday = getApp().globalData.today;
  console.log(now.getDate() , yestoday&&yestoday.getDate());
  if (yestoday ==null||(now.getTime() - yestoday.getTime()) > 12*60*60*1000) {//超过12小时
  // if (yestoday==null||now.getDate() - yestoday.getDate() > 0) {//超过一个自然日
    return true;
  } else {
    return false;
  }
}

const writeLog = res => {
  if (!res) return;
  var userInfo = getApp().globalData.userInfo;
  wx.request({
    url: 'https://loveboyin.cn/LogLocation',
    data: {
      name: userInfo != null ? userInfo.nickName : "未知用户",
      location: res.formatted_address,
      near: res.sematic_description,
      time: formatTime(new Date())
    },
    method: 'post',
    header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    // dataType:JSON,//该语句会将服务器端的数据自动转为string类型
    success: function (res) {
      // success
      console.log("log location success")
    },

  })
}

const getLocation = callback => {
  if (getApp().globalData.hasLocation) {//已在登录时获取位置信息
    var x = getApp().globalData.latitude;
    var y = getApp().globalData.longitude;
    console.log(x, y);
    loadCity(x, y, callback, true)
  } else { //没在登录时获取位置信息
    loadCity(29.571, 106.557, callback, false);//授权失败则加载重庆的gps坐标
  }

}

const loadCity = (x, y, callback, canLog) => {
  var currentCity = '重庆';
  wx.request({
    //api要求坐标格式为：纬度在前
    url: 'https://api.map.baidu.com/geocoder/v2/?ak=cXElaABOrshpldV9amGWqrewaQUyVdwN&location=' + x + ',' + y + '&output=json&coordtype=wgs84ll',//修正经纬度参数颠倒的bug，并且告诉百度地图经纬度编码为coordtype=wgs84ll（GPS经纬度），否则其默认为百度经纬度！
    data: {},
    header: { 'Content-Type': 'json' },
    success: function (res) {
      // console.log(res);
      canLog && writeLog(res.data.result);//log some data
      currentCity = res.data.result.addressComponent.city;
      if (!currentCity)
        currentCity = '重庆';
      callback && callback(currentCity);
    },
    fail: function (res) {
      console.log("获取定位失败");
    },
  })
}

const getLocation2 = (callback) => {

  wx.authorize({
    scope: 'scope.userLocation',
    success: function (res) {
      console.log("auth success", res);
      getLocation(callback);
    },
    fail: function (res) {
      console.log("auth fail", res);
      var now = new Date();
      if (todayCanAuth(now)) {//超过24小时才可以发起新的授权申请
        wx.openSetting({//打开授权设置
          success: function (res) {//如果打开设置成功则重新发起定位
            wx.getLocation({
              success: res => {//获得授权了则定位成功
                getApp().globalData.hasLocation = true;
                getApp().globalData.longitude = res.longitude;
                getApp().globalData.latitude = res.latitude;
              },
              //未获授权则定位失败
              fail: res => { console.log('授权再次被拒绝'); getApp().globalData.hasLocation = false },
              complete:res=>{
                getLocation(callback);
              }
            });
          },
          fail: function (res) {//打开失败则采取默认坐标进行定位
            console.log('打开授权申请失败...');
            getLocation(callback);
          },
        });
        getApp().globalData.today = now;//同步上次申请授权的时间
        wx.setStorageSync('today', now);//将授权申请时间写进本地存储
      } else {
        getLocation(callback);
      }
    },

  })
}


module.exports = {
  formatTime: formatTime,
  writeLog: writeLog,
  getLocation: getLocation2
}
