// pages/commodity/commodity.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnName: '添加',
    commodityId: '',
    imageUrl: '/images/add.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _page = this
    if (options.commodityId) {
      db.collection('commodity').doc(options.commodityId).get({
        success: function (res) {
          _page.setData({
            commodity: res.data,
            commodityId: options.commodityId,
            imageUrl: res.data.cover,
            btnName: '保存修改',
          })
        }
      })
      wx.setNavigationBarTitle({
        title: '修改商品'
      })
    }
  },
  chooseImgTap: function () {
    const _page = this
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: '#f7982a',
      success: res => {
        if (!res.cancel) {
          if (res.tapIndex === 0)
            _page.chooseWxImage('album')
          else if (res.tapIndex === 1)
            _page.chooseWxImage('camera')
        }
      }
    })

  },
  chooseWxImage: function (type) {
    const _page = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [type],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            wx.cloud.deleteFile({
              fileList: [_page.data.imageUrl],
            })
            _page.setData({
              imageUrl: res.fileID,
            })
          },
          fail: e => {
            console.error('图片上传失败：', e)
            wx.showToast({
              icon: 'none',
              title: '图片上传失败!',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  formSubmit: function (e) {
    const _page = this
    let formData = e.detail.value
    let msg = ''
    if (_page.data.imageUrl.indexOf('add.png')>0) {
      wx.showModal({
        title: '提示',
        content: '请上传商品图片！',
        showCancel: false
      })
      return
    }
    if (formData.name == '' ? msg = '商品名称不能为空！' : formData.point == '' ? msg = '积分不能为空！' : formData.num == '' ? msg = '请输入库存数量！' : msg != '') {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false
      })
      return
    }
    formData.cover = _page.data.imageUrl
    formData.num = parseInt(formData.num)
    if (_page.data.commodityId) {
      db.collection('commodity').doc(_page.data.commodityId).update({
        data: formData,
        success: function (res) {
          if (res.stats.updated) {
            wx.showToast({
              title: '操作成功！',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        }
      })
    } else {
      formData.createTime = new Date()
      db.collection('commodity').add({
        data: formData,
        success: function (res) {
          if (res._id) {
            wx.showToast({
              title: '操作成功！',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        }
      })
    }
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