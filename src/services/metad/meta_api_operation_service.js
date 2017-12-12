var baseServer=require("./meta_config").baseServer;
var customActions = {
    batchEnable: {method: 'POST', url: 'meta_api_operation/batch_enable'}
};
var resource=Vue.resource('meta_api_operation{/id}',null,customActions,{root:baseServer});

module.exports={
    $resource:resource
};