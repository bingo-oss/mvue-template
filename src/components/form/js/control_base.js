import controlTypeService from './control_type_service';
export default {
    props:{
        formItem:{
            type:Object,
            required:true
        },
        mode:{
            type:String,
            default:controlTypeService.controlMode.normal
        },
        validator:{
            type:Object
        },
        paths:{
            type:Object,
            default:function(){
                return {};
            }
        }
    },
    data:function(){
        return {
            controlTypeService:controlTypeService
        };
    },
    mounted:function(){
        //用来将默认空值，填充到表单的formData中，否则无法验证
        if(!this.value){
            this.$emit('input',null);
        }else if(this.value&&this.value.length==0){
            this.$emit('input',[]);
        }
    },
    computed:{
        labelWidth:function(){
            let lwidth=this.formItem.componentParams.horizontalLayoutLabelWidth;
            return lwidth+"%";
        },
        controlWidth:function(){
            let lwidth=this.formItem.componentParams.horizontalLayoutLabelWidth;
            let rwidth=100-_.toInteger(lwidth);
            return rwidth+"%";
        },
        disabled:function(){
            return this.mode!==controlTypeService.controlMode.normal;
        }
    }
}