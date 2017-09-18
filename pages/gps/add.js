// pages/gps/add.js
var common = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bIsDisableSubmit:true,
    mac_types: [{
      name: '汽车'
      }, {
      name: '电动车'
      }, {
        name: '公交车'
      }, {
        name: '老人'
      }, {
        name: '家人'
      }, {
        name: '儿童'
      }, {
        name: '宠物'
      }, {
        name: '其他'
      }],
    mac_types_index:1,
    new_name:'电驴',
    new_sn:'0011613000FF'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '新增设备'
    });
    if (this.data.new_name != '' && this.data.new_sn != '') {
      this.setData({ bIsDisableSubmit: false })
    }
  },
  bindPickerChange: function (e) {
    this.setData({
      mac_types_index: e.detail.value
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
    wx.stopPullDownRefresh();
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
  
  },
  scancode: function () {
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res.scanType == 'QR_CODE') {
          that.setData({ new_sn: res.result })
        }
        else {
          that.setData({ error: '请扫描正确的二维码' })
        }
      }
    })
  },
  btnsubmit: function () {
    var that = this
    common.regMachine(app.globalData.wx_code, this.data.new_name, this.data.new_sn, this.data.mac_types[this.data.mac_types_index].name,function(res,error){
        if(res == 'ok'){
          that.setData({ error: '注册成功' })
          wx.navigateBack({
            delta: 1
          })
        }
        else {
          that.setData({ error: '注册失败，请稍后重试。' })
        }
    })
  },
  btnreturn: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  name_input: function (e) {
    this.setData({ new_name: e.detail.value })
    if (this.data.new_name != '' && this.data.new_sn != ''){
      this.setData({ bIsDisableSubmit: false })
    }
  },
  id_input: function (e) {
    this.setData({ new_sn: e.detail.value })
    if (this.data.new_name != '' && this.data.new_sn != '') {
      this.setData({ bIsDisableSubmit: false })
    }
  },
  btnbuyer:function(e){
    
  }
})