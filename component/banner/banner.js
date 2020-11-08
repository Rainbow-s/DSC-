// component/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
changeBg(e){
// console.log(e.detail.current);
const app=getApp()
app.globalData.headerBg=e.detail.current



},myevent(){

},
  }
})
