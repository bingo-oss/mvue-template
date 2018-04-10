<template>
  <div>
    <div class="pageMain">
      <meta-grid ref="gridList" :meta-entity="entityName">
      </meta-grid>
    </div>
  </div>
</template>
<script>
export default {
    data:function(){
        var entityName=this.$route.params.entityName;
        var metaEntity=this.$metaBase.findMetaEntity(entityName);
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
        var metaEntity=this.$metaBase.findMetaEntity(entityName);
        this.entityName=entityName;
        this.header.title=metaEntity.title;
        this.header.description=metaEntity.description;
        next();
    }
};
</script>

