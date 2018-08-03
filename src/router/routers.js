/**
 * 路由基础文件
 */
var routers = [
  {
    meta: {
      module: "default",
      requiresAuth: true
    },
    name: "default",
    path: "/",
    redirect:{
      name:'system.admin.menu'
    },
    component: "home/home.vue",
    children: [
      // 主页
      {
        name: "indexRouter",
        component: "index/index.vue",
        path: "index/index"
      },
      {
        name: "iframe",
        component: "common/iframe.vue",
        path: "iframe/:menuId"
      },
      //begin 配置管理
      {
        name: "system.admin.config",
        path: "system/config",
        redirect: { name: "system.admin.config.list" },
      },
      {
        meta: {
          keepAlive: true,
          menu: 'system.admin.config'
        },
        name: "system.admin.config.list",
        path: "system/config/list",
        component: "system/config"
      },
      {
        meta: {
          menu: 'system.admin.config'
        },
        name: "system.admin.config.create",
        path: "system/config/create",
        component: "system/create-config"
      },
      {
        meta: {
          menu: 'system.admin.config'
        },
        name: "system.admin.config.edit",
        path: "system/config/edit/:id",
        component: "system/edit-config"
      },
      //end 配置管理
      //begin 菜单管理
      {
        name: "system.admin.menu",
        path: "system/menu",
        redirect: { name: "system.admin.menu.list" },
      },
      {
        meta: {
          keepAlive: true,
          menu: 'system.admin.menu'
        },
        name: "system.admin.menu.list",
        path: "system/menu/list",
        component: "system/menu/list"
      },
      {
        meta: {
          menu: 'system.admin.menu'
        },
        name: "system.admin.menu.create",
        path: "system/menu/create",
        component: "system/menu/create"
      },
      {
        meta: {
          menu: 'system.admin.menu'
        },
        name: "system.admin.menu.edit",
        path: "system/menu/edit/:id",
        component: "system/menu/edit"
      }
      //end 菜单管理
    ]
  },
  {
    meta: {
      module: "default"
    },
    name: "ssoclient",
    component: "common/ssoclient.vue",
    path: "/ssoclient"
  }
];

export default routers;
