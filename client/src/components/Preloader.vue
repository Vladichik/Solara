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
.sc-pr-rounded {
  border-radius: 15px;
}
</style>
