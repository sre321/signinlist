// pages/suggest/suggest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit: function (e) {
    let formData = e.detail.value
    let msg = ''
    if (formData.name == '' ? msg = '标题不能为空' : msg != '') {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false
      })
      return
    }
    formData.createTime = new Date()
    const db = wx.cloud.database()
    db.collection('suggest').add({
      data: formData,
      success: function (res) {
        if (res._id) {
          wx.showToast({
            title: '提交成功！',
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }, 1500)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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