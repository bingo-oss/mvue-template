import indexBase from 'libs/index_base';
import metabase from 'libs/metadata/metabase'
//每一个模块的入口，必须在init时初始化路由和应用入口组件
indexBase.appStart(function () {
  var routesData = require('./router/routers');
  var appEntry = require('./app.vue');
  var result=metabase.initMetabase();
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
});