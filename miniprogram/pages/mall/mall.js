// pages/mall/mall.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodities: [],
    myPoint: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPoint()
    this.getCommodities()
  },
  getPoint: function () {
    let _page = this
    let openId = wx.getStorageSync('openId')
    if (!openId)
      app.getOpenId()
    openId = wx.getStorageSync('openId')
    db.collection('point').where({
      _openid: openId
    }).get({
      success: function (res) {
        if (res.data.length > 0) {
          _page.setData({
            myPoint: res.data[0].point
          })
        }
      }
    })
  },
  getCommodities: function () {
    const _page = this
    let openId = wx.getStorageSync('openId')
    if (!openId)
      app.getOpenId()
    openId = wx.getStorageSync('openId')
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
  exchange: function (e) {
    const _page = this
    const content = e.currentTarget.dataset.item
    if (parseInt(content.point) > parseInt(_page.data.myPoint)) {
      wx.showModal({
        title: '提示',
        content: '您的积分不够，赶快去赚取积分吧！',
        showCancel: false,
      })
      return
    }
    wx.cloud.callFunction({
      // 云函数名称
      name: 'exchangeCommodity',
      // 传给云函数的参数
      data: {
        commodityId: content._id,
        point: 0 - parseInt(content.point)
      },
      success: function (res) {
        if (res.result.code) {
          wx.showToast({
            title: '兑换成功',
            icon: 'success',
            duration: 1000
          });
          let newCommodities = _page.data.commodities
          for (var item in newCommodities) {
            if (newCommodities[item]._id === content._id) {
              newCommodities[item].num--
              _page.setData({
                myPoint: parseInt(_page.data.myPoint) - parseInt(content.point),
                commodities: newCommodities,
              })
            }
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '操作失败！' + res.result.msg,
            showCancel: false
          })
        }
      },
      fail: console.error
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