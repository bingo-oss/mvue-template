<template>
    <li class="form-group" v-if="metafield.type=='icon'">
        <label :for="metafield.name" v-once>{{metafield.label}}:</label>
        <div class="formElement clearfix">
            <span class="fl uploadImg">
                <img v-if="realPath&&realPath.length" :src="realPath">
            </span>
            <div class="upload" v-if="!(metafield.view || metafield.disabled)">
                <h3>仅支持 {{metafield.filter||defaultFilter}} 格式，大小 {{metafield.maxSize||defaultMaxSize}}M 以内图片。</h3>
                <span>
                    <input type="file" :name="metafield.name+'-upload-file'" @change="fileChanged($event)">
                    <i class="btn btn-default">点击上传</i>
                </span>
            </div>
        </div>
    </li>
</template>
<script>
    var uploadTips="./static/images/upload_tips.png";
    module.exports = {
        props: ["metafield","value"],
        data: function(){
            return {
                realPath:uploadTips,
                defaultMaxSize:5,//以兆m为单位
                defaultFilter:".png|.jpg|.jpeg"
            }
        },
        created:function(){
            this.$watch("value",function(newV,oldV){
              if(newV==null){
                this.realPath="./static/images/upload_tips.png";
              }else{
                this.realPath=Config.contextPath.url + newV;
              }
            });
        },
        methods: {
            fileChanged: function($event){
				var _this = this;
				var $sel = $($event.target);
                //TODO form must exist
                var $form = $sel.closest("form");
				var formdatas = new FormData($form[0]);
				var _sel = $event.target;
                //fileMedia对象属性{name:"2AF6A946-FA11-41F2-A703-04B86643BBC6.png",size:58214,type:"image/png"}
                var fileMedia=_sel.files['0'];
                //文件大小限制
                if(fileMedia.size){
                    var filesize = ((fileMedia.size/1024)/1024).toFixed(4);
                    var maxSize=_this.metafield.maxSize||_this.defaultMaxSize;
                    if(filesize>maxSize){
                        iview$Message.warning(`文件大小超过最大${maxSize}M限制`);
                        return false;
                    }
                }
                //文件类型限制
                if(fileMedia.name){
                    var filter=_this.metafield.filter||_this.defaultFilter;
                    filter=filter.toLowerCase();
                    var fileName=fileMedia.name;
                    fileName=fileName.toLowerCase();
                    var fileExtension=fileName.substr(fileName.lastIndexOf("."));
                    if(filter.indexOf(fileExtension)<0){
                        iview$Message.warning(`只允许${filter}类型的文件`);
                        return false;
                    }
                }
				formdatas.append("image", fileMedia);
				ax.post(Config.contextPath.uploadImg, formdatas, function(res){
                    _this.$emit('input',res);
                    _this.realPath=Config.contextPath.url +res;
				},null, {
                    showLoading:true,
					contentType: false,
					processData: false
				});

			}
        }
    };
</script>

