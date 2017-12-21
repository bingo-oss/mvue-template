import metabase from 'libs/metadata/metabase'
import constants from 'services/metaform/constants'
export default{
    data:function(){
        var entityName=this.$route.params.entityName;
        var metaEntity=metabase.findMetaEntity(entityName);
        var model=_.cloneDeep(metaEntity.defaultModel);
        return {
            model:model,
            entityName:entityName
        };
    },
    methods:{
        //表单记录扩展数据填充，如选择用户之后用户名称存储、选项类型其他选项对应的填写值等
        exDataChanged:function(newValue,dataField,exDataKey){
            if(dataField&&exDataKey){
                let rkey=constants.entityModelRedundantKey;
                this.model[rkey]=this.model[rkey]||{};
                this.model[rkey][dataField]=this.model[rkey][dataField]||{};
                this.model[rkey][dataField][exDataKey]=this.model[rkey][dataField][exDataKey]||{};
                this.model[rkey][dataField][exDataKey]=newValue;
            }
        }
    }
}