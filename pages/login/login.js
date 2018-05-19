// login.js

const app = getApp()

var API_SERVER_USER = "https://www.hitech-iot.com/mgr/tokens";
//var API_SERVER_USER = "http://192.168.100.70:8180/tokens";
//var API_SERVER_USER = "https://122.152.248.83:8180/tokens";

Page( {
  data: {
    // text:"这是一个页面"
    captcha_code: '../../image/login/captcha.png',
    'captcha.error': 'none',
    user:'',
 //   password: '',
    login: {
      hidden: true
    },
    dialog: {
      hidden: true
    },
    menu: {
      hidden: false
    }
  },
  onLoad: function( options ) {
    // 页面初始化 options 为页面跳转所带来的参数
    console.log( 'login.js onLoad:' + JSON.stringify( options ) );

    var userInfo = app.getUserInfoSync();
    if (app.globalData.ispassed) {
      // 回到登陆之前的页面
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    var that = this
    var userInfo = app.getUserInfoSync();
  //  if (userInfo.IOTInfo ==  "object")
    {
      if ((userInfo.IOTInfo.user != null) && (userInfo.IOTInfo.password != null) && (userInfo.IOTInfo.token != null)) {
        // 回到登陆之前的页面
        that.setData({
          user: userInfo.IOTInfo.user,
  //        password: userInfo.IOTInfo.password,
        });
    }}
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },


  listenerUserInput: function (e) {
    this.data.user = e.detail.value;

  },

  /**
   * 监听密码输入
   */
  listenerPasswordInput: function (e) {
    this.data.password = e.detail.value;
  },

  /**
   * 监听登录按钮
   */
  listenerLogin: function () {
    //打印收入账号和密码
    console.log('手机号为: ', this.data.user);
    console.log('密码为: ', this.data.password);
    var user2 = this.data.user;
    var password2 = this.data.password;
    wx.request({
      url: API_SERVER_USER,
      method: 'POST',
      data: {
        'email': this.data.user,
        'password': this.data.password
      },
      header: {
        'Content-Type': 'application/senml+json'
      },
      success: function (res) {
        console.log(res);
        if ((res.statusCode == '200') || (res.statusCode == '201') || (res.statusCode == '202')) {
          
          var token = res.data.token;
         // 存phone，token
          app.getUserInfo(function (userInfo) {
            //更新数据

            userInfo.IOTInfo = {};
            userInfo.IOTInfo.token = token;
           
            userInfo.IOTInfo.password = password2 ;
            userInfo.IOTInfo.user = user2;
          
            wx.setStorage({
              key: 'userInfo',
              data: userInfo,
              complete: function () {
                app.globalData.ispassed = true;
                wx.showModal({
                  title: '设置成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../index/index'
                      })
                    }
                  }
                })
                // 回到登陆之前的页面
          
              }
            });

          });
          
        }else{
          // 清空phone，token
          app.getUserInfo(function (userInfo) {
            //更新数据
            userInfo.IOTInfo = {};
            userInfo.IOTInfo.token = '';
            userInfo.IOTInfo.password = '';
            userInfo.IOTInfo.user = user2;
            wx.setStorage({
                key: 'userInfo',
                data: userInfo,
               });
          });
          app.globalData.ispassed = false;
          wx.showModal({
            title: '登录失败，请确认账号密码',
            showCancel: false,
          })
        }
      },
    })
  },

  getUserInfo0: function (e) {
    console.log("getUserInfo0", e)
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.listenerLogin()
  }
 
})