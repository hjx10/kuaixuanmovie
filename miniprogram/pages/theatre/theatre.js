// pages/theatre/theatre.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityname:'未选择',
    theatreList:[]  //用于保存影院列表

  },
  // 点击影院列表项后触发，获取当前选中项下标，打开一个地图，显示该影院位置
  tapTheatreItem(event){
    // event.target触发该事件的最底层元素
    //event.currentTarget触发该事件的元素
    let i = event.currentTarget.dataset.i
    console.log(i)
    // 获取当前选中的影院对象
    let t=this.data.theatreList[i]
    // 以地图方式，打开这个位置
    wx.openLocation({
      latitude: t.location.lat,
      longitude: t.location.lng,
      name:t.title,
      address:t.address,
      scale:15
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  onShow(){
    // 获取globalData中cityname的值
    let cityname=getApp().globalData.cityname
    this.setData({cityname})
    // 加载所选择城市的影院列表
    let qqmapsdk=getApp().globalData.qqmapsdk
    qqmapsdk.search({
      keyword:'电影院',
      region:cityname,
      success:res=>{
        console.log('查询结果',res)
        // 针对res.data中的数据，做一些预处理：新增属性_dis描述 km
        res.data.forEach(item=>{
          item._dis=(item._distance/1000).toFixed(2)
        })

        // 将res.data存入this.data.theatreList
        this.setData({
          theatreList:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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