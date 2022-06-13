<template>
    <earth ref="Earth"></earth>
</template>

<script>

import Earth from '@/components/Earth'


export default {
  name: 'Home',
  data() {
    return {
      earthStatus: false,
    }
  },
  
  mounted() {
	 this.$refs['Earth'].show()
  },

 
  components: {
    Earth,
  },
}
</script>
<style lang="scss">

body,
html,#app {
  background-color: #000;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

</style>
