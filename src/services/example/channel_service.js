
var customActions = {
  calc: {method: 'POST', url: 'channel/calc'}
};
var $resource=Vue.resource('channel{/id}',customActions);

export default $resource;
