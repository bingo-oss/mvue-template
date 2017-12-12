<template>
    <li class="form-group">
        <label :for="metafield.name" v-once>{{metafield.label}}:</label>
        <div @click="focusNewTag()" v-bind:class="{'read-only': readOnly}" class="vue-input-tag-wrapper">
            <span v-for="(tag, index) in tagsArray" class="input-tag">
                <span>{{ tag }}</span>
                <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
            </span>
            <input v-if="!readOnly" :maxlength="metafield.length" v-bind:placeholder="placeholder" type="text" v-model="newTag" v-on:keydown.delete.stop="removeLastTag()" v-on:keyup.up="upSelectTag()" v-on:keyup.down="downSelectTag()" v-on:keydown.enter.188.prevent.stop="addNew(newTag)" class="new-tag" />
            <div v-show="newTag" class="enter-tips">按回车键添加</div>
            <div v-show="newTag&&options&&options.length>0" class="options-con">
                <div v-for="(opt,_index) in options" class="options-item" :class="{active:_index==currentSelected}" @click="clickSelected(_index)" :key="opt" v-text="opt"></div>
            </div>
        </div>
        <span class="colorRed" v-show="validator&&validator.errorBag&&validator.errorBag.has(metafield.name)">{{ validator&&validator.errorBag&&validator.errorBag.first(metafield.name) }}</span>
        <p class="colorGrey" v-show="metafield.help" v-text="metafield.help"></p>
    </li>
</template>
<script>
module.exports = {
    props: {
        metafield: {
            type: Object
        },
        value: {
            type: [String,Array],//支持英文逗号分隔的多值和数组值
            default: null,
        },
        validator:{
            type:Object
        },
        options:{
            type:Array,
            default:function(){
                return [];
            }
        }
    },
    data() {
        return {
            newTag: '',
            tagsArray:[],
            returnTypeIsArray:false,
            currentSelected:-1//用来确定上下箭头选中的值
        };
    },
    watch:{
        value:function(){
            if (this.value) {
                if(_.isArray(this.value)){
                    this.tagsArray=_.cloneDeep(this.value);
                    this.returnTypeIsArray=true;
                }else{
                    this.tagsArray= this.value.split(',');
                }
            } else {
                this.tagsArray= [];
            }
        }
    },
    computed: {
        placeholder:function(){
            return this.metafield.placeholder;
        },
        readOnly:function(){
            return !!this.metafield.disabled;
        }
    },
    methods: {
        upSelectTag(){//向上选中值
            var canUp=this.newTag&&this.options&&this.options.length>0;
            if(canUp){
                if(this.currentSelected<0){
                    this.currentSelected=0;
                }else if(this.currentSelected>0){
                    this.currentSelected=this.currentSelected-1;
                }
            }
        },
        downSelectTag(){//向下选中值
            var canDown=this.newTag&&this.options&&this.options.length>0;
            if(canDown){
                if(this.currentSelected<0){
                    this.currentSelected=0;
                }else if(this.currentSelected<this.options.length-1){
                    this.currentSelected=this.currentSelected+1;
                }
            }
        },
        clickSelected:function(_index){
            this.currentSelected=_index;
            this.addNew();
        },
        focusNewTag() {
            if (this.readOnly) { return; }
            this.$el.querySelector('.new-tag').focus();
        },
        addNew(tag) {
            var _this=this;
            //上下箭头选中值添加
            var canUpDown=this.newTag&&this.options&&this.options.length>0;
            if(canUpDown&&this.currentSelected>=0&&this.currentSelected<this.options.length){
                tag=this.options[this.currentSelected];
            }
            if (tag && !_.includes(_this.tagsArray,tag)) {
                var max=this.metafield.maxTagNum;
                if(max){
                    if(this.tagsArray.length>=max){
                        iview$Message.warning(`tag总数超过了最大个数${max}`);
                        this.newTag = '';
                        return false;
                    }
                }
                var isUrl=this.metafield.isUrl;
                var isBaseUrl=this.metafield.isBaseUrl;
                if(isUrl&&this.validator){
                    var protocalUrl=this.validator.rules.url(tag,[true]);
                    if(!protocalUrl){
                        iview$Message.warning(`请输入合法的url`);
                        return false;
                    }
                    if(isBaseUrl){
                        var dn=tag.split("//")[1];
                        if(dn.indexOf("/")>-1){
                            iview$Message.warning(`url不允许出现子路径`);
                            return false;
                        }
                    }
                }
                this.tagsArray.push(tag);
                this.tagChange();
            }
            this.newTag = '';
        },
        remove(index) {
            this.tagsArray.splice(index, 1);
            this.tagsArray=this.tagsArray;
            this.tagChange();
        },
        removeLastTag() {
            if (this.newTag) { return; }
            this.tagsArray.pop();
            this.tagsArray=this.tagsArray;
            this.tagChange();
        },
        tagChange() {
            var value = null;
            if(this.returnTypeIsArray){
                value=_.cloneDeep(this.tagsArray);
            }else{
                value=this.tagsArray.join(",");
            }
            this.$emit('input', value);
        }
    },
};
</script>
<style>
.vue-input-tag-wrapper {
    background-color: #fff;
    border: 1px solid #ccc;
    overflow: hidden;
    padding-left: 8px;
    padding-top: 4px;
    cursor: text;
    text-align: left;
    -webkit-appearance: textfield;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}

.vue-input-tag-wrapper .input-tag {
    background-color: #e6e6e6;
    border: 1px solid #ccc;
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    padding: 3px;
    margin-right:5px;
}

.vue-input-tag-wrapper .input-tag .remove {
    cursor: pointer;
    font-weight: bold;
    color:#777;
}

.vue-input-tag-wrapper .input-tag .remove:hover {
    text-decoration: none;
}

.vue-input-tag-wrapper .input-tag .remove::before {
    content: " x";
}

.vue-input-tag-wrapper .new-tag {
    background: transparent;
    border: 0;
    color: #777;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 4px;
    margin-top: 1px;
    outline: none;
    padding: 4px;
    padding-left: 0;
    width: 180px;
}

.vue-input-tag-wrapper.read-only {
    cursor: default;
}
.vue-input-tag-wrapper .options-con{
    padding: 5px;
}
.vue-input-tag-wrapper .options-item{
    cursor: pointer;
}
.vue-input-tag-wrapper .enter-tips{
    color:#41b883;
    font-style: italic;
}
.vue-input-tag-wrapper .options-item:hover{
    color:#41b883;
}
.vue-input-tag-wrapper .options-item.active{
    color:#41b883;
    background-color: #eeeeee;
}
</style>