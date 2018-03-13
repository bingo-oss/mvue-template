<template>
<div>
  实体列表
     <ul>
       <li v-for="entity  in entities">
         {{entity.title}}
       </li>
     </ul>
</div>
</template>
<script>
  import metabase from "libs/metadata/metabase.js";
    export default {
        data(){
            return {
              entities:[]
            }
        },
      mounted() {
          var _self=this;
          _.forEach(metabase.entities(),function (val,key) {
            _self.entities.push(val);
          });
      },
    }
</script>
