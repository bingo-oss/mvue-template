<template>
    <div class="form-group" v-bind:class="{'ivu-form-item-required':required}">
        <label class="ivu-form-item-label" :for="metafield.name">{{metafield.label}}:</label>
        <input :disabled="metafield.disabled" type="text" v-model="model[metafield.name]" class="form-control">

        <button v-if="!metafield.view" class="btn btn-default update-btn" type="button"  @click="updateSecret()" >点击更新</button>
        <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(metafield.name)">{{ validator&&validator.errorBag&&validator.errorBag.first(metafield.name) }}</span>
    </div>
</template>
<script>
    module.exports = {
        props: ["metafield","model","validator","required"],
        data: function(){
            return {
            };
        },
        methods: {
            updateSecret:function(){
                this.model[this.metafield.name]=Utils.randomString(20);
            }
        }
    };
</script>

<style lang="scss">
   .update-btn{
       margin-top: 2px;
       font-style:italic;
   }
</style>
