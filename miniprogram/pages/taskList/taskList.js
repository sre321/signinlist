// pages/taskList/taskList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    tasks: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTasks('day')
  },
  changeTab: function(e) {
    var id = e.currentTarget.id;
    let tabIndex = id == 'day' ? 0 : 1
    this.setData({
      tabIndex: tabIndex
    })
    this.getTasks(id)
  },
  getTasks: function (cycle) {
    let _page = this
    let openId = wx.getStorageSync('openId')
    if (!openId)
      app.getOpenId()
    openId = wx.getStorageSync('openId')
    const db = wx.cloud.database()
    db.collection('tasks').where({
      _openid: openId,
      cycle: cycle
    }).get({
      success: function(res) {
        console.log(res.data)
        if (res.data.length > 0)
          _page.setData({
            tasks: res.data
          })
        else
          _page.setData({
            tasks: []
          })

      }
    })
  },
  newTask: function() {
    wx.navigateTo({
      url: '../newTask/newTask'
    })
  },
  viewDetail: function(e) {
    wx.navigateTo({
      url: '../taskDetail/taskDetail?taskId=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTasks('day')
    this.setData({
      tabIndex: 0
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.getTasks('day')
    this.setData({
      tabIndex: 0
    })
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})