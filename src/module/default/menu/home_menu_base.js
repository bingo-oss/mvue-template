var homeMenu = [
  {
    title: '工作台',
    id: "0000",
    icon: 'ivu-icon ivu-icon-ios-home',
    children: [
      {
        id: "0001",
        title: '开发指南',
        icon: 'iconfont icon-order',
        link: {
          name: 'devGuide'
        }
      }
    ]
  },
  {
    title: '系统管理',
    id: "1000",
    icon: 'ivu-icon ivu-icon-android-settings',
    children: [
      {
        id: "1001",
        title: '导航管理',
        icon: 'iconfont icon-grid_',
        link: {
          name: 'engineAdmin'
        }
      },
      {
        id: "1002",
        title: '实体管理',
        icon: 'iconfont icon-grid_',
        link: {
          name: 'dbServerAdmin'
        }
      }
    ]
  }
];
module.exports = homeMenu