var utils=require("libs/router_utils");
var routersData = utils.getModuleRoutes("default",function(component){
    return require('src/module/default/view/' + component);
});
routersData.push({
    meta: {
      requireAuth: true
    },
    name: "defaultEntityList",
    component: require('src/module/default/view/default/list'),
    path: "/entities/:entityName/list"
});
routersData.push({
    meta: {
      requireAuth: true
    },
    name: "defaultCreateForm",
    component: require('src/module/default/view/default/form'),
    path: "/entities/:entityName/create"
});
routersData.push({
    meta: {
      requireAuth: true
    },
    name: "defaultEditForm",
    component: require('src/module/default/view/default/form'),
    path: "/entities/:entityName/edit/:id"
});
module.exports = routersData;
