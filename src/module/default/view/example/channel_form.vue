<template>
  <div class="pageMain">
    <meta-form ref="form" :entity-name="entityName" :record-id="id" :on-inited="onFormInited" :toolbar="toolbar">
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="title"  title="频道名称" :context="{mode:'readonly'}">
        </meta-field>
        </Col>
      </Row>
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="status" :preprocessor="statusPreprocessor">
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
  data: function() {
    var entityName = this.$route.params.entityName;
    var id = this.$route.params.id;
    return {
      entityName: entityName,
      id: id,
      toolbar:{
        "editBtns": [
            {
                "operationType": "common",
                "termimalType":1,
                "name": "goback",
                "title":"取消",
                "display":{from:"formCancel"},
                "btnType":"ghost"
            },
            {
                "operationType": "common",
                "name": "save",
                "termimalType":7,
                "title":"保存",
                "display":{from:"formEdit"}
            },
            {
                "operationType": "common",
                "name": "del",
                "termimalType":7,
                "title":"删除",
                "display":{from:"formDel"}
            }
        ]
      }

    };
  },
  mounted: function() {
    var id = this.$route.params.id;
    channelService.get({ id: id }).then(function(reVal) {
      console.log(JSON.stringify(reVal));
    });
    //获取创建时间字段的默认值
    channelService.calc({ createdAt: null }).then(function({ data }) {
      console.log(JSON.stringify(data));
    });
  },
  methods: {
    statusPreprocessor(formItem,tagInst){
      formItem.componentParams.title="自定义标题";
    },
    onFormInited: function(metaForm) {
      //metaForm.entity.description="aaaaa";
    }
  }
};
</script>

