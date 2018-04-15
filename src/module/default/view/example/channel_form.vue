<template>
  <div class="pageMain">
    <meta-form ref="form" :entity-name="entityName" :record-id="id" :onMounted="onFormMounted">
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="title"  title="频道名称">
        </meta-field>
        </Col>
      </Row>
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="status">
        </meta-field>
        </Col>
      </Row>
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="description">
        </meta-field>
        </Col>
      </Row>
    </meta-form>
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
    methods:{
      onFormMounted:function (metaForm) {
        metaForm.entity.description="aaaaa";
      }
    }
  }
</script>

