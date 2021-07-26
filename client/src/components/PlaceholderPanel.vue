<template>
  <section class="sol-placeholder-overlay">
    <h6 class="text-blue-grey-3 text-subtitle1">
      {{ text ? text : $t('placeholder_panel.no_data') }}
    </h6>
  </section>
</template>

<script>
export default {
  name: 'NoWidgetData',
  props: ['text'],
};
</script>
