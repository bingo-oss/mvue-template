<template>
  <div>
    <childheader :show="header"></childheader>
    <div class="pageMain">
      <meta-grid ref="gridList"
            :meta-entity="'Channel'"
            :query-resource="queryResource" :query-options="queryOptions"
            :columns="columns"
            :pager="pager"
            :pager-sizes="pagerSizes"
            :toolbar="toolbar"
      >
      </meta-grid>
    </div>
  </div>
</template>
<script>
  var metaEntityResource=require("services/example/channel_service").$resource;
  module.exports = {
    data:function(){
      return {
        header: {
          title: "频道管理",
          description: "显示及维护系统内的所有频道",
          showBack: false
        },
        pager:true,
        pagerSizes:[10,20,50],
        queryResource:metaEntityResource,
        queryOptions:{"orderby":"updatedAt desc"},
        columns:[
          {key:"title"},
          {key:"status"},
          {key:"description"},
          {key:"updatedAt"},
          {title:"具体操作",width:220,align:"center",metaParams:{
              type:"operation",
              btns:["edit","del"]
            }},
        ],
        toolbar:{
          btns:["create"],
          quicksearch:{
            fields:["description","title"],
            placeholder:"根据名称搜索"
          }
        }
      }
    },
    mounted: function () {

    },
    components:{
      childheader:require('components/childheader.vue'),
    }
  };
</script>

