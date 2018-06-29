
var customActions = {
    currentUser: {method: 'GET', url: 'user/info'}
};
var $resource=Vue.resource('user{/id}',customActions);

module.exports={
    $resource:$resource
}