// pages/taskDetail/taskDetail.js
const db = wx.cloud.database()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _page = this
    db.collection('tasks').doc(options.taskId).get({
      success: function (res) {
        res.data.createTime = util.formatTime(res.data.createTime)
        _page.setData({
          task: res.data
        })
      }
    })
  },
  switchTask: function () {
    let _page = this
    db.collection('tasks').doc(_page.data.task._id).update({
      data: {
        isEnable: !_page.data.task.isEnable
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000
        });
        let task = _page.data.task
        task.isEnable = !_page.data.task.isEnable
        _page.setData({
          task: task
        })
      }
    })
  },
  changeTask: function () {
    wx.navigateTo({
      url: '../newTask/newTask?taskId=' + this.data.task._id
    })
  },
  deleteTask: function () {
    db.collection('tasks').doc(this.data.task._id).remove({
      success: function () {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1500)
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