//获取全局配置
var Config=require("src/config/config.js");
//封装原生ajax，
//TODO 可以考虑替换
var _ajax = function(opt) {
  opt = opt || {};
  opt.method = opt.method.toUpperCase() || 'POST';
  opt.url = opt.url || '';
  opt.async = opt.async || true;
  opt.data = opt.data || null;
  opt.success = opt.success || function () {};
  opt.error = opt.error || function () {};
  var xmlHttp = null;
  if (XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  }
  else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
  }var params = [];
  for (var key in opt.data){
    params.push(key + '=' + opt.data[key]);
  }
  var postData = params.join('&');
  if (opt.method.toUpperCase() === 'POST') {
    xmlHttp.open(opt.method, opt.url, opt.async);
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    xmlHttp.send(postData);
  }
  else if (opt.method.toUpperCase() === 'GET') {
    xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
    xmlHttp.send(null);
  }
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      opt.success(xmlHttp.responseText);
    }
    if (xmlHttp.status == 401) {
      if(sessionStorage["AccessToken"]){
        sessionStorage.removeItem("AccessToken")
      }
      doLoginAndSaveAccessToken();
      opt.error(xmlHttp.responseText);
      return;
    }
  };
};
//解析url参数为map
function resolveParams(url) {
        if(!url) return;
        url = url + '';
        var index = url.indexOf('?');
        if(index > -1) {
            url = url.substring(index + 1, url.length);
        }
        var pairs = url.split('&'), params = {};
        for(var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var indexEq = pair.indexOf('='), key = pair, value = null;
            if(indexEq > 0) {
                key = pair.substring(0, indexEq);
                value = pair.substring(indexEq + 1, pair.length);
            }
            params[key] = value;
        }
        return params;
    }
//已经登录成功，获取accesstoken并设置到sessionStorage的AccessToken键中
var getAccessToken = function (code, token,ticket,callback) {
  var reqUrl = Config.getAuthAccessCodeProxyUrl();
  var response = _ajax({
    url: reqUrl,
    data: {code: code, token: token,ticket:ticket},
    async: false,
    cache: false,
    method:'get',
    contentType: "application/json",
    success:function (data) {
      var token = JSON.parse(data)["token"];
      sessionStorage["AccessToken"] = token;
      window.location.href=sessionStorage["RedirectUri"];
      if(callback){
        callback();
      }
    },error:function (a) {
      console.log(a);
    }
  });
};
//如果401或者未登录调到登录页登录，否则获取accesstoken，
function doLoginAndSaveAccessToken(callback) {
  var params=resolveParams(window.location.href)||{};
  var authCode = params["code"];
  var authToken = params["id_token"];
  var ticket=params["openid.ex.service_ticket"];

  if(!authCode &&  !authToken && !ticket){
    sessionStorage["RedirectUri"] = window.location.href+"";
    var loginUrl=Config.getLoginUrl().replace("{redirect_uri}", encodeURIComponent(window.location.href));
    window.location.href = loginUrl;
  }else{
    getAccessToken(authCode,authToken,ticket,callback);
  }
}
//如果AccessToken已经设置代表已经成功登录过，如果过期由程序内部ajax处理登录跳转
var doLogin = function (callback) {
  var at = sessionStorage["AccessToken"];
  if(at&&callback){
    callback();
  }else{
    doLoginAndSaveAccessToken(callback);
  }
};

module.exports = doLogin;
