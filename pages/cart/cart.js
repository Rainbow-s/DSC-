// pages/cart/cart.js
let { requestApi } = require("../../utils/request.js")

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,//加载数据
    city: ['河南省', '郑州市', "高新区"],//picker地址
    goodsGuessData: [],//猜你喜欢的数据
    no_goods: true,//控制购物车空或者有的时候的样式
    isSelect: "",
    goodsInfoData: [],//购物车商品信息
    isSelectAll: false,//全选
    isShopSelect: true,//商店的勾选状态
    totalPrice: 0,//总价
    total: 0,//总商品数

  },
  // 更改地区
  changeCity(e) {
    // console.log(e);
    this.setData({
      city: e.detail.value
    })

  },






  // 猜你喜欢数据
  async getGoodsGuess() {
    var result = await requestApi(app.globalData.Base_URL + '/goods/goodsguess', {
      page: this.data.page,
      size: 10
    }, 'post')
    console.log(result.data.data);
    this.setData({
      goodsGuessData: this.data.goodsGuessData.concat(result.data.data)
    })
  },
  // 页面滚动时
  scrollFn(e) {
    this.setData({
      page: ++this.data.page
    })
    this.getGoodsGuess()

  },
  // 改变单个商品的勾选状态
  changeCheck(e) {
    console.log(e);
    var chidindex = e.currentTarget.dataset.childindex;
    var fatherindex = e.currentTarget.dataset.fatherindex;
    var cartList = this.data.goodsInfoData;
    var isSelect = cartList[fatherindex].goods[chidindex].isSelect;//单个商品的勾选状态
    console.log(isSelect);
    
    // let cartData=wx.getStorageSync('cart');
    cartList[fatherindex].goods[chidindex].isSelect = !isSelect;
    var flag = cartList[fatherindex].goods.every(item => {
      return item.isSelect == true
    })
    console.log(flag);
    // 当商铺有一个商品未勾选，商铺不勾选，商品全勾选 商铺才勾选
    if (flag == false) {
      cartList[fatherindex].isShopSelect = false;
      this.setData({
        isSelectAll: false
      })
    } else {
      cartList[fatherindex].isShopSelect = true;
      this.setData({
        isSelectAll: true
      })
    }


    this.setData({
      goodsInfoData: cartList
    })
    this.totalPrice()

  },
  // 商铺的勾选状态
  shopCheck(e) {
    console.log(e);
    var fatherindex = e.currentTarget.dataset.fatherindex;
    var cartList = this.data.goodsInfoData;

    var isShopSelect = cartList[fatherindex].isShopSelect
    cartList[fatherindex].isShopSelect = !isShopSelect;
    cartList[fatherindex].goods.forEach(item => {
      item.isSelect = cartList[fatherindex].isShopSelect
    })
    var arr = [];
    cartList[fatherindex].goods.forEach(item => {
      if (item.isSelect == false) {
        arr.push(item)
      }
    })
    console.log(arr);

    var flag = cartList.every(item => {
      return item.isShopSelect == true
    })

    if (arr.length == cartList[fatherindex].goods.length) {
      cartList[fatherindex].isShopSelect = false
      if (!flag) {
        this.setData({
          isSelectAll: false
        })
      }

    } else {
      cartList[fatherindex].isShopSelect = true
      if (flag) {
        this.setData({
          isSelectAll: true
        })
      }
    }
    this.setData({
      goodsInfoData: cartList
    })
    this.totalPrice()
  },
  // 全选
  checkAll() {
    this.setData({
      isSelectAll: !this.data.isSelectAll
    })
    var cartList = this.data.goodsInfoData;
    cartList.forEach(item => {
      item.isShopSelect = this.data.isSelectAll
      item.goods.forEach(item1 => {
        item1.isSelect = this.data.isSelectAll
      })
    })
    this.setData({
      goodsInfoData: cartList
    })
    this.totalPrice()
  },
  // 计算总价
  totalPrice() {
    var cartList = this.data.goodsInfoData;
    var total = 0;
    var totalPrice = 0;
    cartList.forEach(item => {
      item.goods.forEach(itemgoods => {
        if (itemgoods.isSelect == true) {
          total = total + itemgoods.buyNum
          totalPrice = totalPrice + itemgoods.shop_price * itemgoods.buyNum
        }
      })
    })
    this.setData({
      total,
      totalPrice
    })
  },
  // 增加减少商品
changeNum(e){
console.log(e);
let id=e.currentTarget.dataset.id;
let childIndex=e.currentTarget.dataset.childindex;
let fatherIndex=e.currentTarget.dataset.fatherindex;
let cartList=this.data.goodsInfoData;
// console.log(cartList[fatherIndex]);

if(id==0){
  if(cartList[fatherIndex]["goods"][childIndex].buyNum<=1){
    cartList[fatherIndex]["goods"][childIndex].buyNum=1
  }else{
    cartList[fatherIndex]["goods"][childIndex].buyNum=cartList[fatherIndex]["goods"][childIndex].buyNum-1;
  }
}
if(id==1){
  cartList[fatherIndex]["goods"][childIndex].buyNum=cartList[fatherIndex]["goods"][childIndex].buyNum+1;
}
this.setData({
  goodsInfoData:cartList
})
this.totalPrice()
wx.setStorageSync('cart', cartList)
},
// 删除商品
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsGuess()//猜你喜欢
  },
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.totalPrice()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartList = wx.getStorageSync('cart') || [];
    if (cartList.length > 0) {
      this.setData({
        no_goods: false,
        goodsInfoData: cartList,
      })
      console.log(cartList);
    }
    var flag;
    cartList.forEach((item, index) => {
      flag = item.goods.every(item => {
        return item.isSelect == true
      })
    })
    // console.log(flag);

    if (flag) {
      this.setData({
        isSelectAll: true,
      })
    } else {
      this.setData({
        isShopSelect: false
      })
    }
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