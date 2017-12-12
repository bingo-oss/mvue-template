<template>
    <a class="logout">{{ user }} <i class="iconfont icon-tuichu" @click="logout" title="注销"></i></a>
</template>
<script>
  var userResource = require('services/security/user_service.js').$resource;

  module.exports = {
    data: function () {
      return {
        user: ''
      }
    },
    methods: {
      'logout': function () {
        var _this = this;
        iview$Modal.confirm({
          title: '注销',
          content: '确认注销当前用户?',
          onOk: () => {
            var reqUrl = Config.contextPath.authUrl;
            ax.get(reqUrl, null, function (res) {
                sessionStorage.removeItem("AccessToken");
                sessionStorage.removeItem("hasStart");
                if(res){
                    window.location.href = res.tplLogoutUrl.replace("{redirect_uri}", window.location.href);
                }
            });
          }
        });
      }
    },
    mounted: function () {
      var _this = this;
      //获取当前用户名称
      userResource.currentUser().then(function({data}){
        _this.user = data.name;
      });
    }
  };
</script>
<style lang="scss">

</style>
