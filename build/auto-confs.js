var glob = require('glob')
const fs = require('fs')
var path = require('path')
function run(pagesPath,ignoreFiles){
    var outputFile=path.join(__dirname,'../',pagesPath,'auto-page-confs.js')
    const files = {};
    glob.sync(pagesPath+'/**/*.js',{ignore:ignoreFiles}).forEach(f=>{
        var key = f.substr(f.indexOf('/pages/'));
        key = key.replace(/\.(js)$/, '');
        if (!files[key]) {
            files[key] = `##require_placeholder_begin##('${f}')##require_placeholder_end##`
        }
    });
    var fileJson=JSON.stringify(files,null,'\t').replace(/\"##require_placeholder_begin##/g,'require').replace(/##require_placeholder_end##\"/g,'.default');
    jsContent=`const confs=${fileJson}`;
    jsContent+=`\r\nexport default confs`
    fs.writeFileSync(outputFile,jsContent)
    console.log("##自动页面配置生成完成--_--##");
};
module.exports={
    run:run
}