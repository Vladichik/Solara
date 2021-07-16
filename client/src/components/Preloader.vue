<template>
  <section class="sol-preloader-overlay">
    <q-spinner-bars color="primary" size="3em" />
  </section>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Preloader',
  props: ['dark', 'rounded'],
});
</script>
<style lang="scss">
.sol-preloader-overlay {
  opacity: 0.9;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 10;
  top: 0;
  left: 0;
  background: white;
}
.sc-pr-rounded {
  border-radius: 15px;
}
</style>
