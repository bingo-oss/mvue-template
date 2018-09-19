<template>
    <div>
        <div>{{info}}</div>
        <div>{{count}}</div>
    </div>
</template>
<script>
  import confs from '../pages/auto-page-confs'
  export default {
    data: function () {
        var key=this.$route.fullPath;
        var count=this.$store.getters['core/bigNo']
        debugger
        return {
            info:confs[key].info,
            count:count
        };
    }
  };
</script>
