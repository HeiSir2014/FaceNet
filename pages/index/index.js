//index.js
//获取应用实例
var app = getApp();
var face_canvas = null;
Page({
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  data: {
    userid:'',
    face_img: 'banner.png',
    face_img_mode: 'scaleToFill',
    face_info: '提示：请先选择相片，会有惊喜！',
    face_info_color: '#60B5FF',
    face_src_img: null,
    mark_display: 'none',
    face_marks: [],
    face_all_index:0
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })

      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            console.log('code:' + res.code)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });

    });
    face_canvas = wx.createCanvasContext('face-canvas');
  }, 
  bindPickerChange: function (e) {
    this.setData({
      face_all_index: e.detail.value
    })
  },
  face_img_load: function (e) {
    console.log(e);
    console.log(e.detail);
    this.setData({ face_src_img: e.detail });
  },
  btn_mark_hide:function(){
    this.setData({ mark_display:'none'});
  },
  btn_upload: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var tmpImg = res.tempFiles[0];

        //清除上次绘制的face
        if (typeof that.data.lastDrawRect != 'undefined') {
          face_canvas.clearRect(that.data.lastDrawRect.left, that.data.lastDrawRect.top, that.data.lastDrawRect.width, that.data.lastDrawRect.height);
          face_canvas.draw();
        }

        //初始化所有状态
        that.setData({
          face_info: '正在上传检测...',
          face_info_color: '#aaa',
          lastUploadFile: tempFilePaths[0],
          mark_display: 'none',
          face_marks: [],
          face_img_mode: 'aspectFit',
          face_img: tempFilePaths[0],
          face_all_index:0
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
            try{
              var result = JSON.parse(data);
              if (result != null && typeof result.face_count != 'undefined') {
                if (result.face_count > 0) {
                  that.setData({
                    face_info: '检测到：' + result.face_count + ' 个人。',
                    face_info_color: '#09bb07'
                  });

                  if (!wx.createSelectorQuery) {
                    wx.showModal({
                      title: '提示',
                      content: '当前微信版本过低，无法使用绘制功能，请升级到最新微信版本后重试。'
                    })
                    return;
                  }

                  wx.createSelectorQuery().select('.canvas').boundingClientRect(function (rect) {
                    var face_src_img = that.data.face_src_img;
                    var x_offset, y_offset, rate, x_rate, y_rate, src_rate, dst_rate;
                    //计算image 在 img 中的offset.
                    src_rate = face_src_img.height * 1.0 / face_src_img.width;
                    dst_rate = rect.height * 1.0 / rect.width;
                    if (dst_rate > src_rate) {
                      rate = rect.width * 1.0 / face_src_img.width;
                      x_offset = 0;
                      y_offset = (rect.height - face_src_img.height * rate) / 2;
                    }
                    else {
                      rate = rect.height * 1.0 / face_src_img.height;
                      y_offset = 0;
                      x_offset = (rect.width - face_src_img.width * rate) / 2;
                    }

                    // 绘制 face 边框
                    var i = 0;
                    var face_marks = [];
                    var face_line_color = ['#00E080', '#00FFFF', '#FF5080', '#606060', '#9000FF'];
                    var face_rect_color = ['#f38302', '#FF6868', '#5BB3FF', '#40A040', '#F078B4'];
                    for (i = 0; i < result.faces.length; i++) {
                      var face = result.faces[i];
                      var left = face.left * rate + x_offset;
                      var top = face.top * rate + y_offset;
                      var width = (face.right - face.left) * rate;
                      var height = (face.bottom - face.top) * rate;
                      var item_id = 'face_mark_' + i;
                      if (true || face.facename != '') {
                        var item = {
                          id: item_id,
                          right: '10px',
                          top: (40 * face_marks.length + 20) + 'px',
                          name: face.facename,
                          SimilScore:face.SimilScore,
                          label: (i + 1) + '. ' + (face.facename == '' ? '无' : face.facename + "(" + face.SimilScore * 100 + "%)"),
                          facepath: face.facepath,
                          index: '第' + (i + 1) + '个'
                        };
                        face_marks.push(item);
                      }
                      face_canvas.setStrokeStyle(face_rect_color[i % face_rect_color.length]);
                      //face_canvas.setFillStyle('green')
                      face_canvas.setLineWidth(2);
                      //face_canvas.setGlobalAlpha(0.5 )
                      //face_canvas.fillRect(left+1,top-1,width-2,height-2);
                      face_canvas.strokeRect(left, top, width, height);

                      
                      // Draw quadratic curve
                      face_canvas.beginPath()
                      face_canvas.moveTo((left + width / 2), top)
                      face_canvas.bezierCurveTo((left + width / 2), top, ((rect.width * 0.65 - 10) + (left + width / 2)) / 2, (top + (40 * i + 30)) / 2 - 20, (rect.width * 0.65 - 10), (40 * i + 30))
                      face_canvas.setStrokeStyle(face_line_color[i % face_line_color.length])
                      face_canvas.stroke();

                      face_canvas.setLineWidth(1);
                      face_canvas.beginPath()
                      face_canvas.arc((left + width / 2), top, 3, 0, 2 * Math.PI)
                      face_canvas.setStrokeStyle('#0088FF')
                      face_canvas.stroke()
                    }
                    face_canvas.draw();

                    that.setData({
                      lastDrawRect: {
                        left: 0,
                        top: 0,
                        width: rect.width,
                        height: rect.height
                      },
                      face_marks: face_marks,
                      mark_display: '',
                    });
                  }).exec();
                }
                else {
                  that.setData({
                    face_info: '您上传的相片中没有检测到人脸。',
                    face_info_color: '#e64340',
                    mark_input: '',
                    mark_display: 'none'
                  });
                }
              }
            }
            catch(e){
              that.setData({
                face_info: '检测出错，请重试。',
                face_info_color: '#e64340'
              });
            }
            finally{

            }
            
          },
          fail: function (e) {
            console.log(e);
            that.setData({
              face_info: '上传相片错误，请重试。',
              face_info_color: '#e64340'
            });
          }
        });

      },
    });
  },
  btn_mark: function () {
    var that = this;
    that.setData({
      face_info: '正在标记...',
      face_info_color: '#aaa',
    });
    wx.request({
      url: 'https://heisir.cn/facenet/mark_base.php?face_path=' + this.data.face_marks[this.data.face_all_index].facepath + '&facename=' + encodeURI(this.data.face_marks[this.data.face_all_index].name),
      success:function(res){
        console.log('mark result:' + res.data);
        if ("success" == res.data)
        {
          that.data.face_marks[that.data.face_all_index].label = (that.data.face_all_index + 1) + '.' + that.data.face_marks[that.data.face_all_index].name + '(' + that.data.face_marks[that.data.face_all_index].SimilScore * 100 + "%)";
          var face_marks = that.data.face_marks;
          that.setData({
            face_info: '标记完成。',
            face_info_color: '#09bb07',
            face_marks: face_marks
          });
        }
        else{
          that.setData({
            face_info: '标记失败，请输入正确的名字。',
            face_info_color: '#e64340'
          });
        }
      },
      fail: function (res){
        that.setData({
          face_info: '标记失败，服务不可用。',
          face_info_color: '#e64340'
        });
      }
    });
  },
  bindKeyInput: function (e) {
    this.data.face_marks[this.data.face_all_index].name = e.detail.value;
  }
})
