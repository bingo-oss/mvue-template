import indexBase from 'libs/index_base'
import Vue from 'vue';
import mvueCore from 'mvue-core';


//每一个模块的入口，必须在init时初始化路由和应用入口组件
indexBase.appStart(function (ctx) {
  var routesData = require('./router/routers').default;
  var appEntry = require('./app.vue');
  window.Utils=ctx.getMvueToolkit().utils;
  Vue.use(mvueCore,{mvueToolkit:ctx.getMvueToolkit()});

  var result=mvueCore.metaBase.initMetabase(null,true);
  if(result&&result.then){
    return result.then(function(){
      return {
        routesData: routesData,
        appEntry: appEntry
      }
    });
  }else{
    return {
      routesData: routesData,
      appEntry: appEntry
    }
  }
},function (ctx) {
    mvueCore.context.setRouter(ctx.getRouter());
  }
);
