// components/myButton/index.js
Component({
  /**
   * 组件的自定义属性列表
   */
  properties: {
    title:{
      type:String,
      value:'普通按钮'
    },
    color:{
      type:String,
      value:'#f00'
    },
    round:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lastTime:0  //用于存储上一次的时间

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**当单击view时触发，需要在此处判断当前单击操作 */
    /**是否满足了双击的触发条件：350毫秒内连续两次单击 */
    /**判断满足该条件，需要立即通知组件的使用者，doubletap事件被触发 */
    handleTap(){
      let now =new Date().getTime()  //当前时间的毫秒时间戳
      if(now-this.data.lastTime<350){
        // 达到了自定义事件doubletap 的触发条件  需要API通知组件使用者
        this.triggerEvent('doubletap',{a:100,b:200})
        now = 0
      }
      this.data.lastTime=now  //为了下次点击计算时间，需要存储时间戳

    }
  }
})
