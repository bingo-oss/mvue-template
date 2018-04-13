<template>
  <div v-autoscroll>
    <childheader :show="header"></childheader>
    <div class="pageMain">
      <meta-grid ref="gridList" :meta-entity="entityName">
      </meta-grid>
    </div>
  </div>
</template>
<script>
export default {
    mixins:[mvueCore.mixins.gridBase],
    data:function(){
        return {
        }
    },
    components:{
      childheader:require('components/childheader.vue'),
    }
};
</script>

