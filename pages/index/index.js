//index.js
//获取应用实例
var app = getApp();
var face_canvas = null;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    face_img:'',
    face_info:'提示：请先选择相片，会有惊喜！',
    face_info_color:'#aaa'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    face_canvas = wx.createCanvasContext('face-canvas');
  },
  btn_upload:function(){
    var that = this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          face_img: tempFilePaths[0]
        });
        var tmpImg = res.tempFiles[0];
        //face_canvas.drawImage(res.tempFilePaths[0]);
        //face_canvas.draw();

        that.setData({
          face_info: '正在上传检测...',
          face_info_color: '#aaa'
        });
        wx.uploadFile({
          url: 'https://heisir.cn/facenet/action.php', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'face_img',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data;
            //do something
            console.log(data);
            var result = JSON.parse(data);
            if(result != null && typeof result.face_count != 'undefined')
            {
              if (result.face_count > 0){
                that.setData({
                  face_info: '检测到：' + result.face_count+' 个人。',
                  face_info_color: '#09bb07'
                });
              }
              else{
                that.setData({
                  face_info: '您上传的相片中没有人，请不要调戏脸网。',
                  face_info_color:'#e64340'
                });
              }
            }
          },
          fail:function(){
            that.setData({
              face_info: '上传相片错误，请重试。',
              face_info_color: '#e64340'
            });
          }
        });

      },
    });
  }

})
