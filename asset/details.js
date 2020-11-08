const { requestApi } = require("../../utils/requestApi");
const app = getApp();
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navlist: ["商品", "详情", "推荐", "评论"],
    aidTop:[],
    current: 0,
    selectSite: "aid0",
    winH: "",
    goods_id: "1153",
    goodsData: {},
    region: ['广东省', '广州市', '海珠区'],
    listData: [],
    commentData: [],
    goodsNumShow: false,
    goodsNum: 1,
    minusShow: true,
    goodsCartNum: 0,
    addNumShow: "none",
    flag:false,
    cartIndex:0,
    shopIndex:0,
    isShop:false
  },
  async reqGoodsFn(goods_id) {
    let result = await requestApi(app.globalData.URL + "/goods/show", {
      goods_id: goods_id,
      warehouse_id: 0,
      area_id: 0,
      is_delete: 0,
      is_on_sale: 1,
      is_alone_sale: 1,
      parent_id: "",
      animationData: []
    }, "post")
    if (result.statusCode == 200) {
      this.setData({
        goodsData: result.data.data
      })
      WxParse.wxParse('detailsData', 'html', result.data.data.goods_desc, this, 0);
    }

    if(!wx.getStorageSync('cartDatas')){
      wx.setStorageSync('cartDatas',[])
    }
     let cartDatas= wx.getStorageSync('cartDatas')||[]
      cartDatas.forEach((item,index)=>{
        if(item.shop_id==result.data.data.user_id){ 
          this.setData({
            isShop:true,
            shopIndex:index
          })
          item.shop_list.forEach((item,index)=>{
            if(item.goods_id==result.data.data.goods_id){
              this.setData({           
                cartIndex:index,
                goodsCartNum:Number(item.buyNum)
              })
            }
          })
          
        }
      })

    setTimeout(()=>{
      this.aidTopFn()
    },1000)
  },
  async reqListFn() {
    let result = await requestApi(app.globalData.URL + "/goods/goodsguess", {
      page: 1,
      size: 10
    }, "post")
    if (result.statusCode == 200) {
      this.setData({
        listData: result.data.data
      })
    }

  },
  async reqCommentFn(goods_id) {
    let result = await requestApi(app.globalData.URL + "/comment/goods", {
      goods_id: goods_id,
      rank: "all",
      page: 1,
      size: 10
    }, "post")
    console.log(result);
    if (result.statusCode == 200) {
      this.setData({
        commentData: result.data.data
      })
    }
   
  },
  aidTopFn(){
    var aidTop=[]
    for(let i=0;i<4;i++){
      let aid="#aid"+i;
      const query = wx.createSelectorQuery()
      query.select(aid).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec((res)=> {
       aidTop.push(res[0].top)
       this.setData({
        aidTop
      })
      console.log(aidTop);
      })
    }
  },
  ScrollFn(e) {
   
   if(this.data.flag){
     this.setData({
       flag:false
     })
     return;
   }
   let aidTop=this.data.aidTop
   for(let i=aidTop.length-1;i>=0;i--){
    
     if(aidTop[i]-35<e.detail.scrollTop){
       this.setData({
         current:i
       })
       break;
     }
   }
  },
  selectSiteFn(e) {
    this.setData({
      current: e.target.dataset.current,
      selectSite: "aid" + e.target.dataset.current
    })
    this.setData({
      flag:true
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  goodsNumShowFn() {
    var animationObj = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    animationObj.translateY(250).step()
    setTimeout(() => {
      animationObj.translateY(0).step()
      this.setData({
        animationData: animationObj.export()
      })
    }, 100);
    this.setData({
      animationData: animationObj.export(),
      goodsNumShow: true
    })
  },
  goodsNumHeidFn() {
    var animationObj = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    animationObj.translateY(250).step()
    setTimeout(() => {
      this.setData({
        goodsNumShow: false
      })
    }, 300);
    this.setData({
      animationData: animationObj.export(),
    })
  },
  addNum() {
    this.setData({
      minusShow: false,
      goodsNum: ++this.data.goodsNumShow
    })
  },
  minusNum() {
    let goodsNum = --this.data.goodsNum
    if (goodsNum <= 1) {
      this.setData({
        goodsNum,
        minusShow: true
      })
    } else {
      this.setData({
        goodsNum
      })
    }
  },
  addCartFn() {
    let cartDatas=wx.getStorageSync('cartDatas')
    if(this.data.goodsCartNum>0){
      cartDatas[this.data.shopIndex].shop_list[this.data.cartIndex].buyNum=this.data.goodsCartNum + this.data.goodsNum
    }else{
      if(this.data.isShop){
        cartDatas[this.data.shopIndex].shop_list.unshift(this.data.goodsData);
        cartDatas[this.data.shopIndex].shop_list[0].buyNum=this.data.goodsNum
      }else{
        cartDatas.unshift({
          shop_id:this.data.goodsData.user_id,
          shop_list:[],
          shop_name:this.data.goodsData.basic_info.shop_name
        })
        cartDatas[0].shop_list.unshift(this.data.goodsData);
        cartDatas[0].shop_list[0].buyNum=this.data.goodsNum
      }
     
    }

    wx.setStorageSync('cartDatas',cartDatas)

    this.setData({
      addNumShow: " addNum 0.8s",
      goodsCartNum: this.data.goodsCartNum + this.data.goodsNum
    })
   
    wx.showToast({
      title: "已加入购物车"
    })
    setTimeout(() => {
      this.setData({
        addNumShow: "none"
      })
    }, 800)
  },
  addCartBFn() {
    this.addCartFn()
    this.goodsNumHeidFn()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      goods_id: options.goods_id
    })
    this.reqGoodsFn(options.goods_id)
    this.reqCommentFn(options.goods_id)
    const res = wx.getSystemInfoSync()
    this.setData({
      winH: res.windowHeight
    })
    this.reqListFn()
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