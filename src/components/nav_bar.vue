<template>
    <div class="nav-bar-container">
        <div class="nav-bar" :class="{'navBar-flexible': shrinkNavBar}">
            <div class="flexible" @click="doShrink">
                <Icon type="navicon-round" size="16"></Icon>
            </div>
          <Menu  width="auto" :open-names="openNames" :active-name="activeName" @on-select="clickMenu">
            <Submenu  v-for="item in localMenus"  :key="item.id"  :name="item.id">
              <template slot="title">
                <Icon :type="item.icon" size="18"></Icon>
                {{item.title}}
              </template>
              <MenuItem v-for="childItem in item.children" :key="childItem.id" :name="childItem.link.name">
                {{childItem.title}}
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
        <div class="tool-tips animated" :class="{'fadeIn': isShow}" id="toolTips" v-show="isShow" style="z-index:999;">
            <i></i>
            <span v-html="toolText"></span>
        </div>
    </div>
</template>
<script>
var userPermsCheck = require('services/security/user_perms_check.js');
export default {
    props: {
        menus: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data: function() {
        return {
            shrinkNavBar: false,//表示导航菜单的收缩，默认展开导航菜单
            toolText: '',
            isShow: false,
            localMenus: _.cloneDeep(this.menus),
            openNames:['0000'],
            activeName:""
        }
    },
    watch:{
        menus:{
            handler:function(){
                this.localMenus=_.cloneDeep(this.menus);
                this.filterMenusWithPermissions();
            },
            deep:true
        }
    },
    mounted: function() {
        this.filterMenusWithPermissions();
        //TODO：没效的样子
        /*先注释掉，会导致浏览器直接输入路径无法到达路由
        var activeMenu=null;
        for (var i = 0; i < this.localMenus.length; i++) {
            this.openNames.push(this.localMenus[i].id);
            if(i==0){
              activeMenu=this.localMenus[i].children[0];
            }
        }
        if(activeMenu!=null){
          this.activeName=activeMenu.link.name;
          router.push({name:activeMenu.link.name});
        }*/
    },
    methods: {
        doShrink: function() {
            this.shrinkNavBar = !this.shrinkNavBar;
            if (this.shrinkNavBar) {
                this.$emit("shrinkNavBar", true);
            } else {
                this.$emit("shrinkNavBar", false);
            }
        },
        clickMenu:function(name){
          if(name){
            router.push({name:name});
          }
        },
        leftNavItemShow: function(dom, item) {
            item.rotate = !item.rotate;
            var dom = $(dom.target).parents("li").find('ul');
            if (dom.css('height') == '0px') {
                dom.css('height', 'inherit');
            } else {
                dom.css('height', '0px');
            }
        },
        tooltip: function($event) {
            var title = $($event.target).attr("data-title");
            title = title || $($event.target).closest("a").attr("data-title");
            if (!title) {
                return false;
            }
            var _this = this;
            var top = 0;
            if (!$(".navBar").hasClass("navBar-flexible")) return false;
            _this.toolText = title;
            top = $event.clientY - 50;
            $("#toolTips").css("top", top + 'px');
            _this.isShow = true;
        },
        tooltipout: function() {
            var _this = this;
            _this.isShow = false;
        },
        filterMenusWithPermissions:function(){
            var _this = this;
            if(!(_this.localMenus&&_this.localMenus.length)){//如果菜单为空
                return;
            }
            /*userPermsCheck.getCurUserPermissions(function(userPerms) {
                for (var k = 0; k < _this.localMenus.length; k++) {
                    var menuChild = _this.localMenus[k].children;
                    var iNow = 0;
                    for (var j = 0; j < menuChild.length; j++) {
                        if (menuChild[j].scopeId) {
                            //支持冒号分隔的权限指定scopeId:val
                            var scopeIdArray = menuChild[j].scopeId.split(":");
                            var scopeId = scopeIdArray[0];
                            var scopeVal = null;
                            if (scopeIdArray.length == 2) {
                                scopeVal = scopeIdArray[1];
                            }
                            var bTrue = userPermsCheck.checkWithPermsData(userPerms, scopeId, scopeVal);
                            if (!bTrue) {
                                menuChild.splice(j, 1);
                                j--;
                            }
                        }
                    }
                }
                for (var i = 0; i < _this.localMenus.length; i++) {
                    if (_this.localMenus[i].hasOwnProperty('children') && !_this.localMenus[i].children.length) {
                        _this.localMenus.splice(i, 1);
                        i--;
                    }
                }
            });*/
        }
    }
}
</script>
<style lang="scss">
  .flexible{
    width: 100%;
    padding: 8px 0 6px;
    background: #f0f0f0;
    text-align: center;
    border-right: 1px solid #cccccc;
  }
  </style>

