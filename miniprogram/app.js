// app.js
let QQMapWX= require('./libs/qqmap-wx-jssdk')
let qqmapsdk=new QQMapWX({
  key:'PIQBZ-O64LO-PAEWB-SJUZS-FVDW6-EHB6Z'
})
App({
 
  /**当微信小程序应用启动时执行 */
  onLaunch(){
    // 清除所有缓存
    wx.clearStorage()
    // 初始化云环境
    wx.cloud.init({
      env:'cloud2204-3g6ab7vf6c95f44b'
    })
  },
  globalData:{
    cityname:'未选择',// 用于保存全局共享的全局名称
    qqmapsdk:qqmapsdk
  }
})
