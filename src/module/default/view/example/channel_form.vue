<template>
  <div class="pageMain">
    <meta-form ref="form" :entity-name="entityName" :record-id="id" :on-inited="onFormInited">
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
  import   channelService from "services/example/channel_service";
  export default {
    data:function () {
      var entityName=this.$route.params.entityName;
      var id=this.$route.params.id;
      return {
        entityName:entityName,
        id:id
      }
    },
  mounted:function () {
    var id=this.$route.params.id;
    channelService.get({id:id}).then(function(reVal){
      console.log(JSON.stringify(reVal));
    });
    //获取创建时间字段的默认值
    channelService.calc({"createdAt":null}).then(function({data}){
      console.log(JSON.stringify(data));
    });
  },
    methods:{
      onFormInited:function (metaForm) {
        //metaForm.entity.description="aaaaa";
      }
    }
  }
</script>

