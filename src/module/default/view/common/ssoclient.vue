<template>
<div>
     登录中...
</div>
</template>
<script>
  var session =require("libs/security/session");
  var ssoclient=require("libs/security/ssoclient");
    export default {
        data(){
            return {

            }
        },
        mounted(){
          var _self=this;
          if(_self.$route.query["logout"]=="1"){
            session.doLogout(window.location.protocol+window.location.host+window.location.pathname);
            return;
          }
          ssoclient.onSSOCallback(function (tokenInfo) {
            session.doSignIn(tokenInfo);
            var  returnTo=_self.$route.query["returnUrl"];
            if(_.startsWith(returnTo,"http")){
              window.location=returnTo;
            }else{
              router.push({ path: returnTo});
            }
          });

        }
    }
</script>
