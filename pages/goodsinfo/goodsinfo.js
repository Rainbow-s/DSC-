// pages/goodsinfo/goodsinfo.js
let { requestApi } = require("../../utils/request.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winH: 0,

    shopData: {},
    goods_num: 1,//已选商品个数
    goodsInfoData: [],//商品详细信息
    shopId: 0,//商家id
    shopdetail: [],//卖家详细信息
    showMask: false,//显示蒙版
    animationData: "",//动画数据
    cartDatas: [],//准备传给购物车的所有数据

  },
  // 获取用户信息
  getUserInfo() {
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);

        this.setData({
          winH: result.windowHeight - 48
        })
      },
    })
  },

  // 获取货品详细信息
  async getGoodsInfo(gid) {
    let result = await requestApi(app.globalData.Base_URL + '/goods/show', {
      goods_id: gid,
      warehouse_id: 0,
      area_id: 0,
      is_delete: 0,
      is_on_sale: 1,
      is_alone_sale: 1,

    }, 'post')
    console.log(result.data.data);

    console.log(result.data.data.basic_info);
    this.setData({
      goodsInfoData: result.data.data,
      shopId: result.data.data.user_id,
      shopdetail: result.data.data.basic_info,
    })

  },
  // 获取商家详细信息
  async getShopInfo(rid) {
    let result = await requestApi(app.globalData.Base_URL + '/shop/shopdetail', {
      ru_id: rid
    }, "post")
    console.log(result);
    // let cartData=wx.getStorageSync('cart')||[];
    // if(cartData){
    //   console.log(cartData);
    //   cartData.forEach()
    // }

  },
  // 封装动画
  animationFn(start, end, block) {
    // 定义一个实例化动画对象
    let animationObj = wx.createAnimation({
      delay: 0,//延迟动画
      duration: 1000,//持续时间
      timingFunction: "linear",//过渡效果
    })
    animationObj.translateY(start).step()
    setTimeout(() => {
      animationObj.translateY(end).step()
      this.setData({
        animationData: animationObj.export(),//导出动画
        showMask: block,
      })
    }, 200)
    this.setData({
      animationData: animationObj.export(),//导出动画
      showMask: block,
    })

  },
  // 蒙版显示动画
  showMaskFn() {
    this.animationFn(280, 0, true)
  },
  // 关闭蒙版动画
  close() {
    this.animationFn(0, 280, false)
  },
  // 前往购物车
  goCart() {

    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  // 加入购物车
  addGoodNum() {
    console.log(this.data.goodsInfoData);
    // 调用蒙版购物车动画
    this.showMaskFn()
  },
  // 增加或减少商品数量
  changeNum(e) {
    // console.log(e);

    if (e.currentTarget.dataset.num == 0) {
      if (this.data.goods_num <= 1) {
        this.setData({
          goods_num: 1,
        })
      }
      else {
        this.setData({
          goods_num: this.data.goods_num - 1
        })
      }
    } if (e.currentTarget.dataset.num == 1) {
      this.setData({
        goods_num: this.data.goods_num + 1
      })
    }
  },
  // 把商品各项信息添加到本地存储
  addCart() {
    // [{
    // shopId:111,
    // shop_name:"",
    //   goods:[]
    // }]
    let cartData = wx.getStorageSync('cart') || [];
    let goodsData = this.data.goodsInfoData;
    goodsData.isSelect = true;//添加勾选
    goodsData.buyNum = this.data.goods_num;
    var shopId = goodsData.user_id
    var flag = true;
    var flag1 = true;
    // console.log(goodsData);
    var obj = {
      shopId: shopId,
      isShopSelect: true,
      shop_name: goodsData.basic_info.shop_name,
      goods: [],
    }
    obj.goods.push(goodsData)
    console.log(obj);

    // 如果cartData不为空
    if (cartData.length > 0) {
      // 遍历cartData  也就是每个shopId加goods的集合   
      // [{
      // shopId:111,
      // shop_name:"",
      //   goods:[]
      // }]
      for (var key in cartData) {
        if (cartData[key].shopId == goodsData.user_id) {

          if (cartData[key].goods.length > 0) {
            cartData[key].goods.forEach(item => {
              if (item.goods_id == goodsData.goods_id) {
                item.buyNum = item.buyNum + goodsData.buyNum
                flag = false
              }
            })
          }
          if (flag == true) {
            cartData[key].goods.unshift(goodsData)

          }
          flag1 = false
        }
      } if (flag1 == true) {
        cartData.push(obj)
      }
    } else {
      cartData.push(obj)
    }

    wx.setStorageSync('cart', cartData)





















    // goods.isSelect=true;//添加勾选
    // goods.buyNum=this.data.goods_num;
    // var gid=this.data.goodsInfoData.goods_id;
    // var cartDatas=wx.getStorageSync('carts')||[]
    // // console.log(goods);
    // // console.log(cartDatas);

    // if(cartDatas.length>0){
    //   for(var key in cartDatas){
    //     if(cartDatas[key].goods_id==gid){
    //       cartDatas[key].buyNum=cartDatas[key].buyNum+this.data.goods_num;
    //       try{
    //         wx.setStorageSync('carts', cartDatas)
    //         wx.showToast({
    //           title: '成功',
    //           icon: 'success',
    //           duration: 2000
    //         })
    //         this.close()
    //       }catch(err){
    //         console.log(arr);
    //       }
    //       return;
    //     }
    //   }
    //   cartDatas.unshift(goods)

    // }else{
    //   cartDatas.unshift(goods)
    // }

    //  wx.setStorageSync('carts', cartDatas)
    //  wx.showToast({
    //    title: '成功',
    //    icon: 'success',
    //    duration: 2000
    //  })
    // this.close()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    console.log(options);
    this.getGoodsInfo(options.goods_id)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getShopInfo(this.data.shopId.ru_id)
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