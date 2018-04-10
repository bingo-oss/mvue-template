<template>
<div class="pageMain default-form-body" v-autoscroll>
    <meta-form ref="form" :entity-name="entityName" :model="model"
    @exDataChanged="exDataChanged" 
    :preprocessed="preprocessed"
    @on-created="onCreated" 
    @on-deleted="onDeleted">
        <meta-field v-for="key in metaEntity.getDefaultFormFields()" :key="key" :name="key" v-model="model[key]">
        </meta-field>
    </meta-form>
</div>
</template>
<script>
export default {
    mixins:[mvueCore.mixins.formBase]
}
</script>

