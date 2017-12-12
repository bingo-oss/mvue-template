var baseServer=require("./meta_config").baseServer;
var customActions = {
    validateDs: {method: 'POST', url: 'meta_project{/id}/validate_ds'},
    readDbSchema: {method: 'POST', url: 'meta_project{/id}/read_db_schema{/dsId}'},
    dbChanges: {method: 'GET', url: 'meta_project{/id}/db_changes'},
};
var resource=Vue.resource('meta_project{/id}',null,customActions,{root:baseServer});

module.exports={
    $resource:resource
};