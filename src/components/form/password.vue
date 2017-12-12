<template>
    <li class="form-group" v-bind:class="{'ivu-form-item-required':required}">
        <label class="ivu-form-item-label" :for="metafield.name" v-once>{{metafield.label}}:</label>
        <input :disabled="metafield.disabled" :maxlength="metafield.length" :placeholder="metafield.placeholder" type="password" :value="value" @input="updateValue($event.target.value)" class="form-control" :class="{'disabledSty' : metafield.disabled}">
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
        methods: {
            updateValue: function (value) {
                this.$emit('input',value);
            }
        }
    };
</script>
