var baseServer=require("./meta_config").baseServer;
var customActions = {
};

var resource=Vue.resource('meta_relation{/id}',null,customActions,{root:baseServer});

module.exports={
    $resource:resource
};
