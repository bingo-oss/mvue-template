const refmods=[
    {
        name:'mvue-components-idm',//全局唯一，用来import的npm模块库名称
        routePrefix:'idm',//全局唯一，用来唯一标志模块库的访问地址前缀，也是模块库的较短唯一标志
        async:false
    },
    {
        name:'mvue-module-system',//全局唯一，用来import的npm模块库名称
        routePrefix:'system',//全局唯一，用来唯一标志模块库的访问地址前缀，也是模块库的较短唯一标志
        async:true
    }
];
export default refmods;
    