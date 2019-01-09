const refmodsRoutes=[
    {
        name: 'async-mods-system',
        component: ()=> import(/* webpackChunkName: "mvue-module-system-entry" */'./system.vue'),
        path: '/async-mods/system'
    }
];
export default refmodsRoutes;
    