/**
 * 路由基础文件
 */
var data = [
  {
    meta: {
      module: "default",
      requiresAuth: false
    },
    name: "default",
    path: "/",
    component: "home/home.vue",
    redirect: {
      name: "activityList"
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
        name: "channelList",
        component: "example/channel_list.vue",
        path: "example/channel_list"
      },
      {
        name: "channelForm",
        component: "example/channel_form.vue",
        path: "entities/Channel/create"
      },
      {
        name: "activityList",
        component: "example/activity/index.vue",
        path: "example/activity_list"
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
