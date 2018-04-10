<template>
<div class="pageMain">
    <meta-form :entity-name="entityName" :model="model" @exDataChanged="exDataChanged">
        <meta-field name="title" v-model="model.title">
        </meta-field>
        <meta-field name="status" v-model="model.status">
        </meta-field>
        <meta-field name="description" v-model="model.description">
        </meta-field>
    </meta-form>
</div>
</template>
<script>
export default {
    mixins:[mvueCore.mixins.formBase]
}
</script>

