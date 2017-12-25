<template>
<div class="pageMain">
    <meta-form ref="form" :entity-name="entityName" :model="model" 
    @exDataChanged="exDataChanged"
    @on-created="onCreated" 
    @on-deleted="onDeleted">
        <meta-field name="name" v-model="model.name">
        </meta-field>
        <meta-field name="loginName" v-model="model.loginName">
        </meta-field>
        <meta-field name="gender" v-model="model.gender">
        </meta-field>
    </meta-form>
</div>
</template>
<script>
import formBase from 'services/metaform/form_base'
export default {
    mixins:[formBase],
    data:function(){
        //覆盖路由时必须通过这种方式传递实体名称
        return this.setEntityName("user");
    }
}
</script>

