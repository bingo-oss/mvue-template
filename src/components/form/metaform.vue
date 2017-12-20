<template>
    <div class="meta-form-panel">
        <slot></slot>
        <div class="form-toolbar" slot="toolbar">
            <button class="ivu-btn ivu-btn-text" type="button"  @click.stop.prevent="handleCancel">取消</button>
            <button type="button" class="ivu-btn ivu-btn-primary" @click.stop.prevent="saveFormData"><span>保存</span></button>
            <button class="btn btn-danger" type="button" v-if="formData.id" @click.stop.prevent="onDelete">删除</button>
        </div>
    </div>
</template>
<script>
import metabase from 'libs/metadata/metabase';
export default {
    props:{
        formData:{
            type:Object,
            required:true
        },
        entityName:{
            type:String,
            required:true
        }
    },
    data:function(){
        debugger
        var metaEntity=metabase.findMetaEntity(this.entityName);
        //构造实体数据crud操作的vue-resource对象
        var pathname=_.trim(metaEntity.resourceUrl,'/');
        var resourceName=pathname+'{/id}';
        var dataResource = Vue.resource(resourceName);
        return {
            dataResource:dataResource,
            changedQueue:[],//智能验证变化队列
            validator:this.$parent.$validator,
            metaEntity:metaEntity
        };
    },
    methods:{
        handleCancel:function(){
            router.go(-1);
        },
        doValidation:function(callback){
            var _this=this;
            //启用智能校验
            Utils.smartValidate(_this,this.formData,this.$validator,function(){
                callback&&callback();
            });
        },
        saveFormData:function(){
            console.log(this.formData);
            var _this=this;
            this.doValidation(function(){
                _this.doSave();
            });
        },
        doSave(){
            var _this=this;
            if(_this.formData.id){//更新
                let _formData=Utils.reduceModelForUpdate(_this.formData);
                _this.dataResource.update({id:_this.formData.id},_formData).then(function({data}){
                    iview$Message.success('编辑成功');
                });
            }else{//新建
                _this.dataResource.save(_this.formData).then(function({data}){
                    iview$Message.success('保存成功');
                });
            }
        },
        onDelete:function(){
            var _this = this;
            var delParams={id:this.formData.id};
            var tips='确定删除吗?';
            iview$Modal.confirm({
                title: '提示',
                content: tips,
                onOk: () => {
                    _this.dataResource.delete(delParams).then(function(res){
                        iview$Message.success('删除成功');
                    });
                }
            });
        }
    }
}
</script>

