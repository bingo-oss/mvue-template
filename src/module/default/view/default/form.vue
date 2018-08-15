<template>
  <div class="bvue-page" :key="$route.fullPath"  :id="'default-form-uuid-'+entityName">
    <b-childheader :title="'实体管理'" :subtitle="'对实体数据进行编辑'"></b-childheader>
    <div class="bvue-page-body">
      <Card :bordered="false" :padding="24">
        <Row>
          <Col span="22" >
              <meta-form ref="form" :entity-name="entityName" :record-id="id"
                         :isView="isViewMode" :toolbar="toolbar"
                         :label-width="120">
              </meta-form>
          </Col>
        </Row>
      </Card>
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
                "btnType":"text"
            },
            {
                "operationType": "common",
                "name": "save",
                "termimalType":7,
                "title":"保存"
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

