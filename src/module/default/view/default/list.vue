<template>
  <div v-autoscroll>
    <div class="pageMain">
      <meta-grid ref="gridList"
               :entity-name="$route.params.entityName" 
               :toolbar="toolbar">
      </meta-grid>
    </div>
  </div>
</template>
<script>
export default {
    data:function(){
        return {
          toolbar:{
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

