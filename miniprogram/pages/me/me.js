// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      avatarUrl:'',  //用于绑定用户头像
      nickName:'点击登录'   //用于绑定昵称
    },
    logined:false,  //用于保存用户是否已经登录

  },

  /**点击头像后触发该事件 */
  tapAvatar(){
    if(!this.data.logined){
      return;  //用户没有登陆
    }
    // 弹出窗口，让用户选择图片
    wx.chooseMedia({
      count:1,
      mediaType:['image'],
      success:(res)=>{
        console.log('选择图片结果',res)
        let path=res.tempFiles[0].tempFilePath
        // 更新UI，更新用户头像内容
        let userInfo=this.data.userInfo
        userInfo.avatarUrl=path
        this.setData({userInfo})
        // 将选中的图片上传至云存储
        this.upload(path)
      }
    })
  },

  /**上传文件至云存储空间 */
  upload(path){
    let ext = path.split('.').pop()   //返回后缀名
    let cloudPath = `${Date.now()}-${Math.random()}.${ext}`
    console.log(cloudPath)
    // 上传云存储
    wx.cloud.uploadFile({
      filePath:path,
      cloudPath:cloudPath,
      success:(res)=>{
        console.log('上传图片',res)
        let fileID = res.fileID  //图片链接
        // 更新用户头像路径为fileID
        // 修改users集合中当前用户的avatarUrl字段
        this.updateUserAvatar(fileID)
      }
    })
  },

  // 修改用户的avatarUrl字段为fileID   
  updateUserAvatar(fileID){
    let db =wx.cloud.database()
    db.collection('users').doc(this.data.userInfo._id).update({
      data:{
        avatarUrl:fileID
      }
    }).then(res=>{
        console.log('修改数据库中用户头像路径',res)
      })
  },

  /**点击登录view执行该方法 */
  tapLogin(){
    if(this.data.logined){
      return;
    }
    // 获取微信用户信息
    wx.getUserProfile({
      desc: '获取用户信息，用于维护用户权益',
      success:res=>{
        console.log('获取用户信息',res)
        this.setData({
          userInfo:res.userInfo,
          logined:true
        })

        // 先去users集合中查一下，当前用户是否已存在
        let db = wx.cloud.database()
        db.collection('users').get().then(queryRes=>{
          console.log('查询到users集合的结果',queryRes)
          if(queryRes.data.length==0){
            // 没查到，说明用户没有注册过，则需要用户去注册
            this.regist(res.userInfo)
          }else{
            // 查到了，获取最新的数据更新界面中的用户信息
            let userInfo=queryRes.data[0]
            this.setData({userInfo})
          }
        })


      },
      fail:err=>{
        console.warn('获取信息失败',err)
      }
    })

  },

  

  /**注册业务，将userInfo添加到users集合中 */
  regist(userInfo){
    let db =wx.cloud.database()
    db.collection('users').add({
      data:userInfo
    }).then(res=>{
      console.log('注册用户',res)
    })
  },

  /**当双击按钮时执行该方法 */
  handelDoubleTap(event){
    console.log('双击点赞哦~',event.detail)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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