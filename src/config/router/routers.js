/**
 * 路由基础文件
 */
var data = [
  {
    meta: {
      module: "default" ,
      requireAuth:true
    },
    name: "default",
    route_path: "/",
    component:"home/home.vue",
      children:[
        {
          meta: {
            requireAuth: true
          },
          name:"devGuide",
          component: "guide/home.vue",
          route_path:"guide/index"
        },
        {
          meta: {
            requireAuth: true
          },
          name:"entityManage",
          component: "metabase/home.vue",
          route_path:"metabase/index"
        }
      ]
    },
  {
    meta: {
      module: "default"
    },
    name:"ssoclient",
    component:"common/ssoclient.vue",
    route_path:"/ssoclient"
  },
];
exports.data = data;
