<template>
  <div class="loading">
    <div class="ball"></div>
    Login...
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false
      }
    },

    watch: {
      dialog (val) {
        console.log('watch dialog', val);
        if (!val) return

        setTimeout(() => (this.dialog = false), 4000)
      }
    }
  }
</script>

<style scoped>
.loading {
  margin-top: 50px;
  margin-left: 50px;
  font-size: 50px;
  font-family: sans-serif;
}
.ball {
  display: inline-block;
  height: 50px;
  width: 50px;
  background-color: #e74c3c;
  border-radius: 50%;
  box-shadow:inset 6px -10px 50px -20px #000;
  animation: loading 1s infinite;
}


@keyframes loading {
  0%, 100% {
    transform: translateY(0px);
    animation-timing-function: ease-out;
  }
  50% {
    transform: translateY(-30px);
    animation-timing-function: ease-in;
  }
}
</style>