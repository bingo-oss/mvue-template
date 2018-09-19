<template>
  <div class="bvue-page" :key="$route.fullPath"  :id="'default-form-uuid-'+entityName">
    <b-childheader :title="childheader.title" :subtitle="childheader.subtitle"></b-childheader>
    <div class="bvue-page-body">
      <Card :bordered="false" :padding="24">
        <Row>
          <Col span="22" >
              <!-- <meta-form ref="form" :entity-name="entityName" :record-id="id"
                :isView="isViewMode" :toolbar="toolbar"
                :on-inited="handleOnInited"
                :label-width="120">
                <meta-field name="title">
                <template slot-scope="{model,metaField,formItem}">
                  <Input v-model="model.title" type="textarea" placeholder="Enter something..." />
                </template>
                </meta-field>
                <meta-field name="name">
                </meta-field>
              </meta-form> -->
              <meta-v-form ref="form" :meta-form="metaForm" :record-id="id"
                :isView="isViewMode" :toolbar="toolbar"
                :on-inited="handleOnInited"
                :label-width="120">
                
              </meta-v-form>
          </Col>
        </Row>
      </Card>
    </div>
  </div>
</template>
<script>
import metaForm from './meta-form'
export default {
  data:function () {
    var entityName='Menu';
    var id=this.$route.params.id;
    return {
      metaForm:metaForm,
      childheader:{
        title:"",
        subtitle:""
      },
      entityName:entityName,
      id:id,
      toolbar:{
        "editBtns": [
            {
                "operationType": "common",
                "termimalType":1,
                "name": "goback",
                "title":"取消",
                "btnType":"default"
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
  },
  methods:{
    handleOnInited(formInst){
      var metaEntity=formInst.metaEntity;
      var prefix='';
      if(this.isViewMode){
        prefix='查看ggg';
      }else if(this.id){
        prefix='编辑';
      }else{
        prefix='创建333';
      }
      this.childheader.title=`${prefix}${metaEntity.title}`;
      this.childheader.subtitle=`${metaEntity.description}`;
    }
  }
}
</script>

