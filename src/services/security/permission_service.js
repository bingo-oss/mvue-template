var mvueCore=require('mvue-core').default;
var customActions = {
    navigationPerms: {method: 'GET', url: 'perm/navigation_perms'},
    currentUserPerms: {method: 'GET', url: 'perm/user_perms'}
};
var $resource=mvueCore.resource('perm{/id}',customActions);

module.exports={
    $resource:$resource
}