/**
 * 封装loading
 * Created by notgreenl on 2016/12/6.
 */
'use strict';

require('./load.scss');

var loadingIds=[];

var loading = {
    template: '<div class="J-global-loading"><span class="global-loading"></span></div>',
    showDom : function(container, timeout) {
        var _this = this;
        if(container){
            if(container.find('.J-global-loading').length){
                container.find('.J-global-loading').show();
            }else{
                container.append(_this.template);
                container.find('.J-global-loading').show();
            }
        }else{
            //由于loading公共，只要有请求还未完成，就不可以关闭loading，这里存储公共的loading
            loadingIds.push(true);
            if($('body').find('>.J-global-loading').length){
                $('body').find('>.J-global-loading').show();
            }else{
                $('body').append(_this.template);
                $(_this.template).show();
                $('body').find('>.J-global-loading').addClass('fixed');
            }
        }

        if (timeout) {
            setTimeout(function() {
                if (container) {
                    container.find('.J-global-loading').hide();
                }
                else {
                    $(_this.template).hide();
                }

            }, timeout);
        }
    },
    hideDom : function(container) {
        var _this = this;
        loadingIds.pop();
        if(container){
            container.find('.J-global-loading').hide();
        }else{
            //所有请求都返回了，loadingIds队列为空，关闭loading
            if(loadingIds.length<1){
                $('body').find('>.J-global-loading').hide();
            }
        }
    }
};
module.exports = loading;
