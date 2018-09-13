var glob = require('glob');
var nuxtUtils= require('./nuxt-utils');
const fs = require('fs')
var path = require('path')
var chokidar = require('chokidar');
var watched=false;
var changedQueue=[];
function smartRun(i){
    //console.log("--------"+i);
    //如果数据变化，先往变化队列推一条数据
    changedQueue.push(true);
    //记录当前变化队列的长度
    var length=changedQueue.length;
    //console.log(length+"-------")
    setTimeout(function(){
        //再次计算变化队列的长度，如果和之前的长度一致则表示等待时间到了，可以做相关操作了；
        //如果不一致说明数据还在变化，等到数据不再持续变化了再继续执行操作
        var _length=changedQueue.length;
        if(_length===length){
            changedQueue=[];
            run();
        }
    },500);
}
/**
 * 监听pages目录文件夹变化，重新生成路由
 */
function doWatch(pagesPath){
    var vueWatcher = chokidar.watch(pagesPath+'/**/*.vue', {ignoreInitial: true ,persistent: true});
    vueWatcher
        .on('add', path => smartRun(1))
        .on('unlink', path => smartRun(4));
    var dirWatcher = chokidar.watch(pagesPath+'/**', {ignoreInitial: true ,persistent: true});
    dirWatcher
        .on('addDir', path => smartRun(2))
        .on('unlinkDir', path => smartRun(3));
}
/**
 * 自动扫描 src/module/{moduleName}/pages/ 下的所有vue文件按文件名生成默认的路由
 */
function run(devMode){
    var pagesPath='src/module/*/pages';
    if(devMode&&!watched){
        watched=true;
        doWatch(pagesPath)
    }
    glob.sync(pagesPath).forEach(modulePageDir=>{
        //console.log("top:"+modulePageDir);
        const files = {};
        glob.sync(modulePageDir+'/**/*.vue').forEach(f=>{
            //console.log(f);
            const key = f.replace(/\.(js|vue)$/, '')
            if (/\.vue$/.test(f) || !files[key]) {
                files[key] = f.replace(/('|")/g, '\\$1')
            }
        });
        var filesValues=[];
        for(let key in files) {
            if (files.hasOwnProperty(key)) {
                const element = files[key];
                filesValues.push(element);
            }
        }
        //console.log(filesValues);
        var routes=nuxtUtils.createRoutes(
            filesValues,
            modulePageDir,
            modulePageDir
        )
        //console.log(JSON.stringify(routes));
        writeJs(modulePageDir,JSON.stringify(routes,(key,value)=>{
            if(key=="component"){
                return `##require_placeholder_begin##('${value}')##require_placeholder_end##`;
            }else{
                return value;
            }
        },'\t'))
    });

}
function writeJs(filePath,routes){
    routes=routes.replace(/\"##require_placeholder_begin##/g,'require').replace(/##require_placeholder_end##\"/g,'');
    var jsContent=`var autoRoutes=${routes}
export default autoRoutes`;
    var outputFile=path.join(__dirname,'../',filePath,'auto-routes.js')
    //console.log(outputFile)
    //console.dir(__dirname)
    fs.writeFileSync(outputFile,jsContent)
    console.log("##自动路由重写完成--_--##");
}
module.exports={
    run:run
}