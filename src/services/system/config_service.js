import context from "../../libs/context";
import consts from "../../libs/consts";

var $resource=null;
var customActions = {
  published: {method: 'GET', url: 'config/published'},
};

export  default function () {
  if($resource!=null){
    return $resource;
  };
  const baseServiceRoot=context.getConfig(consts.base_service);
  $resource=context.buildResource('config{/id}',customActions,{root:baseServiceRoot});
  return $resource;
};
