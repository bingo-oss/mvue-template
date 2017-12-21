<template>
    <component v-if="formItem" 
    v-model="innerValue" 
    :validator="validator"
    @exDataChanged="exDataChanged" 
    :is="'Meta'+formItem.componentType" 
    :form-item="formItem">
    </component>
</template>
<script>
import metabase from 'libs/metadata/metabase';
import controlTypeService from 'services/metaform/control_type_service';
export default {
    props:{
        name:{
            type:String,
            required:true
        },
        value:{
            required:true
        },
        entityName:{
            type:String
        }
    },
    data:function(){
        var entityName=this.entityName||this.$parent.entityName;
        var metaEntity=metabase.findMetaEntity(entityName);
        if(!metaEntity){
            iview$Modal.error({
                title:"错误",
                content:`实体${entityName}不存在`
            });
            return {};
        }
        var metaField=metaEntity.fields[this.name];
        if(!metaField){
            iview$Modal.error({
                title:"错误",
                content:`字段${name}不存在`
            });
            return {};
        }
        var formItem=controlTypeService.buildFormItemByMetaField(metaField);
        this.initValidation(this.$parent.validator,formItem);
        return {
            innerValue:_.cloneDeep(this.value),
            formItem:formItem,
            validator:this.$parent.validator,
            metaEntity:metaEntity
        }
    },
    watch:{
        value:{
            handler:function(){
                if(!_.isEqual(this.value,this.innerValue)){
                    this.innerValue=_.cloneDeep(this.value);
                }
            },
            deep:true
        },
        innerValue:{
            handler:function(){
                this.$emit('input',this.innerValue);
            },
            deep:true
        }
    },
    methods:{
        //表单记录扩展数据填充，如选择用户之后用户名称存储、选项类型其他选项对应的填写值等
        exDataChanged:function(newValue,dataField,exDataKey){
            this.$parent.$emit("exDataChanged",newValue,dataField,exDataKey);
        },
        //初始化字段组件的验证规则
        initValidation: function(validator,formItem){
            if(formItem.isDataField){
                var fieldName=formItem.dataField;
                var params=formItem.componentParams;
                //必填
                var rule={};
                if(params.required){
                    rule.required=true;
                }
                //唯一性校验
                if(params.unique){
                    rule.verify_field_unique=[
                        `query:${_this.metaEntity.resourceUrl}`,
                        fieldName,
                        {},
                        _this.$route.params.dataId
                    ]
                }
                //验证规则
                if(params.validation
                    &&params.validation.validate
                    &&params.validation.rule
                    &&params.validation.rule.pattern){
                    rule.regex=[params.validation.rule.pattern];
                }
                //长度验证
                if(params.limitLength&&params.limitLength.limit){
                    if(params.limitLength.max>0){
                        rule.max=[params.limitLength.max];
                    }
                    if(params.limitLength.min>0){
                        rule.min=[params.limitLength.min];
                    }
                }
                //数值范围
                if(params.limitRange&&params.limitRange.limit){
                    if(params.limitRange.max>0){
                        rule.max_value=[params.limitRange.max];
                    }
                    if(params.limitRange.min>0){
                        rule.min_value=[params.limitRange.min];
                    }
                }
                //小数点限制
                if(params.decimal){
                    //小数
                    if(params.decimal.isAllowed){
                        rule.decimal=[params.decimal.digits];
                    }else{//不含小数部分
                        rule.decimal=[];
                    }
                }
                //负数限制
                if(params.allowNegative===false){
                    //没有定义最小值或者最小值设置成负数，设置最小值为0
                    if((!rule.min_value)||(_.startsWith(rule.min_value,"-"))){
                        rule.min_value=["0"];
                    }
                }
                if(!_.isEmpty(rule)){
                    validator.attach(fieldName, rule);
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>

</style>




