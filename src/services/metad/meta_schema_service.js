var baseServer=require("./meta_config").baseServer;
var customActions = {
    importSchema: {method: 'POST', url: 'meta_schema/import_db_schema'}
};
var resource=Vue.resource('meta_schema/{projectId}',null,customActions,{root:baseServer});

module.exports={
    $resource:resource
};