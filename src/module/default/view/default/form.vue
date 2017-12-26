<template>
<div class="pageMain">
    <meta-form ref="form" :entity-name="entityName" :model="model"
    @exDataChanged="exDataChanged"
    @on-created="onCreated" 
    @on-deleted="onDeleted">
        <meta-field v-for="key in metaEntity.getDefaultFormFields()" :key="key" :name="key" v-model="model[key]">
        </meta-field>
    </meta-form>
</div>
</template>
<script>
import formBase from 'services/metaform/form_base'
export default {
    mixins:[formBase]
}
</script>

