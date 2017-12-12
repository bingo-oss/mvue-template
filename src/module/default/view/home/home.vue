<template>
  <div  class="layout" >
    <div class="layout-header clearfix">
      <div class="layout-logo">元数据开发框架</div>
      <div class="layout-header-menu clearfix">
        <Menu mode="horizontal" theme="primary" >
          <MenuItem name="1">
            <Icon type="home"></Icon>
            <router-link to="/" tag="span">主页</router-link>
          </MenuItem>
          <MenuItem name="2">
            <Icon type="gear-b"></Icon>
            元数据管理
          </MenuItem>
          <Submenu name="3">
            <template slot="title">
              <Avatar shape="square" icon="person" size="small" />
              张三
            </template>
            <MenuGroup title="用户">
              <MenuItem name="3-1">基本信息</MenuItem>
              <MenuItem name="3-2">操作日志</MenuItem>
              <MenuItem name="3-3">配置管理</MenuItem>
            </MenuGroup>
            <MenuGroup title="系统">
              <MenuItem name="3-4">退出</MenuItem>
              <MenuItem name="3-5">流失用户</MenuItem>
            </MenuGroup>
          </Submenu>
        </Menu>
      </div>
    </div>
    <div class="layout-content">
      <Row>
        <Col span="4">
        <navbar :menus="menu" @shrinkNavBar="doShrink"></navbar>
        </Col>
        <Col span="20">
        <div class="layout-content-main">
          <router-view>
          </router-view>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  var menu = require('../../menu/home_menu_base.js');
  module.exports = {
    data: function () {
      return {
        shrinkNavBar: false,
        menu: menu
      };
    },
    methods: {
      doShrink:function(shrinkNavBar){
        this.shrinkNavBar=shrinkNavBar;
      }
    },
    components:{
      navbar:require('components/nav_bar'),
    }
  }
</script>
<style lang="scss">
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }
  .layout-logo{
    height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    color: #ffffff;
    font-size: 20px;
  }
  .layout-header{
    background:  #017fe1;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }

  .layout-header-menu{
    float: right;
    margin-right: 15px;
  }
  .layout-header-menu a{
    color: #9ba7b5;
  }
  .layout-header-menu .ivu-menu-submenu-title span>i{
    margin-right: 2px;
  }

  .layout-content{
    min-height: 200px;
    margin: 0px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }

  .clearfix:after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both
  }
  .clearfix {
    zoom: 1;
  }
</style>

