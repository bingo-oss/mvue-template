<template>
  <div :key="$route.fullPath" class="pageMain" :id="'default-form-uuid-'+entityName" >
    <div class=" default-form-body">
      <meta-form ref="form" :entity-name="entityName" :record-id="id" :isView="isViewMode" :toolbar="toolbar">
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
      id:id,
      toolbar:{
        "editBtns": [
            {
                "operationType": "common",
                "termimalType":1,
                "name": "goback",
                "title":"取消",
                "btnType":"ghost"
            },
            {
                "operationType": "common",
                "name": "save",
                "termimalType":7,
                "title":"保存"
            },
            {
                "operationType": "common",
                "name": "del",
                "termimalType":7,
                "title":"删除"
            }
        ]
      }
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

