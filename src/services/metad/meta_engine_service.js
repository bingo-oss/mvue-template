var baseServer=require("./meta_config").baseServer;

var customActions = {
    //query param:engineDeployId
    validateEngineDeployment: {method: 'GET', url: 'meta_engine/validate_engine_deployment'},//验证服务可用性
    //query param:engineDeployId
    swaggerDocUrl: {method: 'GET', url: 'meta_engine/swagger_doc_url'},//获取已部署运行环境的 swagger 文档访问地址
};
var resource=Vue.resource('meta_engine{/id}',null,customActions,{root:baseServer});

module.exports={
    $resource:resource
};