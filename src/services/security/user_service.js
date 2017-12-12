
var customActions = {
    currentUser: {method: 'GET', url: 'user/info'}
};
var $resource=Vue.resource('user{/id}',null,customActions);

module.exports={
    $resource:$resource
}