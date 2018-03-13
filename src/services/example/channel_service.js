
var customActions = {

};
var $resource=Vue.resource('channel{/id}',null,customActions);

module.exports={
    $resource:$resource
}
