
var customActions = {
  calc: {method: 'POST', url: 'channel/calc'}
};
var $resource=Vue.resource('channel{/id}',null,customActions);

export default $resource;
