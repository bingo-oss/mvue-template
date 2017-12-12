<template>
    <div style="position:relative;">
    <div class="pageHeader" v-show="show.title||show.smallTitle||show.descrition||show.description">
        <p class="title" v-html="show.title"></p>
        <p class="small-title" v-html="show.smallTitle"></p>
        <p class="description" v-html="show.descrition||show.description"></p>
        <slot></slot>
    </div>
    <i v-if="show.showBack" class="iconfont icon-fanhuianniu back" @click="back()"></i>
    </div>
</template>
<script>
module.exports = {
    props:{
        show: {
            type: Object,
            default: function(){
                return {}
            }
        }
    },
    methods: {
        //返回
        back: function(){
            router.go(-1);
        }
    }
};
</script>

<style lang="scss">
    @import "~sass/common.scss";
    @import "~sass/mixin.scss";

    .pageHeader{
        background: $grayf3;
        padding: $dis20 100px $dis20 $dis20;
        .title{
            font-size: $dis20;
            color: $gray6;
            font-weight:500;
            margin:0px 0px;
        }
        .small-title{
            font-size: $dis16;
            color: $gray6;
            font-weight:500;
            margin:0px 0px;
        }
        .description{
            color: $gray9;
            line-height: $dis24;
            margin:0px 0px;
        }
    }
    .tabEditBox{
        @include position(relative);
        bottom: -$dis20;
        margin-bottom: 0;
        li{
            transition: color .2s ease-in-out;
            background: $grayf3;
            @include float(left);
            padding: $dis5 $dis20;
            border-top: $dis3 solid $grayf3;
            cursor: pointer;
            &:hover{
                color: $blue;
             }
            &.link{
                 background: $white;
                 border-color: $blue;
                 color: $blue;
             }
        }
    }

</style>
