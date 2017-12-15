<template>
    <div :style="{width:formItem.componentParams.width+'%'}">
        <div v-if="formItem.componentParams.layout===controlTypeService.componentLayout.vertical" class="form-group" :class="{'ivu-form-item-required':formItem.componentParams.required}">
            <label :class="{'ivu-form-item-label':formItem.componentParams.required}" v-text="formItem.componentParams.title"></label>
            <div class="radio" v-for="item in formItem.componentParams.options" :key="item.id">
                <label>
                    <input @change="updateValue($event.target,item.text)" v-model="valueObj" type="radio" :disabled="disabled" :name="formItem.dataField" :value="item.id">
                    {{item.text}}
                </label>
            </div>
            <div class="radio" v-if="formItem.componentParams.otherOptions.addOthers" :class="{'ivu-form-item-required':formItem.componentParams.otherOptions.required}">
                <label style="width:70px;">
                    <input @change="updateValue($event.target)" v-model="valueObj" type="radio" :disabled="disabled" :name="formItem.dataField" :value="formItem.componentParams.otherOptions.id">
                    {{formItem.componentParams.otherOptions.text}}
                    <span :class="{'ivu-form-item-label':formItem.componentParams.otherOptions.required}"></span>
                </label>
                <input @change="emitOthersValue($event.target.value)" style="width:70%;left:70px;position:absolute;" :disabled="disabled" type="text" class="form-control form-control-inline">
            </div>
            <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(formItem.dataField)">{{ validator&&validator.errorBag&&validator.errorBag.first(formItem.dataField) }}</span>
            <p class="colorGrey" v-show="formItem.componentParams.description" v-text="formItem.componentParams.description"></p>
        </div>
        <div v-if="formItem.componentParams.layout===controlTypeService.componentLayout.horizontal" class="form-horizontal">
            <div class="form-group" :class="{'ivu-form-item-required':formItem.componentParams.required}">
                <label v-text="formItem.componentParams.title" class="ivu-form-item-label control-label col-md-2" :style="{width:labelWidth}"></label>
                <div class="col-md-10" :style="{width:controlWidth}">
                    <div class="radio" v-for="item in formItem.componentParams.options" :key="item.id">
                        <label>
                            <input @change="updateValue($event.target,item.text)" v-model="valueObj" type="radio" :disabled="disabled" :name="formItem.dataField" :value="item.id">
                            {{item.text}}
                        </label>
                    </div>
                    <div class="radio" v-if="formItem.componentParams.otherOptions.addOthers" :class="{'ivu-form-item-required':formItem.componentParams.otherOptions.required}">
                        <label style="width:70px;">
                            <input @change="updateValue($event.target)" v-model="valueObj" type="radio" :disabled="disabled" :name="formItem.dataField" :value="formItem.componentParams.otherOptions.id">
                            {{formItem.componentParams.otherOptions.text}}
                            <span :class="{'ivu-form-item-label':formItem.componentParams.otherOptions.required}"></span>
                        </label>
                        <input @change="emitOthersValue($event.target.value)" style="width:70%;left:70px;position:absolute;" :disabled="disabled" type="text" class="form-control form-control-inline">
                    </div>
                    <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(formItem.dataField)">{{ validator&&validator.errorBag&&validator.errorBag.first(formItem.dataField) }}</span>
                    <p class="colorGrey" v-show="formItem.componentParams.description" v-text="formItem.componentParams.description"></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import controlBase from 'services/metaform/control_base';
export default {
    mixins: [controlBase],
    props: {
        "value":{type:[Boolean,Number,String,Object],default:null}
    },
    data: function(){
        return {
            valueObj:null
        };
    },
    watch:{
        "value":function(newV,oldV){
            this.valueObj=newV;
        },
        "formItem.componentParams.options":{
            handler:function(newOptions,oldOptions){
                this.initDefault();
            },
            deep:true
        }
    },
    mounted:function(){
        var _this=this;
        this.valueObj=this.value;
        if(!this.valueObj){
            this.initDefault();
        }
    },
    methods:{
        initDefault:function(){
            var _this=this;
            _.each(this.formItem.componentParams.options,function(option){
                if(option.checked){
                    _this.valueObj=option.id;
                    _this.$emit('input',_this.valueObj);
                    _this.emitExData(option.id,option.text);
                    return false;
                }
            });
        },
        updateValue: function ($checkbox,text) {
            var _value=$checkbox.value;
            var emitValue=_value;
            if("true"===_value){
                emitValue=true;
            }else if("false"===_value){
                emitValue=false;
            }
            this.$emit('input',emitValue);
            if(text){
                this.emitExData(emitValue,text);
            }
        },
        emitOthersValue:function(othersValue){
            var othersId=this.formItem.componentParams.otherOptions.id;
            this.emitExData(othersId,othersValue);
        },
        emitExData:function(id,text){
            var exData={};
            exData[id]=text;
            this.$emit("exDataChanged",exData,this.formItem.dataField,"options");
        }
    }
}
</script>
<style lang="scss" scoped>
    .form-control.form-control-inline{
        display: inline-block;
    }
</style>


