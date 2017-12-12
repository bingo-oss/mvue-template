var baseServer=require("../metad/meta_config").baseServer;
var customActions = {
    newVersion: {method: 'POST', url: 'meta_form/new_version'},
    publish: {method: 'POST', url: 'meta_form/publish'},
    resourceUrl: {method: 'GET', url: 'meta_form/resource_url'},
    projectEngineBaseUrl: {method: 'GET', url: 'meta_form/engine_url'},
    getByShortId: {method: 'GET', url: 'meta_form/short{/id}'},
};
var $innerVueInst=new Vue({data:{showLoading:true}});
var resource=$innerVueInst.$resource('meta_form{/id}',null,customActions,{root:baseServer});
var formStatus={
    draft:0,
    published:1,
};
var nameCheckUrl=baseServer+"/meta_form/check_name";
//填单地址构造
function formFillUrl(projectId,formShortId){
    var origin=window.location.origin;//协议域名部分
    var pathname=window.location.pathname;//路径部分
    pathname=pathname.substr(0,pathname.lastIndexOf("/"));
    var baseUrl=origin+pathname+"/metaform.html#";
    var formFillUrl=`${baseUrl}/${projectId}/form/${formShortId}`;
    return formFillUrl;
};
//表单数据的操作对应的资源构造
function formDataResource(formId){
    return resource.resourceUrl({id:formId}).then(function({data}){
        var url = new URL(data);
        var pathname=_.trim(url.pathname,'/');
        var resourceName=pathname+'{/id}';
        var customActions = {
            count: {method: 'GET', url: pathname+'/count'},
        };
        return Vue.resource(resourceName,null,customActions,{root:url.origin});
    });
        
};
module.exports={
    $innerVueInst:$innerVueInst,
    $resource:resource,
    formStatus:formStatus,
    nameCheckUrl:nameCheckUrl,
    formFillUrl:formFillUrl,
    formDataResource:formDataResource,
    ignoreFields:["$data","id","createdBy","createdAt","updatedBy","updatedAt"]
};
