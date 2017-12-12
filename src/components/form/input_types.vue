<template>
    <div v-if="inputtype == 'SingleLineText'">
      <singlelinetext :key="inputtype" :validator="$validator" :metafield='{label:"最大长度",name:"max",length:30,disabled:disabled}'
                      v-model="params.max"></singlelinetext>
      <singlelinetext :key="inputtype" :validator="$validator" :metafield='{label:"最小长度",name:"min",length:30,disabled:disabled}'
                      v-model="params.min"></singlelinetext>
      <singlelinetext :key="inputtype" :validator="$validator" :metafield='{label:"匹配正则表达式",name:"pattern",length:300,disabled:disabled}'
                      v-model="params.pattern"></singlelinetext>
    </div>

    <div v-else-if="inputtype == 'MultiLineText'">
      <singlelinetext :key="inputtype" :validator="$validator" :metafield='{label:"最大长度",name:"max",length:30,disabled:disabled}'
                      v-model="params.max"></singlelinetext>
      <singlelinetext :key="inputtype" :validator="$validator" :metafield='{label:"最小长度",name:"min",length:30,disabled:disabled}'
                      v-model="params.min"></singlelinetext>
    </div>

    <div v-else-if="inputtype == 'SingleSelect' || inputtype == 'RadioButton'">
      <multilinetext :key="inputtype" :validator="$validator" :metafield='{label:"枚举值",name:"enum",length:1000,disabled:disabled}'
                     :placeholder="'一行一个枚举值，如果值是 key-value 形式，则 key 和 value 使用英文冒号 : 分隔开'"
                     v-model="params.enum"></multilinetext>
    </div>

    <div v-else-if="inputtype == 'CheckboxGroup'">
      <multilinetext :key="inputtype" :validator="$validator" :metafield='{label:"枚举值",name:"enum",length:1000,disabled:disabled}'
                     :placeholder="'一行一个枚举值，如果值是 key-value 形式，则 key 和 value 使用英文冒号 : 分隔开'"
                     v-model="params.enum"></multilinetext>
    </div>

    <div v-else-if="inputtype == 'Email'">
      <singlelinetext :key="inputtype" :validator="$validator" :metafield='{label:"匹配正则表达式",name:"pattern",length:300,disabled:disabled}'
                      v-model="params.pattern"></singlelinetext>
    </div>
</template>
<script>
    module.exports = {
        props: {
            "inputtype": String,
            "params": Object,
            "disabled": Boolean,
            "value":{type:[Boolean,Number,String,Object],default:null}
        },
        data: function(){
            return {
            };
        },
        methods: {
            updateValue: function ($checkbox) {
                var _this=this;
                var _value=$checkbox.value;
                var emitValue=_value;
                if("true"===_value){
                    emitValue=true;
                }else if("false"===_value){
                    emitValue=false;
                }
                _this.$emit('input',emitValue);
            }
        },
        watch: {
            'params': function (newValue, oldValue) {
                console.log('input type params changed:', newValue, oldValue);
            }
        },
        mounted:function(){
            var _this=this;
            _this.valueObj=_this.value;
            _this.$watch("value",function(newV,oldV){
                _this.valueObj=newV;
            });
        },
        components: {
          singlelinetext: require('components/form/singleline_text.vue'),
          singleselect: require('components/form/select.vue'),
          multilinetext: require('components/form/multiline_text.vue')
        }

    };
</script>
<style lang="scss" scoped>
  .radio {
    display: inline-block;
    margin-left: 20px;
  }
</style>
