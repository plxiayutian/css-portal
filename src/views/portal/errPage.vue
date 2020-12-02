<template>
  <div class="errPage">
    <img v-if="img500" src="../../assets/images/err/500.jpg" style="width: 100%;" />
    <img v-if="img404" src="../../assets/images/err/404.jpg" style="width: 100%;" />
  </div>
</template>

<script>
  export default {
    name: "errPage",
    data(){
      return {
        img500:false,
        img404:false
      }
    },
    mounted() {
      console.log(this.$route.query)
      if(this.$route.query.status == "500"){
        this.img500 = true
      }else if(this.$route.query.status == "404"){
        this.img404 = true
      }
    },
  }
</script>

<style scoped>
  .errPage{
    width: 100%;
    height: 100%;
  }
 
</style>
