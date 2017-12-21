/**
 * 路由基础文件
 */
var data = [
  {
    meta: {
      module: "default",
      requiresAuth: true
    },
    name: "default",
    path: "/",
    component: "home/home.vue",
    redirect: {
      name: "devGuide"
    },
    children: [
      {
        name: "devGuide",
        component: "guide/home.vue",
        path: "guide/index"
      },
      {
        name: "entityManage",
        component: "metabase/home.vue",
        path: "metabase/index"
      },
      {
        meta: {
          requireAuth: true
        },
        name: "userList",
        component: "example/user_list.vue",
        path: "example/user_list"
      },
      {
        name: "entityForm",
        component: "example/user_form.vue",
        path: "entities/:entityName"
      }
    ]
  },
  {
    meta: {
      module: "default"
    },
    name: "ssoclient",
    component: "common/ssoclient.vue",
    path: "/ssoclient"
  },
];
exports.data = data;
