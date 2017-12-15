window.jQuery = window.$ = require('jquery');
function appStart() {
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
    Vue.component("Multiselect",Multiselect.Multiselect);
    //引入新版grid依赖的组件
    Vue.component('meta-render-html',require("components/grid/render_html"));
    Vue.component('meta-operation-btn',require("components/grid/operation_btn"));
    Vue.component('meta-img-title',require("components/grid/img_title"));
    //注册自定义全局指令
    var CustomDirectives = require("libs/extend/custom_directives.js");
    new CustomDirectives(Vue);

    iView.LoadingBar.config({
      color: '#ff9900',
      failedColor: '#f0ad4e'
    });
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
    var routes = require('./router/routers');
    var router = new VueRouter({
      routes: routes
    });
    router.afterEach(function (transition) {
      console.log('-----------------Router Start');
      console.log(transition);
      console.log('-----------------Router End');
    });
    window.router = router;
    var App = require('./app.vue');
    //全局eventBus，用来组件之间事件传递
    var eventBus = new Vue({
      data: {
        events: {

        }
      }
    });
    window.eventBus = eventBus;
    var iview$Modal = {
      info: function (opts) {
        if (opts && opts.noTimeout) {
          eventBus.$Modal.info(opts);
        } else {
          setTimeout(function () {
            eventBus.$Modal.info(opts);
          }, 300);
        }
      },
      success: function (opts) {
        if (opts && opts.noTimeout) {
          eventBus.$Modal.success(opts);
        } else {
          setTimeout(function () {
            eventBus.$Modal.success(opts);
          }, 300);
        }
      },
      warning: function (opts) {
        if (opts && opts.noTimeout) {
          eventBus.$Modal.warning(opts);
        } else {
          setTimeout(function () {
            eventBus.$Modal.warning(opts);
          }, 300);
        }
      },
      error: function (opts) {
        if (opts && opts.noTimeout) {
          eventBus.$Modal.error(opts);
        } else {
          setTimeout(function () {
            eventBus.$Modal.error(opts);
          }, 300);
        }
      },
      confirm: function (opts) {
        eventBus.$Modal.confirm(opts);
      }
    }
    window.iview$Modal = iview$Modal;
    window.iview$Message = eventBus.$Message;
    new Vue({
      el: '#app',
      router: router,
      template: '<App/>',
      components: {App}
    });
  }).catch(function (err) {
    console.log('Failed to load vue vue-router iview', err);
  });
}
//登录校验
var doLogin = require("libs/security/do_login.js");
doLogin(appStart);
