var baseServer=require("./meta_config").baseServer;

var $innerVueInst=new Vue({data:{showLoading:true}});
var resource=$innerVueInst.$resource('meta_field{/id}',null,null,{root:baseServer});

module.exports={
    $resource:resource,
    $innerVueInst:$innerVueInst
};