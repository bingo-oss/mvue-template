/**
 * 当前会话
 */
var sessionStore=require("store2").session;
var ssoclient=require("libs/security/ssoclient");

var sessionKey="_session_";
var anonymousSession={
  token:{
    accessToken:null,
    refreshToken:null,
    expiresIn:0,
  },
  user:{
    anonymous:true,
    name:"匿名用户",
    userId:""
  }
};
var session=_.extend({},anonymousSession);

if(sessionStore.has(sessionKey)){
  session=sessionStore.get(sessionKey);
}

function createLoginRouter(returnUrl){
  return {
    path: '/login',
    query: {redirect: returnUrl}
  };
}

function isLoginAction(router){
  if(_.isEqual("/login",router.path)){
    return true;
  }
  return false;
}
function isSSOClientAction(router){
  if(_.isEqual("/ssoclient",router.path)){
    return true;
  }
  return false;
}

function onSSOCallback(callback){
  ssoclient.onSSOCallback(function (tokenInfo) {
    signIn(tokenInfo);
    if(callback){
      callback(tokenInfo);
    }
  });
}

function signIn(tokenInfo){
  session.token=tokenInfo;
  session.user.anonymous=false;
  sessionStore.set(sessionKey,session);
}

function signOut(returnUrl) {
  session=_.extend({},anonymousSession);
  sessionStore.remove(sessionKey);
  if(_.isEmpty(returnUrl)){
    returnUrl=window.location.href;
  }
  ssoclient.ssoLogout(returnUrl);
}

module.exports={
  getToken:function(){
    return session.token.accessToken;
  },
  hasToken:function () {
    if(_.isEmpty(session.token.accessToken)){
      return false;
    }
    return true;
  },
  doSignIn:function (tokenInfo) {
    signIn(tokenInfo);
  },
  doLogout:function (returnUrl) {
    signOut(returnUrl);
  },
  doLogin:function (returnUrl) {
    ssoclient.gotoLogin(returnUrl);
  },
  getCurrentUser:function(){
    return session.user;
  },
  doFilter:function(to,from,next){
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (this.hasToken()) {  // 通过vuex state获取当前的token是否存在
        next();
      }else {
        //中转
        ssoclient.gotoLogin(to.fullPath);
      }
    }else {
      next();
    }
  }
};

