var baseServer=require("./meta_config").baseServer;

var resource=Vue.resource('meta_input_type{/id}',null,null,{root:baseServer});

module.exports={
    $resource:resource
};
