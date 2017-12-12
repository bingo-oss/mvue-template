<template>
    <div class="sortable-box">
        <Poptip width="150" placement="bottom" class="header-col-search"
                v-if="inputSearchOn">
            <Icon type="search" class="search-icon header-col-icon-color"
                  :class="{'on': myResultCol.searchValue }"></Icon>
            <div slot="content" class="search-box">
                <Input size="small"
                       :placeholder="myResultCol.filter && myResultCol.filter.searchable && myResultCol.filter.searchable == true"
                       @on-change="searchChange($event,myResultCol)"></Input>
            </div>
        </Poptip>
        <Poptip width="348" placement="bottom" class="header-col-search"
                v-if="myResultCol.searchable && myResultCol.type == 'date' && !myResultCol.filters">
            <Icon type="search" class="search-icon header-col-icon-color"
                  :class="{'on': myResultCol.dateValue && myResultCol.dateValue[0]}"></Icon>
            <div slot="content" class="search-box">
                <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间范围"
                            style="width: 316px" @on-change="searchableDateChange"></DatePicker>
            </div>
        </Poptip>
        <Poptip width="50" placement="bottom" class="header-col-search select-box"
                v-if="myResultCol.searchable && (myResultCol.filters)">
            <Icon type="search" class="search-icon header-col-icon-color"
                  :class="{'on': (filterSelectOn !==null) }"></Icon>
            <div slot="content">
                <div class="ivu-table-filter-list">
                    <ul class="ivu-table-filter-list-single">
                        <li class="ivu-table-filter-select-item"
                            :class="{'ivu-table-filter-select-item-selected': index == filterSelectOn}"
                            v-for="(filtersItem, index) in myResultCol.filters"
                            @click="filterSelectChange(index, filtersItem)">
                            {{ filtersItem.title }}
                        </li>
                    </ul>
                </div>
            </div>
        </Poptip>
        <span class="ivu-table-sort header-col-sortable" v-if="myResultCol.sortable">
            <i class="ivu-icon ivu-icon-arrow-up-b" @click="asc(myResultCol)" :class="{'on':myResultCol.ascOn}"></i>
            <i class="ivu-icon ivu-icon-arrow-down-b" @click="desc(myResultCol)" :class="{'on':myResultCol.descOn}"></i>
        </span>
    </div>
</template>
<script>
  var moment = require('moment'); //处理时间相关
  module.exports = {
    props: {
      "col": {
        type: Object,
        required: true
      },
      "value": {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        myResultCol: {},
        myResultQueryOptions: {},
        colWatchOff: false,
        searchableDate: '',   //时间范围
        oldMyResultCol: {},  //对比queryOptions 是否包含自己 如果包含 替换新值
        filterSelectOn: null,  //当前选中filterSelect高亮
        filterSelectItem: null,  //存当前选中filterSelect
        inputSearchType: ['name', 'text', 'title', 'kind', 'imgTitle']
      };
    },
    computed: {
      inputSearchOn: function () {
        for (var i = 0; i < this.inputSearchType.length; i++) {
          if (this.inputSearchType[i] == this.myResultCol.searchable) {
            return true;
          }
        }
      }
    },
    watch: {
      'value': {
        handler: function (val, oldVal) {
          //if(this.myResultCol.ascOn) this.myResultCol.ascOn = false;
          //if(this.myResultCol.descOn) this.myResultCol.descOn = false;
        },
        deep: true
      },
      'col': {
        handler: function (val, oldVal) {
          this.myResultCol = _.cloneDeep(val);
          this.colWatchOff = true;
        },
        deep: true
      },
      'myResultCol': {
        handler: function (val, oldVal) {
          this.init();
        },
        deep: true
      },
      'myResultQueryOptions': {
        handler: function (val, oldVal) {

        },
        deep: true
      }
    },
    mounted: function () {
      var _this = this;
      eventBus.$on('clearOrderbyStatus', function () {    //清空  myResultCol.ascOn/descOn的状态 只允许一个orderby排序存在
        if (_this.myResultCol.ascOn) _this.myResultCol.ascOn = false;
        if (_this.myResultCol.descOn) _this.myResultCol.descOn = false;
        if (this.value && this.value.orderby) delete this.value.orderby;
          //if (_value.orderby) delete _value.orderby; //清空 orderby 只允许一个
      });
    },
    methods: {
      init: function () {
        var _this = this;
      },
      sortData: function () {  // 构造过滤数据
        var _this = this;
        var obj = {};
        var _value = _.cloneDeep(this.value);
      //var _value = {};
        var _myResultCol = _.cloneDeep(_this.myResultCol);          //处理日期返回数据构造
        var _name = _myResultCol.searchable;
        if (_myResultCol.dateValue && _myResultCol.dateValue != '' && _myResultCol.dateValue[0] && _myResultCol.dateValue[1]) {
          var timeArr = _.cloneDeep(_myResultCol.dateValue);
          var startTime = moment(timeArr[0]).format('x');
          var endTime = moment(timeArr[1]).format('x');
          var _name = _myResultCol.searchable;
          if (_value.filters) {
            _value.filters[_name] = _name + ' ge ' + startTime + ' and (' + _name + ' le ' + endTime + ')'
            //_value.filters = _name + ' ge ' + startTime + ' and (' + _name + ' le ' + endTime + ')'
          } else {
            _value.filters = {};
            _value.filters[_name] = _name + ' ge ' + startTime + ' and (' + _name + ' le ' + endTime + ')'
            //_value.filters = _name + ' ge ' + startTime + ' and (' + _name + ' le ' + endTime + ')';
          }
        }
        else if ( !_myResultCol.searchValue ) {
          if(_value.filters && _value.filters.updatedAt){
            delete _value.filters.updatedAt;
          }
        }
        if (_this.filterSelectItem && _this.myResultCol.searchable && (_this.myResultCol.filters)) {    //处理select 过滤
          var filtersQueryString = '';
          for (var i = 0; i < _this.filterSelectItem.filterMethod.length; i++) {
            var item = _this.filterSelectItem.filterMethod[i];
            if (typeof item != 'string' && $.isFunction(item)) {
              item = item();
            }
            if (i == 0) {
              filtersQueryString = item;
            } else {
              filtersQueryString += " and (" + item + ")";
            }
          }

          if(_value.filters){
            _value.filters[_name] = filtersQueryString;
          }else{
            _value.filters = {};
            _value.filters[_name] = filtersQueryString;
          }

          if (_this.filterSelectItem && _this.filterSelectItem.joinsMethod) {
            var joinsQueryString = '';
            for (var i = 0; i < _this.filterSelectItem.joinsMethod.length; i++) {
              var item = _this.filterSelectItem.joinsMethod[i];
              if (typeof item != 'string' && $.isFunction(item)) {
                item = item();
              }
              if (i == 0) {
                joinsQueryString = item;
              } else {
                joinsQueryString += " and (" + item + ")";
              }
            }
          }

          if (!(_value.filters && _value.filters[_name])) _value.filters = {};
          //if (!(_value.filters)) _value.filters = {};

          _value.filters[_name] = filtersQueryString;
          //_value.filters = filtersQueryString;

          if (_this.filterSelectItem && _this.filterSelectItem.joinsMethod) {
            _value.joins = {};
            _value.joins[_name] = joinsQueryString;
            //_value.joins = joinsQueryString;
          }
        } else if (_this.filterSelectItem == null && _this.filterSelectOn == null && _this.myResultCol.searchable && (_this.myResultCol.filters)) {
          var _name = _myResultCol.sortable;
          if (_value.filters && _value.filters[_name]) delete _value.filters[_name];
          //if (_value.filters) delete _value.filters;

        }
        if (_myResultCol.descOn) {   //处理升降排序
          var timeStamp = new Date().getTime();   // 用来做排序优先级处理  类似堆栈
          if (_myResultCol.type == 'date' || _myResultCol.type == 'title' || _myResultCol.type == 'text' || _myResultCol.type == 'imgTitle' || _myResultCol.type == 'name' || _myResultCol.type == 'options') { //根据type类型决定排序类型
            var _name = _myResultCol.sortable;
            if (_value.orderby) {
              if (_value.orderby) delete _value.orderby; //清空 orderby 只允许一个
              _value.orderby = {};
              _value.orderby[_name] = _name + ' desc {' + timeStamp + '}';   //{timeStamp} 排序处理完毕后需清除
              //_value.orderby = _name + ' desc {' + timeStamp + '}';
            } else {
              _value.orderby = {};
              _value.orderby[_name] = _name + ' desc {' + timeStamp + '}';
              //_value.orderby = _name + ' desc {' + timeStamp + '}';
            }
          }
        } else if (_myResultCol.ascOn) {
          if (_myResultCol.type == 'date' || _myResultCol.type == 'title' || _myResultCol.type == 'text' || _myResultCol.type == 'imgTitle' || _myResultCol.type == 'name' || _myResultCol.type == 'options') {
            var timeStamp = new Date().getTime();
            var _name = _myResultCol.sortable;

            if (_value.orderby) {
              if (_value.orderby) delete _value.orderby; //清空 orderby 只允许一个
              _value.orderby = {};
              _value.orderby[_name] = _name + ' asc {' + timeStamp + '}';
            } else {
              _value.orderby = {};
              _value.orderby[_name] = _name + ' asc {' + timeStamp + '}';
            }
          }
        } else {
          //var _name = _myResultCol.sortable;     ??写错了
          if ((_value.orderby) && (_value.orderby[_name])) delete _value.orderby[_name];
        }

        if (_myResultCol.searchValue && _myResultCol.searchValue != '') {     //处理搜索过滤
          if (this.inputSearchOn) {
            var _name = _myResultCol.searchable;
            if (_name == 'kind') {

              if (_value.filters) {
                _value.filters[_name] = 'k.title like ' + _myResultCol.searchValue.replace(/'/g, "");
              } else {
                _value.filters = {};
                _value.filters[_name] = 'k.title like ' + _myResultCol.searchValue.replace(/'/g, "");
              }
              if( _value.joins){
                _value.joins[_name] = 'kind k';
              }else{
                _value.joins = {};
                _value.joins[_name] = 'kind k';
              }

            } else {
              if (_value.filters) {
                _value.filters[_name] = _name + " like '%" + _myResultCol.searchValue.replace(/'/g, "") + "%'";
              } else {
                _value.filters = {};
                _value.filters[_name] = _name + " like '%" + _myResultCol.searchValue.replace(/'/g, "") + "%'";
              }
            }
          }
        } else if (_myResultCol.searchValue == '') {
          if (_value.filters && _value.filters[_name]) delete _value.filters[_name]
          if (_value.joins && _value.joins[_name]) delete _value.joins[_name]
        }
        _this.$emit('input', _.cloneDeep(_value));
      },
      asc: function (rel) {   //升序
        var _this = this;
        var _ascOn = _.cloneDeep(rel.ascOn);
        // this.clearOrderbyStatus = new Date().getTime();
        eventBus.$emit('clearOrderbyStatus');
        if (_ascOn) this.$set(this.myResultCol, 'ascOn', false)    //rel.ascOn = false  处理UI效果
        else _this.$set(this.myResultCol, 'ascOn', true);
        //_this.$set(_this.myResultCol, 'descOn', false);
        _this.sortData();
      },
      desc: function (rel) {  //降序
        var _this = this;
        var _desc = _.cloneDeep(rel.descOn);
        eventBus.$emit('clearOrderbyStatus');
        if (_desc) this.$set(this.myResultCol, 'descOn', false)  //UI效果
        else _this.$set(this.myResultCol, 'descOn', true);
        //this.$set(_this.myResultCol, 'ascOn', false);
        _this.sortData();
      },
      searchableDateChange: function (rel) {
        var _this = this;

        _this.$set(_this.myResultCol, 'dateValue', rel);


        _this.sortData();
      },
      searchChange: function ($event, rel) {
        var _this = this;
        var _value = $event.target.value;
        this.$set(rel, 'searchValue', _value);
        _this.sortData();
      },
      filterSelectChange: function (index, item) {      //  searchable select 变化
        var _this = this;
        if (index == _this.filterSelectOn) {
          _this.filterSelectItem = null;
          _this.filterSelectOn = null;
        } else {
          _this.filterSelectItem = item;
          _this.filterSelectOn = index;
        }
        _this.sortData();
      }
    }
  }
</script>
<style lang="scss">

    .select-box {
        .ivu-poptip-body {
            padding: 0;
        }
    }

    .sortable-box {
        display: inline-block;
    }

    .header-col-title {
        display: inline-block;
    }

    .header-col-search {
        margin-left: 6px;
        display: inline-block;
        .search-box {
            width: 100%;
        }
    }

    .header-col-icon-color {
        color: #bbbec4;
        cursor: pointer;
        transition: color .2s ease-in-out;
        &:hover {
            color: inherit;
        }
    }

    .on {
        color: #2d8cf0 !important;
    }
</style>
