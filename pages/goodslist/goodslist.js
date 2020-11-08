// pages/goodslist/goodslist.js
let { requestApi } = require("../../utils/request.js")
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeList: true,
    goodsData:[],
    page:1,
  },
  // 改变排列方式
  change() {
    this.setData({
      changeList: !this.data.changeList
    })
  },
  // 请求数据
  async getgoodsData(cid, min, max) {
    let result = await requestApi(app.globalData.Base_URL+'/catalog/goodslist', {
      cat_id: cid,
      warehouse_id: 0,
      area_id: 0,
      min: min,
      max: max,
      size: 10,
      page: this.data.page,
      self: 0,
    }, 'post')
    console.log(result.data.data);
    this.setData({
      goodsData:result.data.data
    })

  },
  // 滚动加载数据
  scrollFn(){
console.log(1);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

this.getgoodsData(options.cat_id)
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