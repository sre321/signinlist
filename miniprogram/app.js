//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'singinlist',
        traceUser: true,
      })
    }
    this.getOpenId()
  },
  getOpenId: function() {
    wx.cloud.callFunction({
      name: 'login',
      success: function(res) {
        if (res.result.openId) {
          wx.setStorageSync('openId', res.result.openId)
          const db = wx.cloud.database()
          db.collection('points').where({
            _openid: res.result.openId
          }).get({
            success: function(res) {
              if (res.data.length == 0) {
                db.collection('points').add({
                  data: {
                    day: 0,
                    week: 0
                  }
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