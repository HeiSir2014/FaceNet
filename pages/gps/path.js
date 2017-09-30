// path.js
var common = require("../../utils/util.js")
var nowDate = new Date().toISOString().substr(0,10);
var app = getApp();
var getStringTimeFromMs = function(d){
  if(d < 3600000){
    return '' + parseInt(d / 60000) + '分钟';
  } else if (d < 86400000 ) {
    return '' + parseInt(d / 3600000) + '小时' + parseInt(d % 3600000 / 60000) + '分钟' ;
  } else if (d < 86400000 * 30) {
    return '' + parseInt(d / 86400000) + '天' + parseInt(d % 86400000 / 3600000) + '小时' + parseInt(d % 3600000 / 60000) + '分钟';
  }
  else{
    return '' + parseInt(d / 86400000) + '天' + parseInt(d % 86400000 / 3600000) + '小时' + parseInt(d % 3600000 / 60000) + '分钟';
  }
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: nowDate,
    date_start:'2017-09-01',
    date_end: nowDate,
    no_machine_style:'none',
    machine_index:0,
    allMarkers:[],
    allploylines: [],
    includePoints: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var datas = wx.getStorageSync('machines')
      if (datas) {
        if (datas.length == 0) {
          that.setData({ machines: [], no_machine_style: '' })
        }
        else {
          that.setData({ machines: datas, no_machine_style: 'none' })

          that.RefreshPath();
        }
      }
    } catch (e) {
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
  
  },
  bindDateChange:function(e){
    if (this.data.date != e.detail.value)
    {
      var that = this;
      that.setData({
        date: e.detail.value
      })
      that.RefreshPath();
    }
  },
  bindMachineChange:function(e){
    if (this.data.machine_index != e.detail.value)
    {
      this.setData({
        machine_index: e.detail.value
      })
      that.RefreshPath();
    }
  },
  RefreshPath:function(){
    var that = this;
    if (this.data.machine_index < this.data.machines.length) {
      wx.showLoading({ title: '查询中...', mask: true })
      var m = this.data.machines[this.data.machine_index];
      common.GetGPSByDate(m.macid, this.data.date, function (datas, error) {
        wx.hideLoading();
        if (datas != null) {
          var lastTime = null;
          var allPath = [];
          var allMarkers = [];
          var includePoints = [];
          var lastLat = 0.0;
          var lastLng = 0.0;
          var polyline = null;
          for (var i = 0; i < datas.length; i++) {
            var gps = datas[i];
            if (gps != null) {
              var nowTime = new Date(gps.time).getTime()
              if (lastTime != null && nowTime - lastTime >= 1800000 && polyline != null) {
                allPath.push(polyline);
                polyline = null;
                var desc = '停留' + getStringTimeFromMs(nowTime - lastTime) + '\n' + common.formatTime(new Date(lastTime));
                var maker = {
                  iconPath: '/images/p.png',
                  callout: {
                    content: desc,
                    color: '#000',
                    fontSize: 12,
                    borderRadius: 5,
                    bgColor: '#dddddd',
                    padding: 5,
                    display: 'BYCLICK'
                  },
                  latitude: lastLat,
                  longitude: lastLng,
                  width: 32,
                  height: 32,
                  anchor: { x: 0.5, y: 1 }
                };
                allMarkers.push(maker);
              }
              lastTime = nowTime;
              if (i == 0) {
                var desc = '起始位置\n' + common.formatTime(new Date(lastTime));
                var maker = {
                  iconPath: '/images/StartPos.png',
                  callout: {
                    content: desc,
                    color: '#000',
                    fontSize: 12,
                    borderRadius: 5,
                    bgColor: '#dddddd',
                    padding: 5,
                    display: 'BYCLICK'
                  },
                  latitude: gps.lat,
                  longitude: gps.lng,
                  width: 32,
                  height: 32,
                  anchor: { x: 0.5, y: 1 }
                };
                allMarkers.push(maker);
              } else if (i == datas.length - 1) {
                if(nowDate == that.data.date)
                {
                  var desc = '当前位置\n' + common.formatTime(new Date(lastTime));
                  var maker = {
                    iconPath: '/images/CurPos.gif',
                    callout: {
                      content: desc,
                      color: '#000',
                      fontSize: 12,
                      borderRadius: 5,
                      bgColor: '#dddddd',
                      padding: 5,
                      display: 'BYCLICK'
                    },
                    latitude: gps.lat,
                    longitude: gps.lng,
                    width: 32,
                    height: 32,
                    anchor: { x: 0.5, y: 0.85 }
                  };
                  allMarkers.push(maker);
                }
                else{
                  var desc = '终点\n' + common.formatTime(new Date(lastTime));
                  var maker = {
                    iconPath: '/images/EndPos.png',
                    callout: {
                      content: desc,
                      color: '#000',
                      fontSize: 12,
                      borderRadius: 5,
                      bgColor: '#dddddd',
                      padding: 5,
                      display: 'BYCLICK'
                    },
                    latitude: gps.lat,
                    longitude: gps.lng,
                    width: 32,
                    height: 32,
                    anchor: { x: 0.5, y: 1 }
                  };
                  allMarkers.push(maker);
                }
                
              }
              if (polyline == null) {
                polyline = { points: [], arrowLine: true, color: '#D01313AA', width: 5, dottedLine: false }
              }
              polyline.points.push({ latitude: gps.lat, longitude: gps.lng });
              includePoints.push({ latitude: gps.lat, longitude: gps.lng });
              lastLat = parseFloat(gps.lat);
              lastLng = parseFloat(gps.lng);
            }
          }
          if (polyline != null) {
            allPath.push(polyline);
            polyline = null;
          }
          that.setData({ allploylines: allPath, includePoints: includePoints, allMarkers: allMarkers })
        }
      });
    }
  }
})