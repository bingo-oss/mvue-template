<template>
  <div>
    <childheader :show="header"></childheader>
    <div class="pageMain">
      <grid ref="gridList"
            :meta-entity="'User'"
            :query-resource="queryResource" :query-options="queryOptions"
            :columns="columns"
            :pager="pager"
            :pager-sizes="pagerSizes"
            :toolbar="toolbar"
      >
      </grid>
    </div>
  </div>
</template>
<script>
  var metaEntityResource=require("services/security/user_service").$resource;
  module.exports = {
    data:function(){
      return {
        header: {
          title: "用户管理",
          description: "显示及维护系统内的所有用户",
          showBack: false
        },
        pager:true,
        pagerSizes:[10,20,50],
        queryResource:metaEntityResource,
        queryOptions:{"orderby":"updatedAt desc"},
        columns:[
          {type:"index",width:"50px"},
          {key:"name"},
          {key:"loginName"},
          {key:"gender"},
          {key:"updatedAt"},
          {title:"具体操作",width:220,align:"center",metaParams:{
              type:"operation",
              btns:[
                {
                  text: "编辑",
                  class: "icon-bianji",
                  actionFunc: function (params) {
                    var item = params.row;
                    router.push({name: "entityEdit", params: {entityId: item.id, prjId: projectId}});
                  }
                },
                {
                  text:"删除",
                  class:"ivu-icon ivu-icon-trash-a",
                  actionFunc:function(params){
                    var _self=this;
                    var item=params.row;
                    iview$Modal.confirm({
                      title: '提示',
                      content: '确定删除吗?',
                      onOk: () => {
                        metaEntityResource.delete({id: item.id,cascade_delete:true}).then(function (re) {
                          _self.grid.reload();
                        });
                      }
                    });
                  }
                }
              ]
            }},
        ],
        toolbar:{
          btns:[
            {
              title:"新建",
              icon:"plus-round",
              callback:function(checked,dataItems){
                router.push({name:"entityCreate",params:{prjId:projectId}});
              }
            }
          ],
          quicksearch:{
            fields:["name","loginName"],
            placeholder:"根据名称搜索"
          }
        }
      }
    },
    mounted: function () {

    },
    components:{
      grid:require('components/grid/iview_grid.vue'),
      childheader:require('components/childheader.vue'),
    }
  };
</script>

