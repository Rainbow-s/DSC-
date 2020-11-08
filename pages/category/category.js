// pages/category/category.js
let { requestApi } = require("../../utils/request.js")
const app=getApp();
console.log(app);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winH: 0,
    listData: [],
    rightData: [],
    adSrc: "",
    leftBac: "#ccc",
    cat_id: 858,
    currentIndex:0,
    adindex: 0,//广告索引
    good_cat_id:0,//货品id
  },
  getUser() {
    var that = this;
    wx.getSystemInfo({
      success: (result) => {
        that.setData({
          winH: result.windowHeight
        })
      },
    })
  },
  // 获取左边数据
  getLeftData() {
    // https://x.dscmall.cn/api/catalog/list
    requestApi(app.globalData.Base_URL+'/catalog/list', {}, 'get').then(res => {
      this.setData({
        listData: res.data.data,
      })
    })
  },

  // 获取右边数据
  getRightData() {
    requestApi(app.globalData.Base_URL+'/catalog/list/' + this.data.cat_id, {}, "get").then(res => {
console.log(res.data.data);

      this.setData({
        rightData: res.data.data,
      })
    })
  },
  // 回到顶部
  goTop(){
    if (wx.pageScrollTo) {//判断这个方法是否可用
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  // 点击left切换
  changePage(e) {
    // console.log(e);
   this.goTop();//回到顶部
    this.setData({
      currentIndex:e.currentTarget.dataset.index
    })
    var index = e.target.dataset.index;
    this.setData({
      cat_id: e.target.dataset.cat_id
    })
    requestApi(app.globalData.Base_URL+'/catalog/list/' + this.data.cat_id, {}, "get").then(res => {

      this.setData({
        rightData: res.data.data,
        adindex: index,

      })
    })


  }
  ,
  // 点击商品跳转
   togoodsInfo(e){
    console.log(e.currentTarget.dataset.cat_id);
    this.setData({
      good_cat_id:e.currentTarget.dataset.cat_id,
    })
   
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser();
    this.getLeftData();

    this.getRightData();

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