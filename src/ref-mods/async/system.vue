<template>
    <div></div>
</template>
<script>
import homeBase from '../../router/home-base'; 
import appCtx from '../../libs/context';
import pageIndex from '../../templates/index';
export default {
    created(){
        import(/* webpackChunkName: "mvue-module-system" */'mvue-module-system')
        .then(({default:mod})=>{
            appCtx.getMvueToolkit().moduleManager.addAsync('system',mod,appCtx,homeBase,pageIndex);
            this.$router.go(-1);
        });
    }
}
</script>
        