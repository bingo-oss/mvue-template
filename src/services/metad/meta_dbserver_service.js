var baseServer=require("./meta_config").baseServer;

var customActions = {

};
var resource=Vue.resource('meta_db_server{/id}',null,customActions,{root:baseServer});

module.exports={
    $resource:resource
};
