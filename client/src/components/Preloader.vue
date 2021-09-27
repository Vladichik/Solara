<template>
  <section :class="['sol-preloader-overlay', { 'sol-set-fixed': fixed }]">
    <q-spinner-bars color="primary" size="3em" />
  </section>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Preloader',
  props: ['fixed'],
});
</script>
