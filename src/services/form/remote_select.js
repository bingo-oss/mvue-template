export default{
    props: ["metafield","value","validator","required","dataItems"],
    data: function(){
        return {
            selectedItem:null,//已经选择的项
        };
    },
    computed:{
        dataItemsMap:function(){
            var idField=this.getIdField();
            return _.keyBy(this.dataItems,idField);
        }
    },
    watch:{
        value:function(newV,oldV){
            if(newV){
                this.selectedItem=this.dataItemsMap[newV]||null;
            }else{
                this.selectedItem=null;
            }
        },
        dataItems:function(){
            if(this.value){
                this.selectedItem=this.dataItemsMap[this.value]||null;
            }
        }
    },
    methods: {
        onSelect:function(selectItem){
            var idField=this.getIdField();
            this.$emit('input',selectItem[idField]);
            this.$emit('onSelect',selectItem);
        },
        searchChange:function(keyword){
            this.$emit('searchChange',keyword);
        },
        getIdField:function(){
            return this.metafield.idField||"id";
        }
    }
};