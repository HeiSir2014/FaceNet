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
      if (app.globalData.wx_code == null || app.globalData.wx_code == '')
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
                    try {
                      wx.setStorageSync('code', app.globalData.wx_code)
                    } catch (e) {
                    }
                    wx.startPullDownRefresh();
                    wx.showLoading({ title: '正在加载数据', mask:true})
                    common.getAllMachines(app.globalData.wx_code, function (data, error) {
                      if (data.length == 0) {
                        that.setData({ machines: [],no_machine_style: '' })
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
                        that.setData({ machines: data, no_machine_style: 'none' });
                      }

                      try {
                        wx.setStorageSync('machines', data)
                      } catch (e) {
                      }
                      wx.stopPullDownRefresh();
                      wx.hideLoading();
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
        try {
          var datas = wx.getStorageSync('machines')
          if(datas){
            if (datas.length == 0) {
              that.setData({ machines: [], no_machine_style: '' })
            }
            else{
              that.setData({ machines: datas, no_machine_style: 'none' })
            }
            return;
          }
        } catch (e) {
        }

        wx.startPullDownRefresh();
        wx.showLoading({ title: '正在加载数据', mask: true })
        common.getAllMachines(app.globalData.wx_code, function (data, error) {
          if (data.length == 0) {
            that.setData({ machines:[],no_machine_style: '' })
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
            that.setData({ machines: data, no_machine_style: 'none' });
          }

          try {
            wx.setStorageSync('machines', data)
          } catch (e) {
          }
          wx.stopPullDownRefresh();
          wx.hideLoading();
        })
      }
    });
  },
  openMacDetail:function(e){
    var data = this.data.machines;
    for (var key in data) {
      if (typeof data[key] == 'object') {
        if (data[key].macid == e.currentTarget.id ){
          app.globalData.machine = data[key];
          wx.navigateTo({
            url: 'detail?id=' + e.currentTarget.id,
          })
          break;
        }
      }
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
    var that = this;
    wx.showLoading({ title: '正在加载数据', mask: true })
    common.getAllMachines(app.globalData.wx_code, function (data, error) {
      if (data.length == 0) {
        that.setData({ machines: [],no_machine_style: '' })
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
        that.setData({ machines: data, no_machine_style: 'none' });
      }

      try {
        wx.setStorageSync('machines', data)
      } catch (e) {
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
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
  },
  rightMachine:function(e){
    wx.showActionSheet({
      itemList: ['查看轨迹','实时追踪','实时模式','省电模式'],
      success:function(tapIndex){
        switch (tapIndex) {
          case 0:
            wx.switchTab({
              url: '/pages/gps/map?id=' + '',
            });
            break;
          case 1:
            wx.switchTab({
              url: '/pages/gps/map?id=' + '',
            });
            break;
          case 2:
            break;
          case 3:
            break;
        }
      }
    })
  }
})