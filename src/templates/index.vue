<template>
    <meta-layout :settings="settings"></meta-layout>
</template>
<script>
  import confs from '../pages/auto-page-confs';
  import mvueCore from 'mvue-core';
  export default {
    data: function () {
        var key=this.$route.fullPath;
        var _settings=mvueCore.metaLayoutConvertor.convert(confs[key]);
        return {
            settings:_settings.layout
        };
    }
  };
</script>
