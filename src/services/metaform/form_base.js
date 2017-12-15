//表单预览，表单填写相关的公共功能
import controlTypeService from 'services/metaform/control_type_service';
import metaFormService from 'services/metaform/meta_form_service';
import metaFormUtils from 'services/metaform/metaform_utils';
var URL = require('url-parse');
var metaFormResource=metaFormService.$resource;
var formStatus=metaFormService.formStatus;
export default {
    data:function(){
        return {
            resourceUrl:null,
            formResource:null,//表单数据操作对应的vue-reource对象，用于标准的rest api crud等操作
            projectEngineBaseUrl:null,//项目部署engine的基础访问地址
            uploadUrl:null,//上传下载对应的基础路径
            metaForm:null,
            formStatus:formStatus,
            formData:{$data:{}},
            mode:controlTypeService.controlMode.normal,//["design","normal"],design设计模式，组件不可操作;normal普通模式，可以填写数据
            //begin 处理脚本相关data定义
            scriptModel:{
                formDataCreated:null,//(formData)
                beforeSave:null,//(formData)
                afterSave:null//(formData)
            },
            //end 处理脚本相关data定义
        };
    },
    watch:{
        formData:{
            handler:function(){
                this.doValidation();
            },
            deep:true
        }
    },
    mounted:function(){
        let formShortId=this.$route.params.formShortId;
        let formId=this.$route.params.formId;
        let projectId=this.$route.params.prjId;
        let _this=this;
        var metaFormPromise=null;
        if(formShortId){//发布模式，发布之后表单访问地址是一样，通过表单公共的shortId获取最新发布的表单
            metaFormPromise=metaFormResource.getByShortId({id:formShortId,resolve:true})
            .then(function({data}){
                return data;
            });
        }else if(formId){//预览模式
            metaFormPromise=metaFormResource.get({id:formId,resolve:true})
            .then(function({data}){
                return data;
            });
        }
        if(metaFormPromise){
            metaFormPromise.then(function(data){
                //先显示所有的组件，因为默认组件的hidden属性不存在，不设置的话hidden属性监听不到
                var dataFields=metaFormUtils.getAllFieldItems(data);
                _.each(dataFields,function(item){
                    item.hidden=false;
                });
                _this.metaForm=data;
                //处理选择某个选项时，显示和隐藏某些组件逻辑
                _this.handleFieldOptionsToggle();
                //处理表单的脚本
                _this.handleFormScript();
                //对于已发布的表单，构造表单数据对应的rest操作对象
                if(_this.metaForm.status===formStatus.published){
                    metaFormResource.resourceUrl({id:_this.metaForm.id}).then(function({data}){
                        _this.resourceUrl=data;
                        //由于验证唯一性需要表单数据资源的query url，必须先从后端获取
                        _this.initValidation();
                    });
                    metaFormService.formDataResource(_this.metaForm.id).then(function(formDataResource){
                        _this.formResource=formDataResource;
                        //如果是编辑或者查看，需要获取表单数据
                        let dataId=_this.$route.params.dataId;
                        if(dataId){
                            _this.formResource.get({id:dataId}).then(function({data}){
                                _this.formData=data;
                                _this.formDataCreated();
                            });
                        }
                    });
                    metaFormResource.projectEngineBaseUrl({id:projectId}).then(function({data}){
                        _this.projectEngineBaseUrl=data;
                        _this.uploadUrl=data+"/api/stream";
                    });
                }else{
                    _this.formDataCreated();
                }
            },function({data}){
                iview$Modal.info({
                    title:"提示",
                    content:"获取表单信息失败，请联系管理员"
                });
            });
        }else{
            iview$Modal.info({
                title:"提示",
                content:"未指定表单id"
            });
        }
    },
    methods:{
        //begin 处理脚本
        handleFormScript(){
            var logistics=this.metaForm.logistics;
            if(logistics.script){
                let fun= new Function(logistics.script);
                fun.call(this);
            }
        },
        setValue(fieldName,newValue){//设置fieldName字段的值为newValue
            this.formData[fieldName]=newValue;
        },
        getValue(fieldName){//获取fieldName字段的值
            return this.formData[fieldName];
        },
        showField(fieldName){//显示fieldName字段
            var formItem=metaFormUtils.formItemByFieldName(this.metaForm,fieldName);
            if(formItem){
                formItem.hidden=false;
            }
        },
        hideField(fieldName){//隐藏fieldName字段
            var formItem=metaFormUtils.formItemByFieldName(this.metaForm,fieldName);
            if(formItem){
                formItem.hidden=true;
            }
        },
        formDataCreated(){//表单数据初始化后
            if(this.scriptModel&&_.isFunction(this.scriptModel.formDataCreated)){
                this.scriptModel.formDataCreated.call(this,this.formData);
            }
        },
        beforeSave(){//表单数据提交前
            if(this.scriptModel&&_.isFunction(this.scriptModel.beforeSave)){
                return this.scriptModel.beforeSave.call(this,this.formData);
            }
            return true;
        },
        afterSave(){//表单数据提交后
            if(this.scriptModel&&_.isFunction(this.scriptModel.afterSave)){
                this.scriptModel.afterSave.call(this,this.formData);
            }
        },
        //end 处理脚本
        //begin 处理选择某个选项时，显示和隐藏某些组件逻辑
        handleFieldOptionsToggle:function(){//处理选择某个选项时，显示和隐藏某些组件逻辑
            var logistics=this.metaForm.logistics;
            var _this=this;
            if(logistics.optionsToggleComponentsConfig){
                //遍历每一个单选项配置的逻辑
                _.each(logistics.optionsToggleComponentsConfig,function(value,key){
                    let curFormItem=metaFormUtils.getFormItemById(_this.metaForm,key);
                    //如果此单选项组件存在
                    if(curFormItem){
                        //监听单选项的值变化，从而显示和隐藏其他组件
                        _this.$watch('formData.'+curFormItem.dataField,function(newV,oldV){
                            //公共可见的字段
                            let commonVisibleFields=value.optionsToggleCommonShowFields;
                            //选项特殊的可切换字段
                            let visibleFields=value.toggleSetting[newV];
                            if(visibleFields){
                                let dataFields=metaFormUtils.getAllFieldItems(_this.metaForm);
                                _.each(dataFields,function(fi,index){
                                    if(fi.id===curFormItem.id){
                                        fi.hidden=false;
                                    }else if(_.includes(visibleFields,fi.id)||_.includes(commonVisibleFields,fi.id)){
                                        fi.hidden=false;
                                    }else{
                                        fi.hidden=true;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },
        //end 处理选择某个选项时，显示和隐藏某些组件逻辑
        initValidation: function () {
            var formItems=metaFormUtils.getAllFieldItems(this.metaForm);
            var _this=this;
            _.each(formItems,function(formItem){
                if(formItem.isDataField){
                    var fieldName=formItem.dataField;
                    var params=formItem.componentParams;
                    //必填
                    var rule={};
                    if(params.required){
                        rule.required=true;
                    }
                    //唯一性校验
                    if(params.unique){
                        rule.verify_field_unique=[
                            `query:${_this.resourceUrl}`,
                            fieldName,
                            {},
                            _this.$route.params.dataId
                        ]
                    }
                    //验证规则
                    if(params.validation
                        &&params.validation.validate
                        &&params.validation.rule
                        &&params.validation.rule.pattern){
                        rule.regex=[params.validation.rule.pattern];
                    }
                    //长度验证
                    if(params.limitLength&&params.limitLength.limit){
                        if(params.limitLength.max>0){
                            rule.max=[params.limitLength.max];
                        }
                        if(params.limitLength.min>0){
                            rule.min=[params.limitLength.min];
                        }
                    }
                    //数值范围
                    if(params.limitRange&&params.limitRange.limit){
                        if(params.limitRange.max>0){
                            rule.max_value=[params.limitRange.max];
                        }
                        if(params.limitRange.min>0){
                            rule.min_value=[params.limitRange.min];
                        }
                    }
                    //小数点限制
                    if(params.decimal){
                        //小数
                        if(params.decimal.isAllowed){
                            rule.decimal=[params.decimal.digits];
                        }else{//不含小数部分
                            rule.decimal=[];
                        }
                    }
                    //负数限制
                    if(params.allowNegative===false){
                        //没有定义最小值或者最小值设置成负数，设置最小值为0
                        if((!rule.min_value)||(_.startsWith(rule.min_value,"-"))){
                            rule.min_value=["0"];
                        }
                    }
                    if(!_.isEmpty(rule)){
                        //对于需要验证的属性，如果没设置值，默认设置为null，否则无法进行校验
                        /*if(!_.has(_this.formData,fieldName)){
                            _this.formData[fieldName]=null;
                        }*/
                        _this.$validator.attach(fieldName, rule);
                    }
                }
            });
        },
        doValidation:function(callback){
            var _this=this;
            //启用智能校验
            Utils.smartValidate(_this,this.formData,this.$validator,function(){
                callback&&callback();
            });
        }
    },
    components:{
        logout:require('components/logout'),
        navback:require('components/nav_back'),
    }
}
