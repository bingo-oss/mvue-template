/**
 * 封装AJAX请求相关操作
 * Created by yulongsheng on 2016/10/28.
 */

var ax = {};
ax.ajax = function (params) {
  var defaultOptions = {
    type: "GET",
    url: "",
    async: true,
    cache: false,
    contentType: "application/json",
    data: {},
    timeout: 60000,
    headers: params.header || {},
    complete: '',
    success: params.success,
    error: params.error
  }
  $.extend(defaultOptions, params || {});
  $.ajax(defaultOptions);
};

ax.callAjax = function (type, url, data, success, error, _options) {
  var options = $.extend({}, _options);
  var beforeSend = function (xhr, options) {
    if (_options && _options.showLoading) {
      loading.showDom();
    }
    if (_options && _options.beforeSend) {
      _options.beforeSend(xhr, options);
    }
  };
  options.beforeSend = beforeSend;
  var complete = function (xhr, status) {
    if (_options && _options.showLoading) {
      loading.hideDom();
    }
    if (_options && _options.complete) {
      _options.complete(xhr, status);
    }
  };
  options.complete = complete;
  var params = {
    type: type,
    url: url,
    data: data,
    success: success,
    error: function (xhr, textStatus, errorThrown) {
      // 遇到401，进行用户重登
      if (xhr.status == 401) {
        var hideError = false;
        if (sessionStorage["AccessToken"] == null || sessionStorage["AccessToken"] == "undefined") {
          hideError = true;
        }
        if (sessionStorage["AccessToken"]) {
          sessionStorage.removeItem("AccessToken")
        }
        ax.doRedirect(hideError);
        return;
      }
      //如果用户自定义了异常处理，用用户自定义的
      if (jQuery.isFunction(error)) {
        error(xhr, textStatus, errorThrown);
        return;
      }
      if (xhr.status == 400) {
        iview$Modal.error({
          title: "系统提示",
          content: "服务器异常:" + errorThrown
        });
      } else {
        var errorMsg = "服务器内部错误！";
        try {
          var jsonExceptionResp = $.parseJSON(xhr.responseText);
          if (jsonExceptionResp.responseJSON && jsonExceptionResp.responseJSON.message) {
            errorMsg = jsonExceptionResp.responseJSON.message;
          } else {
            errorMsg = jsonExceptionResp.message || jsonExceptionResp.error.reason;
          }
        } catch (ex) {

        }
        if (typeof errorMsg == "undefined") {
          errorMsg = "服务器内部错误！";
        }
        iview$Modal.error({
          title: "错误提示",
          content: errorMsg
        });
      }
    }
  };
  // accessToken加到请求头
  var token = sessionStorage["AccessToken"];

  if (token && token != "null") {
    params["header"] = {
      "Authorization": "Bearer " + token,
      "version": "3.6.0"
    }
  }
  $.extend(params, options || {});
  ax.ajax(params);
}

ax.ajaxWithOutToken = function (type, url, data, success, error, options) {
  ax.ajax($.extend({
    type: type,
    url: url,
    data: data,
    success: success,
    error: error
  }, options));
}

ax.post = function (url, data, success, error, options) {
  ax.callAjax("POST", url, data, success, error, options);
}

ax.get = function (url, data, success, error, options) {
  ax.callAjax("GET", url, data, success, error, options);
}

ax.delete = function (url, data, success, error, options) {
  ax.callAjax("DELETE", url, data, success, error, options);
}

ax.patch = function (url, data, success, error, options) {
  ax.callAjax("PATCH", url, data, success, error, options);
}

//重定向到sso
ax.doRedirect = function (hideError) {
  //获取sso相关的基础信息

  function resolveParams(url) {
    if (!url) return;
    url = url + '';
    var index = url.indexOf('?');
    if (index > -1) {
      url = url.substring(index + 1, url.length);
    }
    var pairs = url.split('&'), params = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      var indexEq = pair.indexOf('='), key = pair, value = null;
      if (indexEq > 0) {
        key = pair.substring(0, indexEq);
        value = pair.substring(indexEq + 1, pair.length);
      }
      params[key] = value;
    }
    return params;
  }

  var reqUrl = Config.contextPath.authUrl;
  var params = resolveParams(window.location.hash) || {};
  var authCode = params.code;
  var authToken = params.id_token;
  var ticket = params["openid.ex.service_ticket"];
  if (!authCode && !authToken && !ticket) {
    ax.get(reqUrl, null, function (data) {
      //记录下鉴权之前的地址
      sessionStorage["RedirectUri"] = window.location.href;
      //重定向到sso
      window.location.href = data["tplLoginUrl"].replace("{redirect_uri}", encodeURIComponent(window.location.href));
    }, function (error) {
      console.log(error);
    });
  }
}

//获取AT接口(必须同步)
ax.getAccessToken = function (code, token) {
  var reqUrl = Config.contextPath.tokenUrl;
  var response = $.ajax({
    url: reqUrl,
    data: {code: code, token: token},
    async: false,
    cache: false,
    contentType: "application/json"
  });
  var status = response.status;
  if (status == 200) {
    return eval("(" + response.responseText + ")")["token"];
  } else if ((status >= 500 && status < 600) || (status >= 300 && status < 400)) {
    iview$Modal.error({
      title: "系统提示",
      content: "获取Token失败！"
    });
  } else {
    console.error(response);
    return null;
  }
}
module.exports = ax
