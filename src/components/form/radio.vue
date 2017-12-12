<template>
    <li class="form-group">
        <label :for="metafield.name" v-once>{{metafield.label}}:</label>
        <div class="radio" v-for="(option,index) in metafield.options">
            <label>
                <input type="radio" :disabled="metafield.disabled" @change="updateValue($event.target)" :name="metafield.name" :value="option.id" v-model="valueObj">{{option.text}}
            </label>
        </div>
        <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(metafield.name)">{{ validator&&validator.errorBag&&validator.errorBag.first(metafield.name) }}</span>
        <p class="colorGrey" v-show="metafield.help" v-text="metafield.help"></p>
    </li>
</template>
<script>
    module.exports = {
        props: {
            "metafield":Object,
            "validator":Object,
            "value":{type:[Boolean,Number,String,Object],default:null}
        },
        data: function(){
            return {
                valueObj:null
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
        mounted:function(){
            var _this=this;
            _this.valueObj=_this.value;
            _this.$watch("value",function(newV,oldV){
                _this.valueObj=newV;
            });
        }

    };
</script>
