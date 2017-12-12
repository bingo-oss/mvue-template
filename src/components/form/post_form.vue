<template>
	<form >
		<ul class="contentDailog">
			<slot></slot>
			<li>
        <Button type="text" @click="cancel()">取消</Button>
        <button class="btn btn-danger" type="button" v-if="action==actionType.edit" @click.stop.prevent="onDelete(model.id)">删除</button>
				<button class="btn btn-primary" type="button"  @click.stop.prevent="onSubmit()" :disabled="notValid" :class="{'btnDisable': notValid}">确定</button>
			</li>
		</ul>
	</form>
</template>
<script>
	module.exports = {
		props:{
			action:String,
			id:String,
			model:Object,
			notValid:Boolean,
			resourceService:Object,
			saveBackRouter:{type:[String,Object]},
			saveBackPathIdName:{type:String},//指定保存后作为id传入路由的参数的名字
			deleteBackRouter:{type:[String,Object]},
			deleteConfig:{
				type:Object,
				default:function(){
					//cascade:true 表示级联删除所有相关数据
					//tips:"是否删除" 表示删除的提示语
					return {}
				}
			},
			notUpdatedFields:Array,
			notSavedFields:Array,
			beforeSubmit: {
				type: Function,
				default: function () {}
			},
			validator:Object
		},
		data:function(){
			return {
				actionType:Config.actionType
			}
		},
		methods: {
			onSubmit:function(){
				var _this=this;
				if(this.validator){
					var promiseResult = this.validator.validateAll(this.model);
					promiseResult.then(function (res) {
						_this.doSave();
					}).catch(function (res) {

					});
				}else{
					this.doSave();
				}
			},
			doSave: function(e){
				var httpUrl = [];
				var _this = this;
				if(_this.notValid){
					return;
				}
				if(_this.beforeSubmit){
					_this.beforeSubmit(_this.model);
				}
				if(_this.action=="create"){
					var copyModel=_this.model;
					if(_this.notSavedFields&&_this.notSavedFields.length){
						copyModel=_.cloneDeep(_this.model);
						_.each(_this.notSavedFields,function(v){
							if(_.has(copyModel,v)){
								delete copyModel[v];
							}
						});
					}
					this.resourceService.save({id: ""}, copyModel).then(function(response){
						iview$Message.success('创建成功');
						if(!!_this.saveBackRouter){
							if(_.isString(_this.saveBackRouter)){
								var params={};
								if(_this.saveBackPathIdName){
									params[_this.saveBackPathIdName]=response.data.id;
								}else{
									params.id=response.data.id;
								}
								router.replace({ name:_this.saveBackRouter,params:params});
							}else{
								router.replace(_this.saveBackRouter);
							}
						}
					});
				}else if(_this.action=="edit"){
					var copyModel=Utils.reduceModelForUpdate(_this.model,_this.notUpdatedFields);
					this.resourceService.update({id:_this.model.id}, copyModel).then(function(response){
						iview$Message.success('编辑成功');
					});
				}
			},
      //返回
      cancel: function(){
        router.go(-1);
      },
			onDelete: function(id){
				var _this = this;
				var dc=this.deleteConfig||{};
				var delParams={id:_this.model.id};
				if(dc.cascade){//级联删除参数添加
					delParams.cascade_delete=true;
				}
				var tips=dc.tips||'确定删除吗?';
				iview$Modal.confirm({
                    title: '提示',
                    content: tips,
                    onOk: () => {
                        _this.resourceService.delete(delParams).then(function(res){
							if(_.isString(_this.deleteBackRouter)){
                                iview$Message.success('删除成功');
								router.replace({ name:_this.deleteBackRouter});
							}else{
								router.replace(_this.deleteBackRouter);
							}
						});
                    }
                });
			}
		}
	};
	</script>
