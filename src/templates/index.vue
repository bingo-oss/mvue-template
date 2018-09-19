<template>
    <div>
        <div>{{info}}</div>
    </div>
</template>
<script>
  import confs from '../pages/auto-page-confs'
  export default {
    data: function () {
        var key=this.$route.fullPath;
        return {
            info:confs[key].info
        };
    }
  };
</script>
