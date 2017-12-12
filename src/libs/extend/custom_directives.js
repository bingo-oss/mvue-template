//限定某个文本dom的长度，超过length用...
var WordLimit=function($dom,value){
    value.length=value.length||20;
    value.text=value.text||"";
    if($dom&&value.text.length>value.length){
        var _text=value.text.substring(0,value.length)+"...";
        if(_text!=$dom.text()){
            $dom.text(_text);
            $dom.attr("title",value.text);
        }
    }else if($dom&&value.text&&$dom.text()!=value.text){
        $dom.text(value.text);
        $dom.attr("title",value.text);
    }
};
module.exports = function CustomDirectives(Vue) {
    //注册一个全局自定义指令 v-wordlimit
    Vue.directive('wordlimit', {
        inserted: function (el,binding,vnode,oldVnode) {
            var value=binding.value||{};
            WordLimit($(el),value);
        },
        componentUpdated:function (el,binding,vnode,oldVnode) {
            var value=binding.value||{};
            WordLimit($(el),value);
        }
    });
};

