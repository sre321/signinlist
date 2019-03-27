// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommodities()
  },
  getCommodities: function () {
    const _page = this
    let openId = wx.getStorageSync('openId')
    if (!openId)
      app.getOpenId()
    openId = wx.getStorageSync('openId')
    const db = wx.cloud.database()
    db.collection('commodity').where({
      _openid: openId,
    }).get({
      success: function (res) {
        if (res.data.length > 0)
          _page.setData({
            commodities: res.data
          })
        else
          _page.setData({
            commodities: []
          })

      }
    })
  },
  editCommodity: function (e) {
    const content = e.currentTarget.dataset
    let url = '../commodity/commodity'
    if (content.id) {
      url = url + '?commodityId=' + content.id
    }
    wx.navigateTo({
      url
    })
  },
  deleteCommodity: function (e) {
    const _page = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: function (res) {
        if (res.confirm) {
          const content = e.currentTarget.dataset.item
          const db = wx.cloud.database()
          db.collection('commodity').doc(content._id).remove({
            success: function () {
              wx.cloud.deleteFile({
                fileList: [content.cover],
              })
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 1000
              });
              _page.getCommodities()
            }
          })
        }
      }
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
    this.getCommodities()
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