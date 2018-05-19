// pages/setting/setting.js
const app = getApp()
//var DEV_SERVER_USER = "https://122.152.248.83:8080/device/pconfig";
var DEV_SERVER_USER = "https://www.hitech-iot.com/adm/device/pconfig";
//var DEV_SERVER_USER = "http://192.168.100.70:8080/device/pconfig";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hospital_name: '',
    hospital_zone: '',
    bed_id: '',
    patient_name: '',
    hospitaldevice_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('setting.js onLoad:' + JSON.stringify(options));
/*
    var userInfo = app.getUserInfoSync();
    console.log(app.globalData.ispassed);
    if (!app.globalData.ispassed) {
      // 回到登陆之前的页面
      wx.switchTab({
        url: '../login/login'
      })
    }
*/
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
  
    var that = this
    if (!app.globalData.ispassed) {
      // 回到登陆之前的页面
      wx.switchTab({
        url: '../login/login'
      })
    }
      var userInfo = app.getUserInfoSync();
      console.log("setting.js onshow0", userInfo);
 
      // 回到登陆之前的页面
      console.log("setting.js onshow1",userInfo.IOTInfo2);
      that.setData({
        hospital_name: userInfo.IOTInfo2.hospitalname,
        hospital_zone: userInfo.IOTInfo2.hospitalzone,
        bed_id: userInfo.IOTInfo2.hospitalbed,
        patient_name:userInfo.IOTInfo2.patientname,
        hospitaldevice_id: userInfo.IOTInfo2.hospitaldeviceid,
      });

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


  bindHospitalInput: function (e) {
    this.data.hospital_name = e.detail.value;
  },

  bindZoneInput: function (e) {
    this.data.hospital_zone = e.detail.value;
  },
  bindBIDInput: function (e) {
    this.data.bed_id = e.detail.value;
  },

  bindNameInput: function (e) {
    this.data.patient_name = e.detail.value;
  }, 
  bindDIDInput: function (e) {
    this.data.hospitaldevice_id = e.detail.value;
  },

  tapSubmit: function () {
    //账号和密码
    var that = this;
    var userInfo = app.getUserInfoSync();
    console.log('data: ', this.data);
    var hospitalname2 = this.data.hospital_name;
    var hospitalzone2 = this.data.hospital_zone;
    var bedid2 = this.data.bed_id;
    var patientname2 = this.data.patient_name; 
    var hospitaldeviceid2 = this.data.hospitaldevice_id;

//存数据
    userInfo.IOTInfo2 = {};
    userInfo.IOTInfo2.hospitalname = hospitalname2;
    userInfo.IOTInfo2.hospitalzone = hospitalzone2;
    userInfo.IOTInfo2.hospitalbed = bedid2;
    userInfo.IOTInfo2.patientname = patientname2;
    userInfo.IOTInfo2.hospitaldeviceid = hospitaldeviceid2;
    wx.setStorage({
      key: 'userInfo',
      data: userInfo,
     });
  
    wx.request({
      url: DEV_SERVER_USER,
      method: 'POST',
      data: {
        'hospitalname': this.data.hospital_name,
        'hospitalzone': this.data.hospital_zone,
        'hospitalbed': this.data.bed_id,
        'patientname': this.data.patient_name,
        'hospitaldeviceid': this.hospitaldevice_id
      },
      header: {
        'Content-Type': 'application/senml+json'
      },
      complete: function (res) {

        if (((res.statusCode == '200') || (res.statusCode == '201') || (res.statusCode == '202')) && (res.data.succ=='succ')) {
 
          var deviceid = res.data.deviceid;
          var channelid = res.data.channelid
          var devicekey = res.data.devicekey
          app.getUserInfo(function (userInfo) {
            //更新数据
            userInfo.IOTInfo2 = {};
            userInfo.IOTInfo2.hospitalname = hospitalname2;
            userInfo.IOTInfo2.hospitalzone = hospitalzone2;
            userInfo.IOTInfo2.hospitalbed = bedid2;
            userInfo.IOTInfo2.patientname = patientname2;
            userInfo.IOTInfo2.hospitaldeviceid = hospitaldeviceid2;
            userInfo.IOTInfo2.deviceid = deviceid;
            userInfo.IOTInfo2.channelid = channelid;
            userInfo.IOTInfo2.devicekey = devicekey;
               
            app.globalData.userpassed = true;
            wx.setStorage({
              key: 'userInfo',
              data: userInfo,
              complete: function () {
                 wx.showModal({
                   title: '设置成功',
                   showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.switchTab({
                          url: '../index/index'
                        })
                    }}
                })
              }
            });

          });
        } else{
          app.globalData.userpassed = false;
          wx.showModal({
            title: '登录失败，请确认用户数据',
            showCancel: false,
          })
        };
      },
      fail:function(){
        wx.showModal({
          title: '网络故障，登录失败',
          showCancel: false,
        })
      },
    })
  }
})