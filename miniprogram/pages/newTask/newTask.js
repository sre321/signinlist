// pages/newTask/newTask.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnName: '创建',
    taskId: '',
    point: 0,
    typeItems: [{
      name: '每天',
      value: 'day',
      checked: 'true'
    },
    {
      name: '每周',
      value: 'week'
    }
    ]
  },
  formSubmit: function (e) {
    let formData = e.detail.value
    let msg = ''
    if (formData.taskName == '' ? msg = '打卡名称不能为空' : formData.point == '' ? msg = '积分不能为空' : msg != '') {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false
      })
      return
    }
    if (this.data.taskId) {
      db.collection('tasks').doc(this.data.taskId).update({
        data: formData,
        success: function (res) {
          if (res.stats.updated) {
            wx.showToast({
              title: '操作成功！',
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
    } else {
      formData.createTime = new Date()
      formData.okNum = 0
      formData.isComplete=false
      db.collection('tasks').add({
        data: formData,
        success: function (res) {
          if (res._id) {
            wx.showToast({
              title: '操作成功！',
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _page = this
    if (options.taskId) {
      db.collection('tasks').doc(options.taskId).get({
        success: function (res) {
          _page.setData({
            task: res.data,
            btnName: '保存修改',
            taskId: options.taskId,
            point: res.data.point
          })
        }
      })
      wx.setNavigationBarTitle({
        title: '编辑打卡'
      })
    }
  },
  pointUp: function () {
    let point = ++this.data.point
    this.setData({
      point: point
    })
  },
  pointDown: function () {
    let point = --this.data.point
    this.setData({
      point: point
    })
  },
  pointInput: function (e) {
    let point = e.detail.value
    point = point?parseInt(point):0
    this.setData({
      point: point
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