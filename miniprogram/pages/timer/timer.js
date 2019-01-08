// pages/timer/timer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress_txt: '计时中...',
    isProgress: 1,
    passTime: 0, //超出时间
    passPoint: 0, //超出积分
    count: 0, // 设置 计数器 初始为0
    countTimer: null // 设置 定时器 初始为null
  },

  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(4); // 设置圆环的宽度
    ctx.setStrokeStyle('#abef52'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#8ff566");
    gradient.addColorStop("0.25", "#54ed68");
    gradient.addColorStop("0.5", "#2fcc85");
    gradient.addColorStop("0.75", "#69d0d3");
    gradient.addColorStop("1", "#d8bb5a");

    context.setLineWidth(15);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function (minute) {
    const _page = this
    // 设置倒计时 定时器 每10秒执行一次，计数器count+1 
    this.countTimer = setInterval(() => {
      if (_page.data.count <= 600 * minute) {
        /* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        _page.drawCircle(_page.data.count / (600 * minute / 2))
        _page.data.count++;
      } else {
        _page.setData({
          progress_txt: "计时完成"
        });
        clearInterval(_page.countTimer)
        _page.countTimer = setInterval(() => {
          let newPassTime = ++_page.data.passTime
          _page.setData({
            passTime: newPassTime,
            passPoint: newPassTime / _page.data.currentTask.overTime
          })
        }, 60000)
      }
    }, 100)
  },
  switchTimer: function () {
    const _page = this
    if (_page.data.isProgress) {
      clearInterval(_page.countTimer)
      _page.setData({
        isProgress: 0,
        progress_txt: '暂停中...'
      })
    } else {
      _page.countInterval(_page.data.currentTask.duration)
      _page.setData({
        isProgress: 1,
        progress_txt: '计时中...'
      })
    }

  },
  stopTimer: function () {
    const _page = this
    const times = 600 * _page.data.currentTask.duration
    if (_page.data.count <= times) {
      wx.showModal({
        title: '确定要结束任务么？',
        content: '本次任务尚未完成，结束后将离开本页面并且不会保存本次任务进度！',
        success: function (res) {
          if (res.confirm) {
            clearInterval(_page.countTimer)
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '任务已完成，共超出' + _page.data.passTime + '分钟，奖励' + _page.data.passPoint + '积分，点击确定完成打卡！',
        success: function (res) {
          if (res.confirm) {
            clearInterval(_page.countTimer)
            wx.cloud.callFunction({
              // 云函数名称
              name: 'sign',
              // 传给云函数的参数
              data: {
                taskId: _page.data.currentTask._id,
                cycle: _page.data.currentTask.cycle,
                point: parseInt(_page.data.currentTask.point) + parseInt(_page.data.passPoint)
              },
              success: function (res) {
                if (res.result.code) {
                  wx.showToast({
                    title: '打卡成功',
                    icon: 'success',
                    duration: 1000
                  });
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  }, 1500)

                } else {
                  wx.showModal({
                    title: '提示',
                    content: '操作失败,' + res.result.msg,
                    showCancel: false
                  })
                }
              },
              fail: console.error
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const currentTask = JSON.parse(options.currentTask)
    this.drawProgressbg();
    this.countInterval(currentTask.duration)
    this.setData({
      currentTask: currentTask
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