// pages/citylist/citylist.js
const map=require('../../libs/map')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map:map,
     letter:'A', //滚动位置对应字母
     locSuccess:false
  },

  /**点击城市名称 */
  tapCity(event){
    let city = event.target.dataset.c
    console.log(city)
    getApp().globalData.cityname=city
    wx.navigateBack()
  },

  // 加载定位城市
  getLocCity(){
    //  引入QQMapWX类，创建对象
    let QQMapWX= require('../../libs/qqmap-wx-jssdk')
    let qqmapsdk=new QQMapWX({
      key:'PIQBZ-O64LO-PAEWB-SJUZS-FVDW6-EHB6Z'
    })
    // 调用qqmapsdk的方法，使用腾讯位置服务
    qqmapsdk.reverseGeocoder({
      success:res=>{
        console.log('解析结果',res)
        let city =res.result.address_component.city
        console.log('解析结果',city)
        // 将城市显示在左上角
        this.setData({cityname:city})
        this.data.locSuccess=true
      },
      fail:(err)=>{
        console.warn('解析失败',err)
        this.setData({cityname:'定位失败点击重试'})

      }
    })
   },
   showAuthDialog(){
    wx.showModal({
      title:'提示',
      content:'并未赋予定位权限，是否重新授权？',
      cancelText:'我再想想',
      confirmText:'重新授权',
      success:res=>{
        // res描述了用户选择的结果
        // res=>{cancel:true,confirm:false}
        if(res.confirm){ //用户选择了：重新授权
          wx.openSetting({
            success:(settingRes)=>{
              console.log(settingRes)
              if(settingRes.authSetting["scope.userLocation"]){
                this.getLocCity()
              }
            }
          })

        }
      }
    })
   },
   /**点击当前城市执行 */
  tapLocCity(){
    // 定位失败时
    if(!this.data.locSuccess){
      console.log('定位失败，请重试')
      // 弹出对话框，通知用户重新赋予权限
      this.showAuthDialog()
    }else{
      // 定位成功时，存
      getApp().globalData.cityname=this.data.cityname
      wx.navigateBack()
    }
  },

  /**点击右侧列表 */
  tapLetter(event){
    let l=event.target.dataset.l
    this.setData({letter:l})
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(map)
    this.getLocCity()
  },

  


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})