import metabase from 'libs/metadata/metabase'
import constants from 'services/metaform/constants'
export default{
    data:function(){
        var entityName=this.$route.params.entityName||this.getEntityName();
        var metaEntity=metabase.findMetaEntity(entityName);
        var model=_.cloneDeep(metaEntity.defaultModel);
        return {
            dataResource:metaEntity.dataResource(),
            model:model,
            entityName:entityName,
            metaEntity:metaEntity
        };
    },
    mounted:function(){
        //编辑模式,从后台获取模型数据
        var _this=this;
        if(this.$route.params.id){
            this.dataResource.get({id:this.$route.params.id}).then(function({data}){
                _.each(_this.model,function(value,key){
                    _this.model[key]=data[key];
                });
            });
        }
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
        },
        onCreated(){
            router.push({
                name:'defaultEditForm',
                params:{
                    entityName:this.entityName,
                    id:this.$refs.form.id
                }
            });
        },
        onDeleted(){
            router.push({
                name:'defaultEntityList',
                params:{
                    entityName:this.entityName
                }
            });
        },
        setEntityName(entityName){
            this._entityName=entityName;
            return {entityName:entityName};
        },
        getEntityName(){
            return this._entityName;
        }
    }
}