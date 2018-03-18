const app = getApp()
var DATA_SERVER = "http://www.cloud4iot.cn/msg/channels/";


Page({
  data: {
   deviceid:'',
   channelid: '',
   devicekey:'',
    bn: '',
    bt: '',
    bu: '',
    bver: '',
    oxgen: 95,
    pulse: 72,
    presshigh: 90,
    presslow: 60,
    latitude:0.1,
    longitude:0.1,
    speed:0.0,
    accuracy:0.0,
   
  },
  
  upload: function (event) {

    console.log("触发了点击事件，弹出toast")
    var that = this;
    console.log(that.data);
    wx.request({
      url: DATA_SERVER+that.data.channelid+'/messages',
      header: {
        'content-type': 'application/senml+json',
        'Authorization': that.data.devicekey,
      },
      method: "POST",
      data: [{ 
        "bn": that.data.deviceid+":",
        "bt": Date.now()/1000,
        "bu": "A",
        "bver": 5,
        "n": "Pulse",
        "u": "V",
        "v": that.data.pulse,
      },{
          "n": "Oxgen",
          "u": "V",
          "v": that.data.oxgen,
        }, {
          "n": "Presshigh",
          "u": "V",
          "v": that.data.presshigh,
      }, {
        "n": "Presslow",
        "u": "V",
        "v": that.data.presslow,
        }, {
          "n": "longtitude",
          "u": "V",
          "v": that.data.longitude,
      }, {
        "n": "latitude",
        "u": "V",
        "v": that.data.latitude,
      }],
/*
      data: "[{\"bn\":\"01639ab2-f835-11e7-992d-00163e084598:\",\"bt\":1.286091087003e+09, \"bu\":\"A\",\"bver\":5, \"n\":\"puls\",\"u\":\"V\",\"v\":130.1}, {\"n\":\"pressure\",\"t\":-5,\"v\":1.5}, {\"n\":\"oxgen\",\"t\":-4,\"v\":1.89}]",
      */
      success: function (res) {
        console.log(res.statusCode)
        console.log("xxxxxxxx")
        console.log(that.data)
      },
      complete: function (res) {

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })


  },
 
  onLoad: function () {
   
  },

  onShow: function () {

    var that = this
    var userInfo = app.getUserInfoSync();
    if (userInfo.IOTInfo2 == "object") {
    if ((userInfo.IOTInfo2.channelid != null) && (userInfo.IOTInfo2.deviceid != null) && (userInfo.IOTInfo2.devicekey != null)) {
      // 回到登陆之前的页面
   
      that.data.deviceid = userInfo.IOTInfo2.deviceid;
      that.data.channelid = userInfo.IOTInfo2.channelid;
      that.data.devicekey = userInfo.IOTInfo2.devicekey;
      console.log("update onshow", that.data);
      that.setData({
        Update_bn: userInfo.IOTInfo2.hospitalname +'   ' +userInfo.IOTInfo2.patientname,
        Update_oxgen: that.data.oxgen,
        Update_pulse: that.data.pulse,
        Update_presshigh: that.data.presshigh,
        Update_presslow: that.data.presslow,
      });
      var that = this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.data.latitude = res.latitude;
          that.data.longitude = res.longitude;
          that.data.speed = res.speed;
          that.data.accuracy = res.accuracy;
          console.log("onload", res);
          that.setData({
            longitude: that.data.longitude,
            latitude: that.data.latitude,
          });
        },
        fail: function (res) {
          wx.showModal({
            title: '无法获得位置信息',
//            content: '模态弹窗',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }

            }
          })
        }
      });     
    


    }}
  },

 bindUpdate_bn: function (e) {
    this.data.bn = e.detail.value;
  },

 
 bindUpdate_longitude: function (e) {
   this.data.longitude = e.detail.value;
   console.log(e.detail);
  },

 bindUpdate_latitude: function (e) {
   this.data.latitude = e.detail.value;
   console.log(e.detail);
 },

 bindUpdate_oxgen: function (e) {
   this.data.oxgen = parseInt(e.detail.value);

 },
 bindUpdate_pulse: function (e) {
   this.data.pulse = parseInt(e.detail.value);
 },
 bindUpdate_presshigh: function (e) {
   this.data.presshigh = parseInt(e.detail.value);
 },
 bindUpdate_presslow: function (e) {
   this.data.presslow = parseInt(e.detail.value);
 },
})