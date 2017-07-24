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
    face_info_color:'#aaa',
    face_src_img:null,
    face_mark_name:'无名',
    mark_display:'none',
    face_mark_left:'-100px',
    face_mark_top:'-100px',
    mark_input:'',
    lastFace:''

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
  face_img_load: function (e) {
    console.log(e);
    console.log(e.detail);
    this.setData({ face_src_img: e.detail });

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

        if (typeof that.data.lastDrawRect != 'undefined') {
          face_canvas.clearRect(that.data.lastDrawRect.left, that.data.lastDrawRect.top, that.data.lastDrawRect.width, that.data.lastDrawRect.height);
          face_canvas.draw();
        }

        that.setData({
          face_info: '正在上传检测...',
          face_info_color: '#aaa',
          face_mark_left: '-100px',
          face_mark_top: '-100px',
          face_mark_name: '无名氏',
          lastUploadFile: tempFilePaths[0],
          mark_input: '',
          mark_display: 'none'
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
                  face_info: '检测到：' + result.face_count + ' 个人。',
                  face_info_color: '#09bb07'
                });

                wx.createSelectorQuery().select('.canvas').boundingClientRect(function (rect) {
                  var face_src_img = that.data.face_src_img;
                    var x_offset,y_offset,rate,x_rate,y_rate,src_rate,dst_rate;

                    src_rate = face_src_img.height * 1.0 / face_src_img.width;
                    dst_rate = rect.height * 1.0 / rect.width;
                    if (dst_rate > src_rate)
                    {
                      rate = rect.width * 1.0 / face_src_img.width ;
                        x_offset = 0;
                        y_offset = (rect.height - face_src_img.height* rate)/2;
                    }
                    else
                    {
                      rate = rect.height * 1.0 / face_src_img.height;
                      y_offset = 0;
                      x_offset = (rect.width - face_src_img.width * rate) / 2;
                    }
                    

                    face_canvas.setStrokeStyle('#f38302');
                    face_canvas.setFillStyle('green')
                    face_canvas.setLineWidth(3);
                    face_canvas.setGlobalAlpha(0.35)
                    var i = 0;
                    for (i = 0; i < result.faces.length; i++) {
                      var face = result.faces[i];

                      that.setData({
                        lastDrawRect:{
                          left: face.left * rate + x_offset,
                          top: face.top * rate + y_offset,
                          width: (face.right - face.left) * rate,
                          height: (face.bottom - face.top) * rate
                        },
                        face_mark_left: face.left * rate + x_offset + ((face.right - face.left) * rate)/2 +'px',
                        face_mark_top: face.top * rate + y_offset + (face.bottom - face.top) * rate+'px',
                        face_mark_name: face.facename == '' ? '无名氏' : face.facename,
                        mark_display: face.facename == '' ? '':'none',
                        lastFace: face.facepath
                      });
                      face.left * rate + x_offset, face.top * rate + y_offset, (face.right - face.left) * rate, (face.bottom - face.top) * rate;
                      face_canvas.fillRect(face.left * rate + x_offset, face.top * rate + y_offset, (face.right - face.left) * rate, (face.bottom - face.top) * rate);
                      face_canvas.strokeRect(face.left * rate + x_offset, face.top * rate + y_offset, (face.right - face.left) * rate, (face.bottom - face.top) * rate);
                    }
                    face_canvas.draw()
                }).exec();
              }
              else{
                that.setData({
                  face_info: '您上传的相片中没有人，请不要调戏脸网。',
                  face_info_color:'#e64340',
                  face_mark_left:'-100px',
                  face_mark_top:'-100px',
                  face_mark_name:'无名氏',
                  mark_input:'',
                  mark_display:'none'
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
  },
  btn_mark:function(){
    wx.uploadFile({
      url: 'https://heisir.cn/facenet/mark.php?face_path=' + this.data.lastFace +'&facename='+this.data.mark_input,
      filePath: this.data.lastUploadFile,
      name: 'face_img',
      success:function(res){

      }
    });
    this.setData({
      mark_input: '',
      mark_display:'none'
    });
  },
  bindKeyInput:function(e){
    this.setData({
      mark_input:e.detail.value
    });
  }
})
