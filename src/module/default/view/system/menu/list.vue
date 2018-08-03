<template>
    <div class="bvue-page">
        <b-childheader :title="childheader.title" :showBack="false" ></b-childheader>
        <div class="bvue-page-boody">
            <b-list ref="listInst" :columns="columns" :query="query" :toolbar="toolbar" :filters="filters" :default-sort="defaultSort"></b-list>
        </div>
    </div>
</template>
<script>
    import { menuService, leapQueryConvertor, dateRender } from "mvue-components";
    export default {
        data() {
            var _this = this;
            return {
                childheader: {
                    title: "菜单管理"
                },
                columns: [
                    {
                        type: 'index',
                        width: 50,
                        align: 'center'
                    },
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        sortable: 'custom',//支持排序，需要reload实现
                        key: 'title',
                        width: 200,
                        render: (h, params) => {
                            var recordId = params.row.id;
                            //标题列可以用render函数实现
                            return h('div', {
                                on: {
                                    click: () => {
                                        _this.$router.push({
                                            name: "system.admin.menu.edit",
                                            params: { id: recordId }
                                        });
                                    }
                                }
                            }, [
                                    h('a', {
                                        style: {
                                            marginRight: '5px'
                                        }
                                    }, params.row[params.column.key])
                                ]);
                        }
                    },
                    {
                        title: 'Key',
                        key: 'name',
                        width: 200,
                    },
                    {
                        title: '访问地址',
                        key: 'url'
                    },
                  {
                    title: '排序',
                    key: 'displayOrder',
                    width: 80,
                    sortable: 'custom'
                  },
                    {
                        title: '状态',
                        key: 'status',
                        width: 120,
                        render: (h, params) => {
                            var fieldVal = params.row[params.column.key];
                            var desc = fieldVal !== 0 ? '启用' : '禁用';
                            return h("span", desc);
                        },
                        filters: [
                            {
                                label: '启用',
                                value: 1
                            },
                            {
                                label: '禁用',
                                value: 0
                            }
                        ],
                        filterMultiple: false,//单选过滤
                        filterRemote: (selectedValues) => {//远程过滤，如果定义了远程过滤，本地过滤会失效
                            //修改过滤条件
                            _this.filters.rules.status.value = selectedValues[0];
                            //重新加载数据
                            _this.$refs.listInst.doReload();
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createdAt',
                        width: 200,
                        render: dateRender('YYYY-MM-DD HH:mm:ss')
                    }
                ],
                toolbar: {
                    btnSizeBeforeMore: 2,
                    quicksearch: {
                        fields: ["title", "name"],
                        placeholder: "输入关键字搜索"
                    },
                    btns: [
                        {
                            title: "添加",
                            icon: "plus",
                            onclick(ctx) {
                                _this.$router.push({
                                    name: "system.admin.menu.create"
                                });
                            }
                        },
                        {
                            title: "删除",
                            icon: "ios-trash",
                            disabled(ctx) {
                                return !(ctx.selectedItems && ctx.selectedItems.length === 1);
                            },
                            onclick(ctx) {
                                var row = ctx.selectedItems[0];
                                _this.$Modal.confirm({
                                    title: '提示',
                                    content: '删除后将无法在导航显示，确定删除吗?',
                                    onOk: () => {
                                        let id = row.id;
                                        menuService().delete({ id: id }).then(function (re) {
                                            _this.$refs.listInst.doReload();
                                        });
                                    },
                                    onCancel: () => {
                                    }
                                });
                            }
                        }
                    ]
                },
                //查询过滤条件
                filters: {
                    op: "and",
                    rules: {
                        status: {
                            op: "eq",
                            value: ""
                        }
                    }
                },
                defaultSort: { key: 'createdAt', order: 'desc' }
            };
        },
        methods: {
            query(ctx) {
                //调用leap查询转换器，获取兼容的数据格式
                return leapQueryConvertor.exec(menuService(), ctx);
            }
        }
    }
</script>
