<template>
  <div class="bvue-page">
    <b-childheader :title="header.title" :subtitle="header.description" :showBack="header.showBack" ></b-childheader>
    <meta-grid ref="gridList"
               meta-entity-name="Menu"
               :columns="columns"
               :toolbar="toolbar">
    </meta-grid>
  </div>
</template>
<script>
  module.exports = {
    data:function(){
      return {
        header: {
          title: "菜单管理",
          description: "显示及维护系统内的所有菜单",
          showBack: false
        },
        pagerSizes:[10,20,50],
        queryOptions:{"orderby":"updatedAt desc"},
        columns:[
          {key:"title",width:200},
          {key:"name"},
          {key:"url"},
          {key:"displayOrder",width:100,align:"center"},
          {key:"status"},
          {key:"parentId"},
          {key:"createdAt",width:100}
        ],
        toolbar:{
          btnSizeBeforeMore: 2,
          advanceSearchFields:['title'],
          btns:["create","batchDelete","export","import"],
          singleBtns:["edit","del"],
          quicksearch:{
            fields:["title","name"],
            placeholder:"根据名称搜索"
          }
        }
      }
    }
  };
</script>
