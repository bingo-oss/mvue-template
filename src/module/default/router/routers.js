import utils from "libs/router_utils";

var routersData = utils.getModuleRoutes("default", function (component) {
  return require('src/module/default/view/' + component);
});
var propsResolve = function (router) {
  if (!_.isEmpty(router.params.menu)) {
    router.meta["menu"] = router.params.menu;
  }
};

routersData[0].children.push({
  meta: {
    requireAuth: true
  },
  name: "defaultEntityList",
  component: require('src/module/default/view/default/list'),
  path: "entities/:entityName/list",
  beforeEnter: function (to, from, next) {
    propsResolve(to);
    next();
  }
});
routersData[0].children.push({
  meta: {
    requireAuth: true
  },
  name: "defaultCreateForm",
  component: require('src/module/default/view/default/form'),
  path: "entities/:entityName/create",
  beforeEnter: function (to, from, next) {
    propsResolve(to);
    next();
  }
});
routersData[0].children.push({
  meta: {
    requireAuth: true
  },
  name: "defaultEditForm",
  component: require('src/module/default/view/default/form'),
  path: "entities/:entityName/edit/:id",
  beforeEnter: function (to, from, next) {
    propsResolve(to);
    next();
  }
});

export default routersData;
