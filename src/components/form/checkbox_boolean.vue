<template>
    <li class="form-group">
        <label :for="metafield.name" v-once>{{metafield.label}}:</label>
        <input :checked="checked" @change="updateValue($event.target)" :disabled="metafield.disabled" :true-value="true" :false-value="false" type="checkbox">
        <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(metafield.name)">{{ validator&&validator.errorBag&&validator.errorBag.first(metafield.name) }}</span>
        <p class="colorGrey" v-show="metafield.help" v-text="metafield.help"></p>
    </li>
</template>
<script>
    module.exports = {
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: {
            "metafield":Object,
            "validator":Object,
            checked: {
                type: Boolean,
                default: false
            }
        },
        data: function(){
            return {
            };
        },
        methods: {
            updateValue: function ($checkbox) {
                this.$emit('change',$checkbox.checked);
            }
        }
    };
</script>