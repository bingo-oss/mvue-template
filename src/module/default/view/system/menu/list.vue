<template>
  <div class="bvue-page">
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
          {key:"displayOrder"},
          {key:"status"},
          {key:"createdAt",width:150}
        ],
        toolbar:{
          btnSizeBeforeMore: 1,
          advanceSearchFields:['title'],
          btns:["create","export","import"],
          singleBtns:["edit","del"],
          quicksearch:{
            fields:["description","title"],
            placeholder:"根据名称搜索"
          }
        }
      }
    }
  };
</script>
