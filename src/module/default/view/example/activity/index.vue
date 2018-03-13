<template>
    <div>
    </div>
</template>
<script>
export default {
    mounted(){
        router.push({
            name:"defaultEntityList",
            params:{
                entityName:"Activity"
            }
        });
    }
}
</script>

