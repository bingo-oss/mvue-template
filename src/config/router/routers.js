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
      name: "orgList"
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
        name: "userForm",
        component: "example/user_form.vue",
        path: "entities/user/create"
      },
      {
        name: "orgList",
        component: "example/org/index.vue",
        path: "example/organization_list"
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
