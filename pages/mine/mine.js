// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
showMask:true,
showLogin:false,
userInfo:{},
  },
// 显示蒙版
showMask(){
  this.setData({

    showMask:false
  })
},
// 获取用户信息
getUserInfoFn(e){
console.log(e.detail.userInfo);
this.setData({
  userInfo:e.detail.userInfo,
})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//查看用户是否授权
wx.getSetting({
  success:(res)=> {
    console.log(res.authSetting["scope.userInfo"])
    if(res.authSetting["scope.userInfo"]){ //条件成立说明用户已经授权
      console.log(123);
      wx.getUserInfo({
        lang:"zh_CN",
        success: (res)=> {
          var userInfo = res.userInfo
          this.setData({
            userInfo:res.userInfo
          })
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
       
          var country = userInfo.country
          console.log(nickName);
          console.log(gender);
          console.log(country);
          console.log(avatarUrl);
          console.log(userInfo);
          
          wx.login({
            timeout: 5000,
            success:(result)=>{
              console.log(result.code);
              //调用登录接口获取用户凭证 code
              // 通过凭证获取用户登录信息
              if(result.code){
                this.setData({
                  showLogin:true
                })
              }
            }
          })
          
          
          
        }
      })
      
    }
  }
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

  }
})