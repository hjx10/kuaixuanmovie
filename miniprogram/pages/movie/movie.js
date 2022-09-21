// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{},  //绑定当前电影详情信息
    isOpen:false,
    comments:[]  //绑定所有评论
  },

  /**点击简介修改isOpen变量 */
  tapComment(event){
    let i= event.target.dataset.i
    this.data.comments[i].isOpen = !this.data.comments[i].isOpen
    this.setData({
      comments:this.data.comments
    })

  },

  // 点击剧照图片时触发执行该方法
  tapImage(event){
    let thumb=this.data.movie.thumb
    // 把thumb数组中每一个路径后的@后缀去掉
    let urls=[]
    thumb.forEach(item=>{
      urls.push(item.split('@')[0])
    })

    let i=event.target.dataset.i  //获取选中图片的下标  data-i属性值
    // 点击图片与图片之间的间隙
    if(i==undefined){
      return;
    }
    wx.previewImage({
      urls,
      current:urls[i]
     })
  },

  // 点击简介后触发
  tapIntro(){
    this.setData({isOpen:!this.data.isOpen})
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取传过来的参数 电影id
    let id = options.id
    console.log('您选中的电影id:'+id)
    // 发送http请求，通过id查询电影详情
    wx.request({
      url: 'https://api.tedu.cn/detail.php',
      method:'GET',
      data:{id:id},
      success:(res)=>{
        console.log('电影详情：',res)
        this.setData({movie:res.data})
      }

    })
    // 查询当前这一部电影的评论
    let db = wx.cloud.database()
    db.collection('comments').where({
      movieid:id
    }).skip(2).limit(4).get().then(res=>{
      console.log('查询评论结果',res)
      this.setData({comments:res.data})
    }).catch(err=>{
      console.warn('查询评论失败',err)
    })
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