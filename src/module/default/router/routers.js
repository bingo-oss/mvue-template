var utils=require("libs/router_utils");
var routersData = utils.getModuleRoutes("default",function(component){
    return require('src/module/default/view/' + component);
});
module.exports = routersData;
