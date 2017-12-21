<template>
<div class="pageMain">
  sdfkdsjfkdsjfd
    <meta-form :entity-name="entityName" :model="model" @exDataChanged="exDataChanged">
        <meta-field name="name" v-model="model.name">
        </meta-field>
        <meta-field name="loginName" v-model="model.loginName">
        </meta-field>
        <meta-field name="password" v-model="model.password">
        </meta-field>
        <meta-field name="gender" v-model="model.gender">
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

