<template>
  <div class="clearfix">
    <div v-for="field in bodyFields" :key="field">
        <div v-if="rowModel[field].type=='options'" :class="'listSpan '+ rowModel[field].class">
            <span v-if="null!=item[field]" v-html="actionForOptions(item[field],rowModel[field],item)"></span>
            <span v-else>--</span>
        </div>
        <div v-if="rowModel[field].type=='refFieldTitleByDate'" :class="'listSpan '+ rowModel[field].class">
            <h5 v-if="null!=item[field]">
                <router-link  :to="{ name:rowModel[field].actionRouteName, query:actionBuildQueryForRefFieldTitleByDate(item,item[field],rowModel[field]) }">{{item[field][rowModel[field].refTitle] | formatdate}}</router-link>
            </h5>
            <h5 v-else>--</h5>
        </div>
        <div v-if="rowModel[field].type=='title'" :class="'listSpan '+ rowModel[field].class">
            <h5><b>
            <router-link class="colorgray" :to="{ name:rowModel[field].actionRouteName, params: {id:item.id}}" v-text="item[field]"></router-link>
            </b></h5>
        </div>
        <div v-if="rowModel[field].type=='imgTitle'" :class="'listSpan '+ rowModel[field].class">
          <span class="fl imgBox">
                <i>
                    <img v-if="rowModel[field].iconField && item[rowModel[field].iconField]" :src="contextPath + item[rowModel[field].iconField]" @error="nofind($event)" alt="">
                    <em>{{rowModel[field].titleField?item[rowModel[field].titleField].slice(0,1):(item.title?item.title.slice(0,1):'')}}</em>
                </i>
            </span>
            <div class="detailBox" >
                <h5>
                    <b v-if="rowModel[field].actionRouteName">
                        <router-link class="colorgray" :to="{ name:rowModel[field].actionRouteName, params: {id:item.id}}" v-text="item[field]"></router-link>
                    </b>
                    <b v-else-if="rowModel[field].actionFunc">
                        <a class="colorgray" @click = "rowModel[field].actionFunc(item)" v-html="rowModel[field].titleField?item[rowModel[field].titleField]:item.title"></a>
                    </b>
                    <b v-else v-html="rowModel[field].titleField?item[rowModel[field].titleField]:item.title">
                    </b>
                </h5>
                <p v-wordlimit="{length:rowModel[field].wordlimit,text:rowModel[field].descField?item[rowModel[field].descField]:item.description}"></p>
            </div>
        </div>
        <div v-if="rowModel[field].type=='text'" :class="'listSpan '+rowModel[field].class">
            <span v-if="rowModel[field].convertMap!=null" v-text="rowModel[field].convertMap[item[field]]"></span>
            <span v-else v-text="item[field]"></span>
        </div>
        <div v-if="rowModel[field].type=='textArea'" :class="'listSpan '+ rowModel[field].class">
            <textarea class="width100" v-if="rowModel[field].convertMap!=null" v-text="rowModel[field].convertMap[item[field]]"></textarea>
            <textarea class="width100" v-else v-text="item[field]"></textarea>
        </div>
        <div v-if="rowModel[field].type=='date'" :class="'listSpan '+ rowModel[field].class"><span >{{item[field] | formatdate}}</span></div>
        <div v-if="rowModel[field].type=='operation'" :class="'listSpan '+ rowModel[field].class">

            <div v-for="btn in rowModel[field].btns" style="display:inline-block;">
                <a v-if="btn.actionRouteName!=null" v-show="btn.show?btn.show(item):true" href="javascript:void(0)" class="btn" :title=" btn.text"
                    @click="actionFuncForRoute(item,btn)"><i :class="(btn.class&&btn.class.indexOf('ivu-icon')>-1)?btn.class:('iconfont ' + btn.class)"></i>
                </a>
                <a v-if="btn.actionUrl!=null || btn.actionFunc!=null || btn.resource != null" v-show="btn.show?btn.show(item):true" @click="actionFunc(item,btn)" href="javascript:void(0)" class="btn" :title="btn.text" ><i :class="(btn.class&&btn.class.indexOf('ivu-icon')>-1)?btn.class:('iconfont ' + btn.class)"></i></a>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
    module.exports = {
        props: ["rowModel","bodyFields","item"],
        data: function(){
            return {
                contextPath :Config.contextPath.url
            }
         },
        methods: {
            actionBuildQueryForRefFieldTitleByDate:function(item,itemValue,rowModel){
                var query=rowModel.query||{};
                query.refId=itemValue[rowModel.refId];
                var queryKeysMapping=rowModel.queryKeysMapping;
                if(!!queryKeysMapping){
                    _.forEach(queryKeysMapping,function(value,key){
                        query[key]=item[value];
                    });
                }
                return query;
            },
            actionForOptions:function(itemValue,rowModel,item){
                var options=rowModel.options;
                var value=itemValue;
                //第一种支持options映射，这里需要值是固定的枚举类型
                if(!!options){
                    _.forEach(options,function(option){
                        if(option.value===value){
                            value=option.text;
                        }
                    });
                }else if(_.isFunction(rowModel.render)){//第二种支持自定义render转换逻辑，提供render函数转换
                    value=rowModel.render(item);
                }
                return value;
            },
            actionFunc:function(item,btn){
                var _this=this;
                if(btn.actionType=="delete"){
                    iview$Modal.confirm({
                        title: '提示',
                        content: '确定删除吗?',
                        onOk: () => {
                            if(btn.actionUrl) {
                              ax.delete(Utils.urlPattern(btn.actionUrl,"id",item.id), null, function(res){
                                _this.$emit("reloadevt");
                              },null,{showLoading:true});
                            } else if(btn.resource) {
                                btn.resource.delete({id: item.id,cascade_delete:true}).then(function (re) {
                                  _this.$emit("reloadevt");
                                });
                            }
                        }
                    });
                }else if(btn.actionType=="postCommand"){
                    var actionFunc=btn.actionFunc;
                    var actionParams=[];
                    if(_.isFunction(actionFunc)){
                        actionParams.push(item);
                        actionFunc.apply({},actionParams);
                    }
                }
            },
            actionFuncForRoute:function(item,btn){
                var routeName=btn.actionRouteName;
                var params=jQuery.extend({id:item.id},btn.params||{});
                var queryKeysMapping=btn.queryKeysMapping;
                var query=btn.query||{};
                if(!!queryKeysMapping){
                    _.forEach(queryKeysMapping,function(value,key){
                        query[key]=item[value];
                    });
                }
                router.push({name:routeName,params:params,query:query});
            },
            //图片出错处理
            nofind: function ($event) {
                $($event.target).hide();
            }
        }
    };
</script>
<style lang="scss" scoped>
    .ivu-icon{
        font-size:16px;
    }
</style>
