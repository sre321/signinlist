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
    duration: 0,
    overTime: 0,
    showDuration: 0,
    cycleItems: [{
      name: '每天',
      value: 'day',
      checked: 'true'
    },
    {
      name: '每周',
      value: 'week'
    }
    ],
    typeItems: [{
      name: '即时',
      value: 'once',
      checked: 'true'
    },
    {
      name: '时长',
      value: 'time'
    }
    ]
  },
  formSubmit: function (e) {
    const _page=this
    let formData = e.detail.value
    let msg = ''
    if (formData.taskName == '' ? msg = '打卡名称不能为空' : formData.point == '' ? msg = '积分不能为空' : formData.type == 'time' && parseInt(formData.duration) <= 0 ? msg = '类别为时长时，时长必须大于零！' : msg != '') {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false
      })
      return
    }
    if (_page.data.taskId) {
      db.collection('tasks').doc(_page.data.taskId).update({
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
      formData.isComplete = false
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
    const _page = this
    if (options.taskId) {
      db.collection('tasks').doc(options.taskId).get({
        success: function (res) {
          _page.setData({
            task: res.data,
            btnName: '保存修改',
            taskId: options.taskId,
            point: res.data.point,
            duration: res.data.duration ? res.data.duration:0,
            overTime: res.data.overTime ? res.data.overTime:0,
            showDuration:res.data.type=='time'?1:0
          })
        }
      })
      wx.setNavigationBarTitle({
        title: '编辑打卡'
      })
    }
  },
  numUp: function (e) {
    const numId = e.currentTarget.dataset.id
    if (numId == 'point') {
      let point = ++this.data.point
      this.setData({
        point: point
      })
    } else {
      let duration = ++this.data.duration
      this.setData({
        duration: duration
      })
    }
  },
  numDown: function (e) {
    const numId = e.currentTarget.dataset.id
    if (numId == 'point') {
      let point = --this.data.point
      this.setData({
        point: point
      })
    } else {
      if (this.data.duration <= 0) {
        wx.showModal({
          title: '提示',
          content: '时长不能小于零！',
          showCancel: false
        })
        return
      }
      let duration = --this.data.duration
      this.setData({
        duration: duration
      })
    }
  },
  numInput: function (e) {
    let numValue = e.detail.value
    numValue = numValue ? parseInt(numValue) : 0
    const numId = e.currentTarget.dataset.id
    if (numId == 'point') {
      this.setData({
        point: numValue
      })
      return
    }
    if (numId == 'duration') {
      this.setData({
        duration: numValue
      })
      return
    }
    if (numId == 'overTime') {
      this.setData({
        overTime: numValue
      })
      return
    }
  },
  typeChange: function (e) {
    this.setData({
      showDuration: !this.data.showDuration
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