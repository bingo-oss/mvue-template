var baseServer=require("./meta_config").baseServer;
var customActions = {
  validateName: {method: 'GET', url: 'meta_entity/validate_name'},
  fromRestEntity: {method: 'POST', url: 'meta_entity/from_rest_entity'},
};
var $innerVueInst=new Vue({data:{showLoading:true}});
var resource=$innerVueInst.$resource('meta_entity{/id}',null,customActions,{root:baseServer});

module.exports={
    $resource:resource,
    $innerVueInst:$innerVueInst
};
