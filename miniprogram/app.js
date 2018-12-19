//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:'signinlist',
        traceUser: true,
      })
    }
    this.getOpenId()
    
    this.interval = setInterval(function () {
      const time = new Date()
      const day = time.getDate()
      const hour = time.getHours()
      //每月一号积分清零并放入积分历史表
      if (day == 1) {
        wx.cloud.callFunction({
          // 云函数名称
          name: 'resetPoints',
          fail: console.error
        })
      }
      //每日一点重置任务完成状态
      if (hour==1){
        wx.cloud.callFunction({
          // 云函数名称
          name: 'resetTasks',
          fail: console.error
        })
      }
    }, 1000 * 3600)
  },
  getOpenId: function () {
    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        if (res.result.openId) {
          wx.setStorageSync('openId', res.result.openId)
          const db = wx.cloud.database()
          db.collection('points').where({
            _openid: res.result.openId
          }).get({
            success: function (res) {
              if (res.data.length == 0) {
                db.collection('points').add({
                  data: { day: 0, week: 0}
                })
              }
            }
          })
        }
      },
      fail: console.error
    })
  },
  globalData: {}
})