<template>
  <div>
    <Button type="info" v-if="backRouter" shape="circle" icon="ios-undo-outline" @click="$router.push(backRouter)">
    </Button>
    <span class="title" v-if="title" v-wordlimit="{length:titleLength,text:title}"></span>
    <span class="subtitle" v-if="subtitle" v-wordlimit="{length:subtitleLength,text:subtitle}"></span>
  </div>
</template>
<script>
export default {
  props:{
      backRouter:{
          type:Object
      },
      title:{
          type:String
      },
      subtitle:{
          type:String
      },
      titleLength:{
          type:Number,
          default:20
      },
      subtitleLength:{
          type:Number,
          default:4
      }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 20px;
}
.subtitle {
  font-size: 12px;
}
</style>


