<template>
  <div :key="$route.fullPath" class="pageMain" :id="'default-form-uuid-'+entityName" >
    <div class=" default-form-body">
      <meta-form ref="form" transfer :entity-name="entityName" :record-id="id" :isView="isViewMode">
      </meta-form>
    </div>
  </div>
</template>
<script>
export default {
  data:function () {
    var entityName=this.$route.params.entityName;
    var id=this.$route.params.id;
    return {
      entityName:entityName,
      id:id
    }
  },
  computed:{
    isViewMode(){
      let action=this.$route.query&&this.$route.query[Utils.queryKeys.action];
      return Utils.formActions.view===action;
    }
  }
}
</script>

