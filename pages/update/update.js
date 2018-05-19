const app = getApp()
var DATA_SERVER = "https://www.hitech-iot.com/msg/channels/";
//var DATA_SERVER = "https://122.152.248.83:7070/channels/";
//var DATA_SERVER = "http://192.168.100.70:7070/channels/";

Page({
  data: {
   deviceid:'',
   channelid: '',
   devicekey:'',
    bn: '',
    bt: '',
    bu: '',
    bver: '',
    body:10,
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
      }, {
        "n": "Body",
        "u": "V",
        "v": that.data.body,
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
          "n": "Longitude",
          "u": "V",
          "v": that.data.longitude,
      }, {
        "n": "Latitude",
        "u": "V",
        "v": that.data.latitude,
      }],
      success: function (res) {
        console.log(res.statusCode)
        console.log(that.data)
        if (((res.statusCode == '200') || (res.statusCode == '201') || (res.statusCode == '202'))) {
        wx.showModal({
          title: '上报消息已提交',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index'
              })
            }
          }
        })
      }else{
          wx.showModal({
            title: '上报数据失败',
            showCancel: false,
          })
      }},
      fail: function (res) {
        if (res == null || res.data == null) {
          wx.showModal({
            title: '网络故障',
            showCancel: false,
          })
          return;
        }
      }
    })
  },
 
  onLoad: function () {
   
  },

  onShow: function () {

    var that = this
    console.log("update onshow app.globalData.userpassed", app.globalData.userpassed)
    if (!app.globalData.userpassed) {
      // 回到登陆之前的页面
      wx.switchTab({
        url: '../setting/setting'
      })
    }
    var userInfo = app.getUserInfoSync();
    {
        // 回到登陆之前的页面
      var userInfo = app.getUserInfoSync();
        that.data.deviceid = userInfo.IOTInfo2.deviceid;
        that.data.channelid = userInfo.IOTInfo2.channelid;
        that.data.devicekey = userInfo.IOTInfo2.devicekey;
   
        that.setData({
          Update_bn: userInfo.IOTInfo2.hospitalname +'   ' +userInfo.IOTInfo2.patientname,
          Update_body: that.data.body,
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
              showCancel: false,
             })
          }
      });     
     }
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

bindUpdate_body: function (e) {
  this.data.body = parseInt(e.detail.value);
},
})