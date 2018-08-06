import consts from "../../libs/consts";
import context from "../../libs/context";

var $resource=null;
var customActions = {
  published: {method: 'GET', url: 'menu/published'},
};

export  default function () {
  if($resource!=null){
    return $resource;
  };
  const baseServiceRoot=context.getConfig(consts.base_service);
  $resource=context.buildResource('menu{/id}',customActions,{root:baseServiceRoot});
  return $resource;
};
