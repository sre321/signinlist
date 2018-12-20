//index.js
const app = getApp()
const db = wx.cloud.database()
const com = db.command
Page({
  data: {
    tasks: [],
    currentTask: {},
    index: 0,
    btn: 0, // 打卡按钮状态 0:未按压 1：按压 2：完成
    btnPress: false
  },
  onLoad: function () {
    let _page = this
    this.getTask()
    this.interval = setInterval(function () {
      const time = new Date()
      const hour = time.getHours()
      const minute = time.getMinutes()
      const second = time.getSeconds()
      _page.setData({
        hour: hour,
        minute: minute,
        second: second
      })
    }, 1000)
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  getTask: function () {
    let _page = this
    let openId = wx.getStorageSync('openId')

    if (!openId)
      app.getOpenId()
    openId = wx.getStorageSync('openId')
    db.collection('tasks').where(com.or([{
      _openid: com.eq(openId),
      repeat: com.eq(true),
      isEnable: com.eq(true)
    }, {
      _openid: com.eq(openId),
      repeat: com.eq(false),
      isComplete: com.eq(false),
      isEnable: com.eq(true)
    }])).get({
      success: function (res) {
        console.log(res.data)
        if (res.data.length > 0) {
          _page.setData({
            tasks: res.data,
            currentTask: res.data[0],
            index: 0
          })
        }
        else {
          _page.setData({
            tasks: [],
            currentTask: {},
            index: 0
          })
        }

      }
    })
  },
  viewDetail: function () {
    wx.navigateTo({
      url: '../taskDetail/taskDetail?taskId=' + this.data.currentTask._id
    })
  },
  newTask: function () {
    wx.navigateTo({
      url: '../newTask/newTask'
    })
  },
  changeSwiper: function (e) {
    this.setData({
      currentTask: this.data.tasks[e.detail.current]
    })
  },
  signTask: function () {
    let _page = this
    if (!_page.data.btnPress) {
      wx.showToast({
        title: '请求中',
        icon: 'loading',
        duration: 1000
      })
      _page.setData({
        'btn': 1,
        'btnPress': true
      })
      wx.cloud.callFunction({
        // 云函数名称
        name: 'sign',
        // 传给云函数的参数
        data: {
          taskId: _page.data.currentTask._id,
          cycle: _page.data.currentTask.cycle,
          point: parseInt(_page.data.currentTask.point)
        },
        success: function (res) {
          if (res.result.code) {
            wx.showToast({
              title: '打卡成功',
              icon: 'success',
              duration: 1000
            });
            let newTasks = _page.data.tasks
            let newCurrentTask = {}
            for (var item in newTasks) {
              if (newTasks[item]._id === _page.data.currentTask._id) {
                if (newTasks[item].repeat)
                  newTasks[item].okNum++
                else {
                  newTasks.splice(item, 1)
                  newCurrentTask = newTasks.length > 0 ? newTasks[0] : {}
                }
              }
            }
            _page.setData({
              btn: 0,
              btnPress: false,
              tasks: newTasks,
              currentTask: newCurrentTask
            })

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
    }
  },
  // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {
  //       wx.showLoading({
  //         title: '上传中',
  //       })
  //       const filePath = res.tempFilePaths[0]
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)
  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })
  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },
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
    wx.showNavigationBarLoading()
    this.getTask()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
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