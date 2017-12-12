
var customActions = {
    navigationPerms: {method: 'GET', url: 'perm/navigation_perms'},
    currentUserPerms: {method: 'GET', url: 'perm/user_perms'}
};
var $resource=Vue.resource('perm{/id}',null,customActions);

module.exports={
    $resource:$resource
}