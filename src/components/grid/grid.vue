<template>
    <div class="grid-con">
        <div class="toolBar" v-if="showToolBar">
            <a href="javascript:void(0)" v-if="null!=createRouteName" class="btn btn-primary" @click="createFunc()"
               v-once><i class="iconfont icon-jiahao1"></i>{{createTitle}}</a>
            <a v-for="(toolbarBtn,index) in toolBarButtons" :key="index" href="javascript:void(0)"
               class="btn btn-primary toolbar-btn" @click="toolbarBtn.callback(checked,dataItems)"><i
                    class="iconfont icon-jiahao1" :class="(toolbarBtn.class&&toolbarBtn.class.indexOf('ivu-icon')>-1)?toolbarBtn.class:('iconfont ' + toolbarBtn.class)"></i>{{toolbarBtn.title}}</a>
            <span v-if="null!=searchFields" class="inputBox"><input class="form-control" v-model="search"
                                                                    :placeholder="searchPlaceholder" type="text"><i
                    class="iconfont icon-sousuo search"></i></span>
            <button @click="refresh()" type="button" class="ivu-btn ivu-btn-primary ivu-btn-circle ivu-btn-icon-only" title="刷新"><i class="ivu-icon ivu-icon-ios-refresh-empty" style="font-size:32px;"></i></button>
        </div>
        <div class="tableBox">
            <dl class="tableList" id="J-api">
                <dt class="clearfix">
                <div v-if="showMultiSelect&&!singleSelect" class="listSpan width5 textalignL"><input type="checkbox"
                                                                                      v-model="allChecked"/></div>
                <div v-for="(col,index) in innerHeaderColModel" :key="index" :class="'listSpan '+ col.class">
                    <div class="header-col-title">
                        <span>{{ col.text }}</span>
                        <sortbale v-model="sortbaleQueryOptions"
                                  :col="col"></sortbale>
                    </div>
                </div>
                </dt>
                <dd class="clearfix" v-for="(item,index) in filteredDataItems" :key="item.id">
                    <div v-if="showMultiSelect" class="listSpan width5 textalignL">
                        <input type="checkbox" :value="item.id" v-model="checked"
                               v-if="showMultiSelect&&showCheckFun(item)" @change="checkChange"/>
                        <span v-else> </span>
                    </div>
                        <rowitems @reloadevt="reload" :row-model="innerBodyColModel" :body-fields="innerBodyFields" :item="item"></rowitems>
                </dd>
                <dd v-if="nodata" class="textalignC">没有相应的数据!</dd>
            </dl>
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
  module.exports = {
    props: {
      columns:{
        type: Array
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
        default: false
      },
      "forceReload": {
        type: Boolean,
        required: false,
        default: false
      },
      "showToolBar": {
        type: Boolean,
        required: false,
        default: true
      },
      "toolBarButtons": {//showToolBar为true时，下面显示的button操作
        type: Array,
        required: false,
        default: function () {
          return [];
        }
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
      },
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
      "headerColModel": {
        type: Array,
        required: false,
      },
      "bodyFields": {
        type: Array,
        required: false
      },
      "bodyColModel": {
        type: Object,
        required: false
      },
      "createRouteName": {
        type: String,
        required: false
      },
      "createRouteParams": {
        type: Object,
        required: false
      },
      "createTitle": {
        type: String,
        required: false
      },
      "searchFields": {
        type: Array,
        required: false
      },
      "searchPlaceholder": {
        type: String
      },
      "gridParams": {
        type: Object
      }
    },
    data: function () {
      let _headerColModel=[];
      let _bodyFields=[];
      let _bodyColModel={};
      //简化grid的构造函数，通过columns构造其他三个内部渲染所需数据
      if(this.columns){
        _.each(this.columns,function(col,index){
          if(col.type==="operation"){
            col.key="__operation";
          }
          //构造bodyFields
          if(!col.key){
            console.log("未指定column的key");
            console.log(col);
            return;
          }
          _bodyFields.push(col.key);
          
          //构造headerColModel
          _headerColModel.push({
            text:col.title,
            class:`width${col.width?col.width:10} textalign${col.align=='left'?'L':(col.align=='center'?'C':'R')}`
          });
          //构造bodyColModel
          _bodyColModel[col.key]=_.extend({
            type:col.type,
            class:`width${col.width?col.width:10} textalign${col.align=='left'?'L':(col.align=='center'?'C':'R')}${index===0?' clearfix':''}`
          },col.params||{});
        });
      }else{
        if(this.headerColModel){
          _headerColModel=this.headerColModel;
        }else{
          console.log("未定义columns");
          return;
        }
        if(this.bodyColModel){
          _bodyColModel=this.bodyColModel;
        }else{
          console.log("未定义columns");
          return;
        }
        if(this.bodyFields){
          _bodyFields=this.bodyFields;
        }else{
          console.log("未定义columns");
          return;
        }
      }
      return {
        search: "",
        searchEmpty: [],
        dataItems: [],
        nodata: false,
        pageSize: this.pagerSizes[0],
        pageIndex: 1,
        totalCount: 0,
        pageCount: 1,
        checked: [],
        changedQueue: [],
        queryOptionsObject: {},
        sortbaleQueryOptions: {},

        innerHeaderColModel:_.cloneDeep(_headerColModel),
        innerBodyFields:_.cloneDeep(_bodyFields),
        innerBodyColModel:_.cloneDeep(_bodyColModel)
      }
    },
    watch: {
      search: function () {
        var _this = this;
        if (_this.pager) {
          //智能搜索包装器，在用户快速输入时先不查询，直到用户输入完毕再查询
          Utils.smartSearch(_this, function () {
            _this.pageIndex = 1;
            _this.reload(_.cloneDeep(_this.sortbaleQueryOptions));
          });
        }
      },
      queryResource: function () {
        this.reload();
      },
      sortbaleQueryOptions: {
        handler: function (val, oldVal) {


          log.i(val);



          var _this = this;
          if (_.isEmpty(val)) {
            _this.pageIndex = 1;
            _this.reload();
          } else {
            _this.pageIndex = 1;
            _this.reload(_.cloneDeep(val));
          }
        },
        deep: true
      }
    },
    computed: {
      allChecked: {//全选
        get: function () {
          return this.checkedCount == this.dataItems.length;
        },
        set: function (value) {
          if (value) {
            this.checked = this.dataItems.map(function (item) {
              return item.id
            });
          } else {
            this.checked = [];
          }
        }
      },
      checkedCount: {//选中的总数
        get: function () {
          return this.checked.length;
        }
      },
      filteredDataItems: function () {
        var _this = this;
        var searchFields = _this.searchFields;
        if (!searchFields) {
          return _this.dataItems;
        }
        var filteredItems = [];
        if (_this.pager) {//启用了分页，搜索应为远程搜索
          return _this.dataItems;
        } else {//未启用分页，本页面搜索
          _.each(_this.dataItems, function (item) {
            var result = false;
            jQuery.each(searchFields, function (i, searchField) {
              var contains = item[searchField].indexOf(_this.search) != -1;
              if (contains) {
                result = true;
                return false;
              }
            });
            if (!!result) {
              filteredItems.push(item);
            }
          });
        }
        return filteredItems;
      }
    },
    mounted: function () {
      var _this = this;

      _this.setfilteredData();
      _this.reload();
      _this.$watch('pageSize', function (newVal, oldVal) {
        if (newVal != oldVal) {
          _this.pageIndex = 1;
          _this.reload();
        }
      });
      _this.$watch('forceReload', function (newVal, oldVal) {
        //清空已选
        _this.checked=[];
        _this.reload();
      });
    },
    methods: {
      reload: function (params) {    //当有params.headerColSearch参数时为列表头上增加过滤条件
        var params = _.cloneDeep(params);
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

          if (params) {
            _.each(params, function (item, key) {       //取sortbaleQueryOptions  key和value  key值一般为 filters、orderby...
              var arr = [];
              _.each(item, function (value, name) {     // 为了方便连接数据转化为数组存储 因为数组有length 要判断是否为last做判断
                arr.push(value);
              });

              if (key == 'orderby') {
                arr.sort(function (a, b) {               // 处理排序的优先级 越后点的优先级越高 通过时间戳比较
                  var num1 = a.replace(/[^0-9]/ig, "");
                  var num2 = b.replace(/[^0-9]/ig, "");
                  var num = 0;  //默认值
                  if (num1 > num2) num = -1;
                  else if (num1 < num2) num = 1;
                  else num = 0;
                  return num;
                });
                _.each(arr, function (item, index) {       // 排序已正常 去掉时间戳
                  arr[index] = item.replace(/\s\{\d+\}/g, '');
                });

                for (var i = 0; i < arr.length; i++) {     //连接过滤数据
                  if (i == 0) {
                    _queryOptions[key] = arr[i];
                  } else {
                    _queryOptions[key] += "," + arr[i];
                  }
                }
              } else {
                for (var i = 0; i < arr.length; i++) {
                  if (i == 0) {
                    _queryOptions[key] = arr[i];
                  } else {
                    _queryOptions[key] += " and (" + arr[i] + ")";
                  }
                }
              }
            });
          }
          function _search(searchFields, value) {   //搜索逻辑公用方法
            var _filtersAdded = [];
            _.each(searchFields, function (sField) {
              _filtersAdded.push(sField + " like '%" + value.replace(/'/g, "") + "%'");
            });

            _filtersAdded = _filtersAdded.join(" or ");
            if (_queryOptions.filters) {
              _queryOptions.filters += " and (" + _filtersAdded + ")";
            } else {
              _queryOptions.filters = _filtersAdded;
            }
          }

          /*if (params) {  //参数时为列表上搜索逻辑
            //_search(params.searchFields, params.value)


          } else {
            if (_this.searchFields && _this.search) {    //总搜索逻辑
              _search(_this.searchFields, _this.search)
            }
          }*/

          if (_this.searchFields && _this.search) {    //总搜索逻辑
            _search(_this.searchFields, _this.search)
          }

        }
        if (!!_this.queryUrl) {//传的是查询url
          ax.get(_this.queryUrl, _queryOptions, function (rel, status, req) {
            _this.dataItems = rel;
            if (_this.pager) {
              _this.totalCount = _.toInteger(req.getResponseHeader("X-Total-Count"));
              _this.pageCount = _.ceil(_this.totalCount / _.toInteger(_this.pageSize));
              if (_this.pageCount == 0) {
                _this.pageCount = 1;
              }
            }
            if ((!rel) || rel.length == 0) {
              _this.nodata = true;
            } else {
              _this.nodata = false;
            }
            _this.$emit("dataloaded", _this);
          }, null, {
            showLoading: true
          });
        } else if (!!_this.queryResource) {//传的是vue-resource对象
          _this.queryResource.query(_queryOptions).then(function (resp) {
            _this.dataItems = resp.data;
            if (_this.pager) {
              _this.totalCount = _.toInteger(resp.headers.get("X-Total-Count"));
              _this.pageCount = _.ceil(_this.totalCount / _.toInteger(_this.pageSize));
              if (_this.pageCount == 0) {
                _this.pageCount = 1;
              }
            }
            if ((!_this.dataItems) || _this.dataItems.length == 0) {
              _this.nodata = true;
            } else {
              _this.nodata = false;
            }
            _this.$emit("dataloaded", _this);
          });
        }
      },
      setfilteredData: function () {   // 提取过滤条件数据
        var _this = this;
        var _bodyColModel = _this.innerBodyColModel;   // 提取过滤条件
        var _bodyFields = _this.innerBodyFields;
        for (var i = 0; i < _bodyFields.length; i++) {
          var _name = _bodyFields[i];
          var _hcm=_this.innerHeaderColModel[i];
          if (_bodyColModel[_name] && _bodyColModel[_name]["searchable"]) {
            _this.$set(_hcm, 'searchable', _name);
            if (_bodyColModel[_name]["searchable"]["filters"]) {
              _this.$set(_hcm, 'filters', _bodyColModel[_name]["searchable"]["filters"]);
            }
          }
          if (_bodyColModel[_name] && _bodyColModel[_name]["sortable"]) {
            _this.$set(_hcm, 'sortable', _name);
          }

          if (_bodyColModel[_name] && _bodyColModel[_name]["searchable"]) {
            _this.$set(_hcm, 'searchable', _name);
          }
          _bodyColModel[_name]["type"] && _this.$set(_hcm, 'type', _bodyColModel[_name]["type"]);  //导入类型
        }
      },
      createFunc: function () {
        var routeName = this.createRouteName;
        if (!routeName) {
          return;
        }
        var params = this.createRouteParams || {};
        router.push({name: routeName, params: params});
      },
      pageIndexOne: function () {
        if (this.pageIndex != 1) {
          this.pageIndex = 1;
          this.reload(_.cloneDeep(this.sortbaleQueryOptions));
        }
      },
      pageIndexPrevious: function () {
        if (this.pageIndex > 1) {
          --this.pageIndex;
          this.reload(_.cloneDeep(this.sortbaleQueryOptions));
        }
      },
      pageIndexNext: function () {
        if (this.pageIndex < this.pageCount) {
          ++this.pageIndex;
          this.reload(_.cloneDeep(this.sortbaleQueryOptions));
        }
      },
      pageIndexLast: function () {
        if (this.pageIndex != this.pageCount) {
          this.pageIndex = this.pageCount;
          this.reload(_.cloneDeep(this.sortbaleQueryOptions));
        }
      },
      refresh:function () {
        this.reload(_.cloneDeep(this.sortbaleQueryOptions));
      },
      checkChange:function(evt){
        if(this.singleSelect){
          var checkbox=evt.currentTarget;
          var isChecked=checkbox.checked;
          if(isChecked){
            this.checked=[checkbox.value];
          }
          //向外抛出单选事件
          var value=null;
          if(this.checked.length===1){
            value=this.checked[0];
          }
          this.$emit("singleSelectedChange",value);
        }
      }
    },
    components: {  //添加组件放到这里
      rowitems: require('./row_items.vue'),
      sortbale: require('./sortable.vue')
    }
  };
</script>
<style lang="scss" scoped>
    .ivu-poptip-body {
        padding: 0 !important;
    }

    .select-box {
        .ivu-poptip-body {
            padding: 0 0 !important;
            background: red;
        }
    }
    .listSpan{
        min-height: 1px;
    }
</style>
