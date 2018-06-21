<template>
  <div v-autoscroll>
    <childheader></childheader>
    <div class="pageMain">
      <meta-grid ref="gridList" :toolbar="toolbar">
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
    },
    components:{
      childheader:require('components/childheader.vue'),
    }
};
</script>

