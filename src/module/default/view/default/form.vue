<template>
<div :key="$route.fullPath" class="pageMain" :id="'default-form-uuid-'+entityName">
    <div class=" default-form-body">
        <meta-form ref="form" transfer :entity-name="entityName" :model="model" :initial-data="initialData" :action="action"
            @exDataChanged="exDataChanged"
            :before-save="beforeSave" :after-save="afterSave" :permissions="permissions" :preprocessed="preprocessed"
            @on-created="onCreated"
            @on-edited="onEdited"
            @on-deleted="onDeleted">
            <meta-field v-for="key in metaEntity.getDefaultFormFields()" :key="key" :name="key" v-model="model[key]">
            </meta-field>
        </meta-form>
    </div>
</div>
</template>
<script>
export default {
    mixins:[mvueCore.mixins.formBase],
    computed:{
        action:function(){
            let action=this.$route.query&&this.$route.query[Utils.queryKeys.action];
            return action;
        }
    },
    methods:{
        isViewMode(){
            return Utils.formActions.view===this.action;
        },
        initPerm(data){//初始化表单数据操作权限
            if(Utils.hasPerm(data[Utils.dataPermField],Utils.permValues.edit)){
                //当前用户有编辑权限
                this.permissions={
                    "openEdit":false,
                    "edit":true,
                    "del":false,
                    "cancel":true
                }
            }else{//当前用户无编辑权限
                this.permissions={
                    "openEdit":false,
                    "edit":false,
                    "del":false,
                    "cancel":false
                }
            }
        }
    }
}
</script>

