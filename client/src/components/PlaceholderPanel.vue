<template>
  <section class="sol-placeholder-overlay">
    <h6 class="text-blue-grey-3 text-subtitle1">
      {{ text }}
    </h6>
  </section>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NoWidgetData',
  props: ['text'],
});
</script>
