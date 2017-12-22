<template>
  <div>
    <meta-childheader :show="header"></meta-childheader>
    <div class="pageMain">
      <meta-grid ref="gridList"
            :meta-entity="entityName"
            :pager-sizes="pagerSizes"
      >
      </meta-grid>
    </div>
  </div>
</template>
<script>
import metabase from 'libs/metadata/metabase'
export default {
    data:function(){
        var entityName=this.$route.params.entityName;
        var metaEntity=metabase.findMetaEntity(entityName);
        debugger
        return {
            header: {
                title: metaEntity.title,
                description: metaEntity.description,
                showBack: false
            },
            entityName:entityName,
            pagerSizes:[10,20,50]
        }
    }
};
</script>

