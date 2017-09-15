// pages/gps/index.js
var common = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machines: [],
    no_machine_style:'none'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '所有设备'
    });
    //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      if (app.globalData.wx_code == '')
      {
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.request({
                url: 'https://heisir.cn/amap/gps/wxlogin.php?code=' + res.code,
                dataType:'json',
                success:function(res){
                  if(res.data.code == 0){
                    app.globalData.wx_code = res.data.uid;
                    wx.startPullDownRefresh();
                    common.getAllMachines(app.globalData.wx_code, function (data, error) {
                      if (data.length == 0) {
                        that.setData({ no_machine_style: '' })
                      }
                      else {
                        for(var key in data){
                          if (typeof data[key] == 'object') {
                            data[key].status = common.getStatusImg(data[key]);
                            if (data[key].location == null || data[key].location == ''){
                              data[key].location = '等待设备开机...';
                            }
                          }
                        }
                        that.setData({ machines: data, no_machine_style: 'none' })
                      }
                    })
                  }
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
      else{
        wx.startPullDownRefresh();
        common.getAllMachines(app.globalData.wx_code, function (data, error) {
          if (data.length == 0) {
            that.setData({ no_machine_style: '' })
          }
          else {
            for (var key in data) {
              if (typeof data[key] == 'object') {
                data[key].status = common.getStatusImg(data[key]);
                if (data[key].location == null || data[key].location == '') {
                  data[key].location = '等待设备开机...';
                }
              }
            }
            that.setData({ machines: data, no_machine_style: 'none' })
          }
        })
      }
    });
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
    var that = this;
    common.getAllMachines(app.globalData.wx_code, function (data, error) {
      if (data.length == 0) {
        that.setData({ no_machine_style: '' })
      }
      else {
        for (var key in data) {
          if (typeof data[key] == 'object') {
            data[key].status = common.getStatusImg(data[key]);
            if (data[key].location == null || data[key].location == '') {
              data[key].location = '等待设备开机...';
            }
          }
        }
        that.setData({ machines: data, no_machine_style: 'none' })
      }
      wx.stopPullDownRefresh();
    })
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
  buttonadd:function(){
    wx.navigateTo({
      url: 'add'
    })
  }
})