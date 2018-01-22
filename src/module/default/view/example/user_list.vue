<template>
  <div>
    <childheader :show="header"></childheader>
    <div class="pageMain">
      <grid ref="gridList"
            :meta-entity="'User'"
            :query-resource="queryResource" :query-options="queryOptions"
            :columns="columns"
            :pager="pager"
            :pager-sizes="pagerSizes"
            :toolbar="toolbar"
      >
      </grid>
    </div>
  </div>
</template>
<script>
  var metaEntityResource=require("services/security/user_service").$resource;
  module.exports = {
    data:function(){
      return {
        header: {
          title: "用户管理",
          description: "显示及维护系统内的所有用户",
          showBack: false
        },
        pager:true,
        pagerSizes:[10,20,50],
        queryResource:metaEntityResource,
        queryOptions:{"orderby":"updatedAt desc"},
        columns:[
          {key:"name"},
          {key:"loginName"},
          {key:"photos"},
          {key:"gender"},
          {key:"updatedAt"},
          {title:"具体操作",width:220,align:"center",metaParams:{
              type:"operation",
              btns:["edit","del"]
            }},
        ],
        toolbar:{
          btns:["create"],
          quicksearch:{
            fields:["name","loginName"],
            placeholder:"根据名称搜索"
          }
        }
      }
    },
    mounted: function () {

    },
    components:{
      grid:require('components/grid/iview_grid.vue'),
      childheader:require('components/childheader.vue'),
    }
  };
</script>

