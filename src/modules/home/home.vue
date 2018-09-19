<style lang="scss">
  @import "./home.scss";
</style>
<template>
  <div class="layout" v-bind:class="{'layout-header-hide': hide('top') , 'layout-hide-menu' :hide('left') }">
    <b-header v-if="!hide('top')">
      <template slot="left">
        <Dropdown placement="bottom-start">
          <Button type="text">
            服务
            <Icon type="ios-arrow-down ml-sm"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <div class="p-md">
              <Button>Default</Button>
              <Button type="primary">Primary</Button>
              <Button type="dashed">Dashed</Button>
              <Button type="text">Text</Button>
            </div>
          </DropdownMenu>
        </Dropdown>
      </template>
      <template slot="right">

        <ul class="topbar-menu">
          <li>
            <Tooltip content="首页" placement="bottom">
              <router-link :to="{name:'default'}">
                <Button type="text" icon="ios-home" ></Button>
              </router-link>
            </Tooltip>
          </li>
          <li>
            <Tooltip content="购物车" placement="bottom">
              <router-link :to="{name:'default'}">
                <Button type="text" icon="ios-cart"></Button>
              </router-link>
            </Tooltip>
          </li>
          <li>
            <Tooltip content="工单" placement="bottom">
              <Badge :count="1">
                <router-link :to="{name:'default'}">
                  <Button type="text" icon="ios-paper"></Button>
                </router-link>
              </Badge>
            </Tooltip>
          </li>
        </ul>
      </template>
    </b-header>
    <Layout :class="'ivu-layout-has-sider'" class="layout-content">
      <b-menu v-if="!hide('left')" :menus="menu"></b-menu>
      <Content>
        <b-router-tab></b-router-tab>
        <div class="bvue-page-tabcontent">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>

          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </Content>
    </Layout>
  </div>
</template>
<script>
  import { menuService } from "mvue-components";
  export default {
    data: function () {
      return {
        menu: [],
      }
    },
    mounted: function () {
      const self = this;
      menuService().published({ orderby: "displayOrder asc" }).then(function ({ data }) {
        self.menu = data;
      });
    },
    methods:{
      hide(type){
        var types=this.$route.query._hide;
        if(!types){
          return false;
        }
        types=types.split(",");
        return _.includes(types,type);
      }
    }
  }
</script>
