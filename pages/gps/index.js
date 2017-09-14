// pages/gps/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machines: [{
      id: '18710886896',
      title: 'heisir_mobile',
      subtitle: '上海市青浦区徐泾镇乐天路208号附近',
      electricity: '85%',
      online: 1,
      status: 'mac_online'
    },
      {
        id: '18710886896',
        title: 'heisir_mobile',
        subtitle: '上海市青浦区徐泾镇乐天路208号附近',
        electricity: '85%',
        online: 1,
        status: 'mac_offline'
      },
      {
        id: '18710886896',
        title: 'heisir_mobile',
        subtitle: '上海市青浦区徐泾镇乐天路208号附近',
        electricity: '85%',
        online: 1,
        status: 'mac_online'
      }
    ],
    new_name: '',
    new_sn: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  scancode:function(){
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        that.setData({ new_sn: res.result})
      }
    })
  }
})