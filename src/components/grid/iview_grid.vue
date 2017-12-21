<template>
<div class="grid-con">
    <div class="toolBar" v-if="!toolbar.hide">
            <a v-for="(toolbarBtn,index) in toolbar.btns" :key="index" href="javascript:void(0)"
            class="btn btn-primary toolbar-btn" @click="toolbarBtn.callback.call($parent,checked,data)">
               <i class="iconfont icon-jiahao1"
               :class="(toolbarBtn.class&&toolbarBtn.class.indexOf('ivu-icon')>-1)?toolbarBtn.class:('iconfont ' + toolbarBtn.class)">
               </i>{{toolbarBtn.title}}</a>
            <span v-if="toolbar.quicksearch&&toolbar.quicksearch.fields" class="inputBox">
                <input class="form-control" v-model="quicksearchKeyword" :placeholder="toolbar.quicksearch.placeholder" type="text">
                <i class="iconfont icon-sousuo search"></i></span>
            <button @click="refresh()" type="button" class="ivu-btn ivu-btn-primary ivu-btn-circle ivu-btn-icon-only" title="刷新">
                <i class="ivu-icon ivu-icon-ios-refresh-empty" style="font-size:32px;"></i></button>
        </div>
    <div class="data-table-list">
        <Table :columns="innerColumns" :data="filteredData" @on-sort-change="handleSortChange">
        </Table>
    </div>
    <div class="tableBox-tool" v-if="pager">
        <div class="pagination form-inline">
            <a class="btn btn-default" :disabled="pageIndex<=1" @click="pageIndexOne">首页</a>
            <a class="btn btn-default" :disabled="pageIndex<=1" @click="pageIndexPrevious">上一页</a>
            <a class="btn btn-default" :disabled="pageIndex>=pageCount" @click="pageIndexNext">下一页</a>
            <a class="btn btn-default" :disabled="pageIndex>=pageCount" @click="pageIndexLast">尾页</a>
            <span class="form-group">
            <select class="form-control" v-model="pageSize">
                <option v-for="(s,index) in pagerSizes" :key="index" :value="s" :title="index" :selected="pageSize===s">
                    {{s}}
                </option>
            </select>
            </span>
            <span>总共{{totalCount}}条数据</span>
        </div>
    </div>
</div>
</template>
<script>
import controlTypeService from 'services/metaform/control_type_service';
import metabase from 'libs/metadata/metabase';
import  metaGrid from "libs/metadata/metagrid";
export default {
    props:{
      "metaEntity":{
          type: String,
          required: false
        },
        "pagerSizes": {
            type: Array,
            required: false,
            default: function () {
                return ["5", "10", "20", "50", "100"];
            }
        },
        "pager": {
            type: Boolean,
            required: false,
            default: true
        },
        "toolbar":{
            type:Object,
            default:function(){
                return {
                    hide:false,
                    btns:[],
                    quicksearch:{
                        fields:null,
                        placeholder:""
                    }
                };
            }
        },
        /*"forceReload": {
            type: Boolean,
            required: false,
            default: false
        },
        "showMultiSelect": {//全选框显示
            type: Boolean,
            required: false,
            default: false
        },
        "singleSelect": {//是否单选
            type: Boolean,
            required: false,
            default: false
        },
        "showCheckFun": {//每一行checkbox是否显示
            type: Function,
            required: false,
            default: function () {
            return true;
            }
        },*/
        "queryUrl": {//queryUrl和queryResource二选一
            type: String,
            required: false
        },
        "queryResource": {//代表vue-resource定义的resource，用来做数据查询
            type: Object,
            required: false
        },
        "queryOptions": {//queryUrl或者queryResource查询的参数，对应api query接口的参数，包括排序、分页等参数设置
            type: Object,
            required: false
        },
        "columns": {
            type: Array,
            required: true,
        },
    },
    data:function(){
        var _columns=this.convertColumns();
        return {
            innerColumns:_columns,
            data:[],//原始数据
            checked:[],//已经选择的数据
            quicksearchKeyword:"",//快捷查询输入的值
            changedQueue: [],//智能搜索的变化队列
            //begin 分页相关参数
            pageSize: this.pagerSizes[0],
            pageIndex: 1,
            totalCount: 0,
            pageCount: 1,
            //end 分页相关参数
            orderby:"",//只支持一个orderby，用户点击排序后将覆盖默认的排序规则
        };
    },
    computed:{
        filteredData:function(){//用来处理local和远程的数据过滤，目前通过pager参数为true指定为远程搜索
            var _this=this;
            if(this.pager){
                return this.data;
            }else{
                let _filteredData=[];
                _.each(this.data, function (item) {
                    var result = false;
                    _.each(_this.toolbar.quicksearch.fields, function (searchField) {
                        var contains = item[searchField].indexOf(_this.quicksearchKeyword) != -1;
                        if (contains) {
                            result = true;
                            return false;
                        }
                    });
                    if (!!result) {
                        _filteredData.push(item);
                    }
                });
                return _filteredData;
            }
        }
    },
    watch: {
      quicksearchKeyword: function () {
        var _this = this;
        if (_this.pager) {
          //智能搜索包装器，在用户快速输入时先不查询，直到用户输入完毕再查询
          Utils.smartSearch(_this, function () {
            _this.pageIndex = 1;
            _this.reload();
          });
        }
      },
    },
    mounted:function(){
        var _this=this;
        this.reload();
        _this.$watch('pageSize', function (newVal, oldVal) {
            if (newVal != oldVal) {
                _this.pageIndex = 1;
                _this.reload();
            }
        });
        /*_this.$watch('forceReload', function (newVal, oldVal) {
            //清空已选
            //_this.checked=[];
            _this.reload();
        });*/
    },
    methods:{
        reload: function () {
            var _this = this;
            if ((!_this.queryUrl) && (!_this.queryResource)) {
                console.log("请配置远程查询地址queryUrl或者queryResource");
                return;
            }
            var _queryOptions = _this.queryOptions ? _.cloneDeep(_this.queryOptions) : {}; //这里是克隆查询参数，避免查询参数污
            if (_this.pager) {//如果支持分页
                if (!_this.pageIndex) {
                    _this.pageIndex = 1;
                }
                _queryOptions.page = _this.pageIndex;
                _queryOptions.page_size = _this.pageSize;
                _queryOptions.total = true;
            }
            //快捷搜索条件添加
            if(_this.toolbar.quicksearch&&_this.toolbar.quicksearch.fields&&_this.quicksearchKeyword){
                let qsFilters = [];
                _.each(_this.toolbar.quicksearch.fields, function (sField) {
                    qsFilters.push(`${sField} like %${_this.quicksearchKeyword}%`);
                });
                qsFilters=qsFilters.join(" or ");
                if(_queryOptions.filters){
                    _queryOptions.filters=`${_queryOptions.filters} and (${qsFilters})`;
                }else{
                    _queryOptions.filters=qsFilters;
                }
            }
            //如果用户点击了排序，覆盖默认排序
            if(this.orderby){
                _queryOptions.orderby=this.orderby;
            }
            var dataPromise=null;
            if (!!_this.queryUrl) {//传的是查询url
                dataPromise=_this.$http.get(_this.queryUrl,{params:_queryOptions}).then(function(resp){
                    return resp;
                });
            }else if (!!_this.queryResource) {//传的是vue-resource对象
                dataPromise=_this.queryResource.query(_queryOptions).then(function (resp) {
                   return resp;
                });
            }
            dataPromise.then(function(resp){
                _this.data = resp.data;
                if (_this.pager) {
                    //获取总数
                    _this.totalCount = _.toInteger(resp.headers.get("X-Total-Count"));
                    //获取总页数
                    _this.pageCount = _.ceil(_this.totalCount / _.toInteger(_this.pageSize));
                    //总页数至少为1
                    if (_this.pageCount == 0) {
                        _this.pageCount = 1;
                    }
                }
                _this.$emit("dataloaded", _this);
            });
      },
      refresh:function () {//刷新列表
        this.reload();
      },
      //begin 分页相关方法
      pageIndexOne: function () {
        if (this.pageIndex != 1) {
          this.pageIndex = 1;
          this.reload();
        }
      },
      pageIndexPrevious: function () {
        if (this.pageIndex > 1) {
          --this.pageIndex;
          this.reload();
        }
      },
      pageIndexNext: function () {
        if (this.pageIndex < this.pageCount) {
          ++this.pageIndex;
          this.reload();
        }
      },
      pageIndexLast: function () {
        if (this.pageIndex != this.pageCount) {
          this.pageIndex = this.pageCount;
          this.reload();
        }
      },
      //end 分页相关方法
      //begin 转换columns
      convertColumns(){
          debugger;
        var _this=this;
        var _columns=[];
        var metaEntityObj=null;
        if(!_.isEmpty(_this.metaEntity)){
          metaEntityObj=metabase.findMetaEntity(_this.metaEntity);
        }
        _.each(this.columns,function(col){
            var _col=_.cloneDeep(col);
            var metaParams=col.metaParams ||{};
            var _col=_.omit(col,["metaParams"]);
            var metaField={};
            if(metaEntityObj!=null){
              metaField=metaEntityObj.findField(_col.key) || {};
            }
            metaField=_.extend(metaField,metaParams);
            var defaultCol=metaGrid.metaFieldToCol(metaField);
          _col=_.extend(defaultCol,_col);
          _columns.push(_col);
        });
        return _columns;
      },
      //end 转换columns
      //begin 远程排序
      handleSortChange({column,key,order}){
          if(order=="normal"){
              this.orderby=null;
          }else{
              this.orderby=`${key} ${order}`;
          }
          this.reload();
      },
      //end 远程排序
    }
}
</script>

<style lang="scss" scoped>
    .data-table-list{
        margin-top:10px;
        margin-bottom: 20px;
        width:100%;
    }
</style>

