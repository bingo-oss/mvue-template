//因为metaForm加入了容器布局，容器的children包含了子级表单组件
function getAllFormItems(metaForm){
    var formItems=[];
    _.each(metaForm.layout,function(formItem){
        formItems.push(formItem);
        if(formItem.isContainer&&formItem.children&&formItem.children.length>0){
            formItems=formItems.concat(formItem.children);
        }
    });
    return formItems;
}
//返回所有字段组件
function getAllFieldItems(metaForm){
    var formItems=[];
    _.each(metaForm.layout,function(formItem){
        if(formItem.isContainer&&formItem.children&&formItem.children.length>0){
            _.each(formItem.children,function(child){
                if(child.isDataField){
                    formItems.push(child);
                }
            });
        }else{
            if(formItem.isDataField){
                formItems.push(formItem);
            }
        }
    });
    return formItems;
}
//根据字段名称查找组件
function formItemByFieldName(metaForm,fieldName){
    if(!metaForm){
        return null;
    }
    var formItemResult=null;
    _.each(metaForm.layout,function(formItem){
        if(formItem.isContainer&&formItem.children&&formItem.children.length>0){
            _.each(formItem.children,function(child){
                if(child.isDataField&&child.dataField===fieldName){
                    formItemResult=child;
                    return false;//已经找到，跳出内部each循环
                }
            });
            if(formItemResult){//内部已经找到，跳出each循环
                return false;
            }
        }else{
            if(formItem.isDataField&&formItem.dataField===fieldName){
                formItemResult=formItem;
                return false;
            }
        }
    });
    return formItemResult;
}
//根据字段id查找组件
function getFormItemById(metaForm,id){
    if(!metaForm){
        return null;
    }
    var formItemResult=null;
    _.each(metaForm.layout,function(formItem){
        if(formItem.isContainer&&formItem.children&&formItem.children.length>0){
            _.each(formItem.children,function(child){
                if(child.isDataField&&child.id===id){
                    formItemResult=child;
                    return false;//已经找到，跳出内部each循环
                }
            });
            if(formItemResult){//内部已经找到，跳出each循环
                return false;
            }
        }else{
            if(formItem.isDataField&&formItem.id===id){
                formItemResult=formItem;
                return false;
            }
        }
    });
    return formItemResult;
}
//查找组件在布局中的位置索引，如果组件在容器组件里边，需要返回容器组件的index和在容器里的index
function indexOfFormItem(metaForm,formItem){
    var parentIndex=-1,childIndex=-1;
    for(let i=0;i<metaForm.layout.length;++i){
        let _formItem=metaForm.layout[i];
        parentIndex=i;
        if(_formItem.id===formItem.id){
            break;
        }
        if(_formItem.isContainer&&_formItem.children){
            for(let j=0;j<_formItem.children.length;++j){
                let _childFormItem=_formItem.children[j];
                if(_childFormItem.id===formItem.id){
                    childIndex=j;
                    break;
                }
            }
        }
        if(childIndex>-1){
            break;
        }
    }
    if(childIndex>-1){//返回容器组件的index和在容器里的index
        return [parentIndex,childIndex];
    }
    //直接返回index
    return parentIndex;
}
export default{
    getAllFormItems:getAllFormItems,
    getAllFieldItems:getAllFieldItems,
    formItemByFieldName:formItemByFieldName,
    getFormItemById:getFormItemById,
    indexOfFormItem:indexOfFormItem
}