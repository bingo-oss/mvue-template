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
  export default{
    data:function(){
      return {
        header: {
          title: "菜单管理",
          description: "显示及维护系统内的所有菜单",
          showBack: false
        },
        columns:[
          {key:"title"},
          {key:"name",width:100},
          {key:"url",width:100},
          {key:"displayOrder",width:50},
          {key:"status",width:50},
          {key:"parentId",width:50},
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
