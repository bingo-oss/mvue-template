<template>
  <div>
    <meta-childheader :show="header"></meta-childheader>
    <div class="pageMain">
      <meta-grid ref="gridList"
            :meta-entity="entityName"
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
        return {
            header: {
                title: metaEntity.title,
                description: metaEntity.description,
                showBack: false
            },
            entityName:entityName
        }
    },
    beforeRouteUpdate: function (to, from, next) {
        var entityName=to.params.entityName;
        var metaEntity=metabase.findMetaEntity(entityName);
        this.entityName=entityName;
        this.header.title=metaEntity.title;
        this.header.description=metaEntity.description;
        next();
    }
};
</script>

