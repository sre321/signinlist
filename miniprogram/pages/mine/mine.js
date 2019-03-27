// pages/mine/mine.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechat: false,
    point: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '../authority/authority',
          })
        }
      }
    })
    this.userPoint()
  },
  userPoint: function () {
    let _page = this
    let openId = wx.getStorageSync('openId')
    if (!openId)
      app.getOpenId()
    openId = wx.getStorageSync('openId')
    db.collection('point').where({
      _openid: openId
    }).get({
      success: function (res) {
        if(res.data.length>0){
          _page.setData({
            point: res.data[0].point
          })
        }
      }
    })
  },
  newTask: function () {
    wx.navigateTo({
      url: '../newTask/newTask'
    })
  },
  bigCircle: function () {
    wx.showModal({
      title: '提示',
      content: '开发中，敬请期待！',
      showCancel: false
    })
  },
  help: function () {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  setting:function(){
    wx.navigateTo({
      url: '../setting/setting'
    })
  },
  mall:function(){
    wx.navigateTo({
      url: '../mall/mall'
    })
  },
  service: function () {
    wx.showModal({
      title: '提示',
      content: '客服离家出走了，客官改天再来吧 \'_\'',
      showCancel: false
    })
    // this.setData({
    //   wechat: !this.data.wechat
    // })
  },
  previewImage: function (e) {
    wx.previewImage({
      urls: ['https://7369-singinlist-1258129797.tcb.qcloud.la/wechat.jpg']
    })
  },
  suggest: function () {
    wx.navigateTo({
      url: '../suggest/suggest'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.userPoint()
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