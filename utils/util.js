function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function Base64() {  
   
    // private property  
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
   
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
   
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
   
    // private method for UTF-8 encoding  
    var _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }
        }  
        return utftext;  
    }  
   
    // private method for UTF-8 decoding  
    var _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}

function getAllMachines(wx_code,callback){
  wx.request( 
    {
      url:'https://heisir.cn/amap/gps/action.php',
      method:'POST',
      data: 'action=get_all_machines&code='+wx_code,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType:'json',
      success:function(res){
        if(res.data != null){
          var rJson = res.data;
            if (rJson != null && rJson.code == 0 && callback != null){
              callback(rJson.data);
            }
            else{
              var log = '查询失败';
              if (res != null && typeof res.msg == 'string'){
                log += res.msg;
              }
              callback(null, log);
            }
        }
      },
      fail:function(){
        callback(null, '请求失败');
      }
    }
  )
}

function regMachine(wx_code,name,mac_id,mac_type,callback) {
  wx.request(
    {
      url: 'https://heisir.cn/amap/gps/action.php',
      method: 'POST',
      data: 'action=reg_machine&code=' + wx_code + '&name=' + name + '&mac_id=' + mac_id + '&mac_type=' + mac_type,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.data != null) {
          var rJson = res.data;
          if (rJson != null && rJson.code == 0 && callback != null) {
            callback(rJson.msg);
          }
          else {
            var log = '注册失败';
            if (res != null && typeof res.msg == 'string') {
              log += res.msg;
            }
            callback(null, log);
          }
        }
      },
      fail: function () {
        callback(null, '请求失败');
      }
    }
  )
}

function deleteMachine(wx_code,mac_id,callback) {
  wx.request(
    {
      url: 'https://heisir.cn/amap/gps/action.php',
      method: 'POST',
      data: 'action=del_machine&code=' + wx_code + '&mac_id=' + mac_id,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.data != null) {
          var rJson = res.data;
          if (rJson != null && rJson.code == 0 && callback != null) {
            callback(rJson.msg);
          }
          else {
            var log = '注册失败';
            if (res != null && typeof res.msg == 'string') {
              log += res.msg;
            }
            callback(null, log);
          }
        }
      },
      fail: function () {
        callback(null, '请求失败');
      }
    }
  )
}
function getStatusImg(obj){
  var map = {
    '电动车': '1',
    '儿童': '2',
    '宠物': '3',
    '公交车': '4',
    '家人': '5',
    '老人': '6',
    '其他': '7',
    '汽车': '8'
  };
  return '/images/'+ map[obj.mactype] + '_' + (obj.online == 0 ?'offline':'online') + '.png';
}

module.exports = {
  formatTime: formatTime,
  Base64:Base64,
  getAllMachines: getAllMachines,
  regMachine: regMachine,
  getStatusImg: getStatusImg,
  deleteMachine: deleteMachine
}
