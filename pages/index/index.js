//index.js
//获取应用实例
var API_SERVER_USER = "https://www.hitech-iot.com/mgr/tokens";
//var API_SERVER_USER = "http://192.168.100.70:8180/tokens";
//var API_SERVER_USER = "https://122.152.248.83:8180/tokens";

const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function( options ) {
    
    // 页面初始化 options 为页面跳转所带来的参数
    console.log( 'index.js onLoad0000:' + JSON.stringify( options ) );
    console.log("index.js onShow 1", app.globalData);
    var that = this
    //调用应用实例的方法获取全局数据
    console.log("Index Onload", app.globalData.ispassed);
    app.getUserInfo( function( userInfo ) {
      console.log("userInfo:", userInfo);
        
    
      //更新数据
      /*  for pass qualification
      if( !userInfo.IOTInfo ) {
        wx.switchTab({
          url: '../login/login'
        });
        return;
      }
*/
      if (!app.globalData.ispassed){
        console.log("app.globalData.ispassed=fasle")
        var user2 = userInfo.IOTInfo.user;
        var password2 = userInfo.IOTInfo.password;
        wx.request({
          url: API_SERVER_USER,
          method: 'POST',
          data: {
            'email': user2,
            'password': password2
          },
          header: {
            'Content-Type': 'application/senml+json'
          },
          success: function (res) {
            if ((res.statusCode == '200') || (res.statusCode == '201') || (res.statusCode == '202')) {
              var token = res.data.token;
              // 存phone，token
              app.getUserInfo(function (userInfo) {
                //更新数据
                userInfo.IOTInfo = {};
                userInfo.IOTInfo.token = token;
                userInfo.IOTInfo.password = password2;
                userInfo.IOTInfo.user = user2;

                wx.setStorage({
                  key: 'userInfo',
                  data: userInfo,
                  complete: function () {
                    // 回到登陆之前的页面
                    app.globalData.ispassed = true;
                  }
                });

              });
            }else{
              app.globalData.ispassed = false;
              wx.showModal({
                title: '账户信息有误，请重新登录',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  }
                }
              })
            }
            }
        })
      }

      console.log("index.js onShow 2", app.globalData);
      that.setData( {
        userInfo: userInfo
      })
   
    });

  },

  getUserInfo0: function (e) {
    console.log("getUserInfo0",e)
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})