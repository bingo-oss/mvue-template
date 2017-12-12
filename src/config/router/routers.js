/**
 * 路由基础文件
 */
var data = [
  {
    meta: { module: "default" },
    name: "default",
    route_path: "/",
    component:"home/home.vue",
      children:[
        {
          name:"devGuide",
          component: "guide/home.vue",
          route_path:"guide/index"
        }
      ]
    }
];
exports.data = data;
