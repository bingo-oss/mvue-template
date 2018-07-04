import mvueCore from 'mvue-core';
var customActions = {
  calc: {method: 'POST', url: 'channel/calc'}
};
var $resource=mvueCore.resource('channel{/id}',customActions);

export default $resource;
