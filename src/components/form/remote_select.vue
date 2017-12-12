<template>
    <li class="form-group"  v-bind:class="{'ivu-form-item-required':required}">
        <label class="ivu-form-item-label" :for="metafield.name" v-once>{{metafield.label}}:</label>

        <Multiselect v-model="selectedItem"
                        :options="dataItems"
                        :placeholder="metafield.placeholder"
                        :disabled="metafield.disabled"
                        select-label="按enter键选择"
                        selected-label="已选"
                        deselect-label="按enter键取消选择"
                        :show-no-results="false"
                        :label="metafield.labelField"
                        @select="onSelect"
                        @search-change="searchChange"
                        :track-by="getIdField()"></Multiselect>
        <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(metafield.name)">{{ validator&&validator.errorBag&&validator.errorBag.first(metafield.name) }}</span>
        <p class="colorGrey" v-show="metafield.help" v-text="metafield.help"></p>
    </li>
</template>
<script>
    import remoteSelect from 'services/form/remote_select';
    export default {
        mixins: [remoteSelect]
    };
</script>
<style lang="scss" scoped>
    
</style>


