// pages/release/release.js
Page({

  /**
  * 页面的初始数据
  */
  data: {
    arrReview: ['1', '2', '3'],
    arrAdress: ['你家', '我家', '如家'],

  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {

  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

  },
  choosetime: function (e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 选择类型
  reviewtype: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  // 选择补课地点
  chooseAddress: function (e) {
    this.setData({
      index2: e.detail.value
    })
  },
  // 选择地址
  selectAddress: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // succss
        console.log(res)
        that.setData({
          addressUser: res.address,
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },


})