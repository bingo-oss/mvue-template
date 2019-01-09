import homeBase from '../../router/home-base'; 
import appCtx from '../../libs/context';
import pageIndex from '../../templates/index';
function load(){
    return new Promise((resolve,reject)=>{
        Promise.all([
        import(/* webpackChunkName: "mvue-module-system" */'mvue-module-system')
        ]).then(([{default:system}])=>{
            if(!appCtx.getMvueToolkit().moduleManager.isAsyncModLoaded('system')){
                appCtx.getMvueToolkit().moduleManager.addAsync('system',system,appCtx,homeBase,pageIndex);
            }
            resolve();
        },()=>{reject();});
    });
}
export default {
    load
}
    