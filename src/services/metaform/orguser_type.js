var orgUserTypes={
    SingleUserSelect:{ 
        id: "SingleUserSelect", 
        title: "用户选择", 
        icon:"ivu-icon ivu-icon-ios-people"
    },
    SingleOrgSelect:{ 
        id: "SingleOrgSelect", 
        title: "部门选择", 
        icon:"ivu-icon ivu-icon-network" 
    },
    MultiUserSelect:{ 
        id: "MultiUserSelect", 
        title: "用户多选", 
        icon:"ivu-icon ivu-icon-ios-people",
        hidden:true
    },
    MultiOrgSelect:{ 
        id: "MultiOrgSelect", 
        title: "部门多选", 
        icon:"ivu-icon ivu-icon-network",
        hidden:true 
    }
};
var orgUserComponentParams={
    SingleUserSelect:{
    },
    SingleOrgSelect:{
    },
    MultiUserSelect:{
    },
    MultiOrgSelect:{
    }
};
function accept(componentType){
    return !!orgUserTypes[componentType];
}
//componentType对应的可切换的组件集合
function switchableComponents(componentType){
    if(orgUserTypes.SingleUserSelect.id===componentType){
        return [
            {
                id:orgUserTypes.MultiUserSelect.id,
                title:'用户多选'
            }
        ];
    }else if(orgUserTypes.MultiUserSelect.id===componentType){
        return [
            {
                id:orgUserTypes.SingleUserSelect.id,
                title:'用户单选'
            }
        ];
    }else if(orgUserTypes.SingleOrgSelect.id===componentType){
        return [
            {
                id:orgUserTypes.MultiOrgSelect.id,
                title:'部门多选'
            }
        ];
    }else if(orgUserTypes.MultiOrgSelect.id===componentType){
        return [
            {
                id:orgUserTypes.SingleOrgSelect.id,
                title:'部门单选'
            }
        ];
    }
    return false;
}
function formatData(componentType,item,metaField){
    let fieldName=metaField.name;
    let origin=item[fieldName];
    if(!origin){
        return "";
    }
    var $data=(item.$data&&item.$data[fieldName])||{};
    var result="";
    if(orgUserTypes.SingleUserSelect.id===componentType){
        result= $data.user&&$data.user[origin]&&$data.user[origin].name;
        result=result||origin;
    }else if(orgUserTypes.MultiUserSelect.id===componentType){
        let userNames=[];
        _.each(origin,function(id){
            let name=$data.user&&$data.user[id]&&$data.user[id].name;
            name=name||id;
            userNames.push(name);
        });
        result= userNames.join(",");
    }else if(orgUserTypes.SingleOrgSelect.id===componentType){
        result= $data.organization&&$data.organization[origin]&&$data.organization[origin].name;
        result=result||origin;
    }else if(orgUserTypes.MultiOrgSelect.id===componentType){
        let orgNames=[];
        _.each(origin,function(id){
            let name=$data.organization&&$data.organization[id]&&$data.organization[id].name;
            name=name||id;
            orgNames.push(name);
        });
        result= orgNames.join(",");
    }
    return result;
}
export default{
    types:orgUserTypes,
    accept:accept,
    switchableComponents:switchableComponents,
    formatData:formatData
}