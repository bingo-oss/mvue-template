<template>
    <li class="form-group">
        <label :for="metafield.name" v-once>{{metafield.label}}:</label>
        <textarea class="form-control" :maxlength="metafield.length" :name="metafield.name" :value="value"
                  @input="updateValue($event.target.value)" :cols="metafield.cols" :rows="metafield.rows?metafield.rows:5"
                  :disabled="metafield.disabled" :class="{'disabledSty' : metafield.disabled}" :placeholder="placeholder"></textarea>
        <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(metafield.name)">{{ validator&&validator.errorBag&&validator.errorBag.first(metafield.name) }}</span>
        <p class="colorGrey" v-show="metafield.help" v-text="metafield.help"></p>
    </li>
</template>
<script>
    module.exports = {
        props: ["metafield","value","validator","placeholder"],
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

