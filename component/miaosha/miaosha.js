// component/miaosha/miaosha.js
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
    day:0,
    hour:0,
    minute:0,
    second:0,
    timer:"",
  },

  /**
   * 组件的方法列表
   */
  methods: {
   getTime(){
     setInterval(function(){
       console.log(1);
       
     },1000)
   }
  },
  attached:{
   
  }
})
