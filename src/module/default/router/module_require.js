function r(component){
    //异步加载每一个页面
    /*return function(resolve) {
        import('src/module/metad/view/' + component).then(function(m){
            resolve(m);
        });
    }*/
    return require('src/module/default/view/' + component);
}
module.exports={
    r:r
};