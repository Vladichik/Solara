<template>
  <q-btn flat
         class="full-width q-pa-none"
         color="primary"
         label="Add Device" size="18px" />
  <q-list separator v-if="devices && devices.length">
    <q-item>
      <q-btn flat @click="viewDevice" label="asdad" />
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'ProductsList',
  props: ['viewDevice'],
  data() {
    return {
      devices: null,
    };
  },
});
</script>

<style scoped>

</style>
