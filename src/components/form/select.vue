<template>
    <li class="form-group"  v-bind:class="{'ivu-form-item-required':required}">
        <label class="ivu-form-item-label" :for="metafield.name" v-once>{{metafield.label}}:</label>
        <select class="form-control" :value="value" @input="updateValue($event.target.value)" :disabled="metafield.disabled">
            <option value="">--选择--</option>
            <option v-if="metafield.options" v-for="option in realOptions" :selected="value===option[getIdField()]" :disabled="metafield.optionDisabledFunc&&metafield.optionDisabledFunc(option)" :value="option[getIdField()]" v-text="metafield.optionTextRender?metafield.optionTextRender(option):(option.text||option.title||option.name)" :key="option[getIdField()]"></option>
            <slot v-if="!metafield.options"></slot>
        </select>
        <slot name="buttons"></slot>
        <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(metafield.name)">{{ validator&&validator.errorBag&&validator.errorBag.first(metafield.name) }}</span>
        <p class="colorGrey" v-show="metafield.help" v-text="metafield.help"></p>
    </li>
</template>
<script>
    module.exports = {
        props: ["metafield","value","validator","required"],
        data: function(){
            return {
            };
        },
        computed:{
            realOptions:function(){//将['id1','id2']转成[{id:'id1',text:'id1'},{id:'id2',text:'id2'}]
                var options=this.metafield.options;
                //如果元素不是对象，是简单的数组类型['id1','id2']，则作自动转换
                if(options&&options.length&&(!_.isObject(options[0]))){
                    var _options=[];
                    _.each(options,function(option){
                        _options.push({id:option,text:option});
                    });
                    return _options;
                }
                return options;
            }
        },
        methods: {
            updateValue: function (value) {
                this.$emit('input',value);
            },
            getIdField:function(){
                return this.metafield.idField||"id";
            }
        }
    };
</script>
<style lang="scss" scoped>
    .extra-button{
        margin-top: 2px;
        font-style:italic;
    }
</style>


