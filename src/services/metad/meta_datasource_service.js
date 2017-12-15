var baseServer=require("./meta_config").baseServer;
var resource=Vue.resource('meta_data_source{/id}',null,null,{root:baseServer});

module.exports={
    $resource:resource
};
