// pages/home/home.js
let {requestApi} =require('../../utils/request.js')
// console.log(requestApi);
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winH:0,
    navData:[{
      id:1,
      title:"首页",
    },{
      id:2,
      title:"家用电器",
    },{
      id:3,
      title:"男装女装",
    },{
      id:4,
      title:"鞋靴箱包",
    },{
      id:5,
      title:"手机数码",
    },{
      id:6,
      title:"电脑办公",
    },{
      id:7,
      title:"家具家纺",
    },{
      id:8,
      title:"个人化妆",
    }],
    currentIndex:0,
    scrollLeft:0,
    Bacs:["#CD201A","#FE5E3E","#336CDF","#00AB9B","#1162F1"],
 
    BacIndex:0,
    newsData:['1','2','3','4','5'],//滚动广告数据
  },
getUserInfo(){
  var that=this;
  wx.getSystemInfo({
  
    success: (result) => {
      // console.log(result);
      that.setData({
        winH:result.windowHeight
      })
    },
  })
},
// 点击nav切换内容
changePage(e){
// console.log(e);
// if(e.target.dataset.current>=2&&e.target.dataset.current<=5){
  this.setData({
    scrollLeft:(e.target.dataset.current-2)*64
  })
// }
this.setData({
  currentIndex:e.target.dataset.current
})
},
// 滑动swiper-item切换nav
changeNav(e){
  // console.log(e);

  this.setData({
    currentIndex:e.detail.current,
    scrollLeft:(e.detail.current-2)*64
  })
  
},
// 给头部设置背景颜色
putBac(){
  const app=getApp()

  this.setData({
    BacIndex:app.globalData.headerBg
  })
 
  
},
// 获取滚动广告信息
// getNewsData(){
//   requestApi(app.globalData.Base_URL+"/visual/article",{},'post').then(res=>{
//     this.setData({
//       newsData:res.data.data
//     })
//   })
  
// },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   setInterval(this.putBac,500)
   this.getUserInfo()
 
  //  this.getNewsData()
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