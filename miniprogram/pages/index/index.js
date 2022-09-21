const QQMapWX = require('../../libs/qqmap-wx-jssdk')

// index.js
Page({
  /** 存储页面数据 */
  data: {
    cid: '1',      // 用于保存当前选中的类别ID
    movies: [],    // 用于保存当前电影列表
    cityname:'未选择'
  },

  



  /** 封装方法，通过cid与offset加载电影列表
   *  返回Promise<Movie[]>
   */
  loadMovies(cid, offset){
    return new Promise((resolve, reject)=>{
      // 弹出等待框
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      wx.request({
        url: 'https://api.tedu.cn/index.php',
        method: 'GET',
        data: {cid, offset},
        success: (res)=>{
          resolve(res.data)    // 成功返回movies数组 通过.then处理
          // 关闭等待框
          wx.hideLoading()
        },
        fail: (err)=>{
          reject(err)          // 失败返回错误消息  通过.catch处理
        }
      })
    })
  },

  /** 点击顶部导航 */
  tapNav(event){
    // cid就是当前选中项的类别ID
    let cid = event.target.dataset.id
    this.setData({cid})
    // 先查一下，缓存中有没有存过，有直接用，没有再发请求，再存一份
    wx.getStorage({
      key: cid,
      success: (res)=>{
        console.log('查到了缓存：', res)
        // 直接拿来用即可
        this.setData({movies: res.data})
      },
      fail: (err)=>{
        console.warn('没查到缓存', err)
        // 发送https请求，加载当前类别下的首页数据。
        this.loadMovies(cid, 0).then(data=>{
          this.setData({movies: data})
          // 把结果存入缓存
          wx.setStorage({
            key: cid,
            data: data
          })
        })
      }
    })


  },

  /** 生命周期钩子方法 页面加载完毕后执行 */
  onLoad(){
    // 发送https请求，加载热映首页数据
    this.loadMovies(1, 0).then(data=>{
      // data就是请求返回回来的res.data电影列表
      this.setData({movies: data})
    }).catch(err=>{
      console.warn('失败', err)
    }) 

    // 加载当前城市信息
    this.getLocCity()
  },

  /**重写onshow方法 */
  onShow(){
    let cityname=getApp().globalData.cityname
    this.setData({cityname})
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
        // 需要将cityname存入globaldata
        getApp().globalData.cityname=city
      },
      fail:(err)=>{
        console.warn('解析失败',err)
      }
    })
   }, 



  /** 监听触底事件的钩子方法 一旦触底自动调用 */
  onReachBottom(){
    console.log('触底事件产生...')
    // 发送https请求，从当前位置继续向后读20条数据
    let cid = this.data.cid  // 当前类别ID
    let offset = this.data.movies.length // 列表长度
    this.loadMovies(cid, offset).then(data=>{
      this.setData({
        movies: this.data.movies.concat(data)
      })
    })
  
  },

  /** 当下拉刷新被触发时执行 */
  onPullDownRefresh(){
    console.log('下拉刷新被触发...')
    // 发送https请求，加载当前类别的首页数据
    // 更新列表，更新缓存
    this.loadMovies(this.data.cid, 0).then(movies=>{
      this.setData({movies})
      // 更新缓存
      wx.setStorage({
        key: this.data.cid,
        data: movies
      })
      // 取消下拉刷新的动画
      wx.stopPullDownRefresh()
    })
  }

})








