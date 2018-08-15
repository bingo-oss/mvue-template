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
        component: "system/config/config"
      },
      {
        meta: {
          menu: 'system.admin.config'
        },
        name: "system.admin.config.create",
        path: "system/config/create",
        component: "system/conifg/create-config"
      },
      {
        meta: {
          menu: 'system.admin.config'
        },
        name: "system.admin.config.edit",
        path: "system/config/edit/:id",
        component: "system/config/edit-config"
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
      },
      //end 菜单管理
      //begin 角色菜单权限管理
      {
        name: "system.admin.role.perms",
        path: "system/role/perms",
        redirect: { name: "system.admin.role.perms.menu" },
      },
      {
        meta: {
          menu: 'system.admin.role.perms'
        },
        name: "system.admin.role.perms.menu",
        path: "system/role/perms/menu",
        component: "system/role/menu-perms"
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
