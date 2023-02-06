<template>
  <h1 style="color: white">{{ title }}</h1>
<div><T /></div>
</template>

<script>
import T from './components/FormModal.vue'
export default {
  name: 'App',
  components:{T},
  data (){
    return {
      title : 'Maxnet Digital Services Online Payment',
      
    }
  },
 
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #edeff1;
  margin-top: 60px;
}

</style>
