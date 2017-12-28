window.jQuery = window.$ = require('jquery');
function appStart(initFunc) {
  require("babel-polyfill");
  window.Ajax = window.ax = require("libs/ajax.js");
  window.Utils = require("libs/utils.js");
  window.loading = require("libs/load/loading.js");
  Promise.all([
    import('iview'),import('vue-multiselect')
  ]).then(function ([iview,Multiselect]) {
    require( 'iview/dist/styles/iview.css');
    require("vue-multiselect/dist/vue-multiselect.min.css");
    var vue = require("vue");
    var vr = require("vue-router");
    var Vue = vue.default;
    var VueRouter = vr.default;
    window.Vue = Vue;
    //加载 iView
    window.iView = iview;
    Vue.use(iView);
    iView.LoadingBar.config({
      color: '#ff9900',
      failedColor: '#f0ad4e'
    });
    //多选组件
    Vue.component("Multiselect",Multiselect.Multiselect);
    //全局组件引入
    require("libs/global_components");
    //注册自定义全局指令
    var CustomDirectives = require("libs/extend/custom_directives.js");
    new CustomDirectives(Vue);
    //全局组件引入
    require("libs/index_component_init");
    //过滤
    var filters = require('libs/filters.js');
    Object.keys(filters).forEach(function (k) {
      Vue.filter(k, filters[k]);
    });
    //表单验证控件
    var Vee = require("vee-validate");
    var CustomValidator = require("libs/extend/custom_validator.js");
    new CustomValidator(Vue, Vee);
    //利用 XMLHttpRequest 请求资源的快捷方式
    var VueResource = require('vue-resource');
    Vue.use(VueResource);
    var CustomVueResource = require("libs/extend/custom_vue_resource.js");
    new CustomVueResource(Vue, VueResource);
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
      var session=require("libs/security/session");
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
}

export default{
    appStart:appStart
}
