//这几个工具类必须在最前面引用，不得删除和更改
import mvueToolkit from "mvue-toolkit";
window.jQuery = window.$ = require('jquery');
window._ = require('lodash');
window.store = require('store2');
var Vue = require("vue").default;
function appStart(initFunc) {
  require("babel-polyfill");
  mvueToolkit.config.loadServerConfig().then(function () {
    Promise.all([
      import('iview'),import('vue-multiselect'),import('mvue-core')
    ]).then(function ([iview,Multiselect,mvueCorePkg]) {
      require( 'iview/dist/styles/iview.css');
      require("vue-multiselect/dist/vue-multiselect.min.css");
      var VueRouter = require("vue-router").default;
      //加载 iView
      window.iView = iview;
      Vue.use(iView);
      iView.LoadingBar.config({
        color: '#ff9900',
        failedColor: '#f0ad4e'
      });
      //多选组件
      Vue.component("Multiselect",Multiselect.Multiselect);
      //表单验证控件
      var Vee = require("vee-validate");
      Vue.use(mvueToolkit,{
        vee:Vee,
        baseUrlForResource:mvueToolkit.config.getApiBaseUrl()
      });
      //全局组件引入
      var mvueCore=mvueCorePkg.default;
      window.mvueCore=mvueCore;
      Vue.use(mvueCore);
      window.Utils=mvueCore.utils;
      window.Ajax = window.ax = mvueCore.ajax;
      //全局组件引入
      require("libs/index_component_init").default.init(Vue);;
      Vue.use(VueRouter);
      //路由引入
      var routesData=null,appEntry=null;
      var result=initFunc();
      if(result&&result.then){
        result.then(function(res){
          routesData=res.routesData;
          appEntry=res.appEntry;
          doStart()
        });
      }else{
        routesData=result.routesData;
        appEntry=result.appEntry;
        doStart()
      }
      function doStart(){
        var router = new VueRouter({
          routes: routesData
        });
        var session=mvueCore.session;
        router.beforeEach(function(to, from, next) {
          session.doFilter(to,from,next);
        });
        router.afterEach(function (transition) {
          console.log('-----------------Router Start');
          console.log(transition);
          console.log('-----------------Router End');
        });
        window.router = router;
        var App = appEntry;
        new Vue({
          el: '#app',
          router: router,
          template: '<App/>',
          components: {App}
        });
      }
    }).catch(function (err) {
      console.log('Failed to load vue vue-router iview', err);
    });
  });
}

export default{
    appStart:appStart
}
