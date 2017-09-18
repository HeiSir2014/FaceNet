// pages/gps/detail.js
var common = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machine:null,
    makers: [],
    includePoints:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof options.id == 'string' && options.id != null){
      var id = options.id;
      if (typeof app.globalData.machine == 'object' && app.globalData.machine != null){
        var m = app.globalData.machine;
        wx.setNavigationBarTitle({
          title: m.name
        });
        var desc = '';
        if (m.speed == 0 || m.speed == null)
        {
          desc = '串码：' + m.macid + '\r\n名称：' + m.name + '\r\n设备：' + m.mactype + '\r\n状态：静止\r\n' + '位置：' + m.location + '\r\n定位：'+ m.type +'\r\n电量：' + m.elec +'%\r\n时间：'+m.lasttime;
        }
        else{
          desc = '串码：' + m.macid + '\r\n名称：' + m.name + '\r\n设备：' + m.mactype + '\r\n状态：运动\r\n时速：' + m.speed + ' Km/h\r\n' + '位置：' + m.location + '\r\n定位：' + m.type +'\r\n电量：' + m.elec + '%\r\n时间：' + m.lasttime;
        }
        this.setData({
          machine: m, makers: [{
            iconPath: m.status,
            callout:{
              content: desc,
              color:'#000',
              fontSize:12,
              borderRadius:10,
              bgColor:'#ffffff',
              padding:10,
              display:'ALWAYS'
            },
            latitude: m.lat,
            longitude: m.lng,
            width: 30,
            height: 22
          }]});
        var marker = { latitude: m.lat, longitude: m.lng}
        var that = this
        wx.getLocation({
          type: 'gcj02', success: function (res) {
            that.setData({ includePoints: [marker, { latitude: res.latitude, longitude: res.longitude}]});
          }
        });
      }
    }
  },
  del_machine:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此设备吗？',
      success: function (res) {
        if (res.confirm) {
          common.deleteMachine(app.globalData.wx_code,that.data.machine.macid,function(msg,error){
            wx.navigateBack({
              delta: 1,
            })
          });
        }
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
  
  },
  markertap:function(e){
    wx.showActionSheet({
      itemList: ['导航', '远程听音', '实时追踪'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})