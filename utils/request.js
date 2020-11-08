

// 封装一个请求数据的方法
function requestApi(url,data={},method="get"){
  return new Promise((resolve,reject)=>{
    wx.showLoading({
      title: '加载中...',
      mask:true,
    });
    wx.request({
      url:url,
      data:data,
      method:method,
      header:{
        "content-type":"application/json"
      },
      complete:function(){
wx.hideLoading({
  fail(){}
})
      },
      success:function(res){
        if (res.statusCode==200){
          resolve(res)
        }
      },
      fail:function(err){
        reject(err)
      }
    })
  })

}
// 暴露
module.exports={
  requestApi
}