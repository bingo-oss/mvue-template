<template>
<div class="pageMain">
    <meta-form ref="form" :entity-name="entityName" :model="model"
    @exDataChanged="exDataChanged"
    @on-created="onCreated" 
    @on-deleted="onDeleted">
        <Row type="flex" :gutter="10">
            <Col span="12" order="1">
                <meta-field name="name" v-model="model.name" title="用户名称">
                </meta-field>
            </Col>
            <Col span="12" order="2">
                <meta-field name="loginName" v-model="model.loginName">
                </meta-field>
            </Col>
        </Row>
        <Row type="flex" :gutter="10">
            <Col span="12" order="1">
                <meta-field name="gender" v-model="model.gender">
                </meta-field>
            </Col>
            <Col span="12" order="2">
            </Col>
        </Row>
        
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

