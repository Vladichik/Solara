<template>
  <q-btn flat
         class="full-width q-pa-none"
         color="primary"
         label="Add Device" size="18px" />
  <div class="sol-devices-list-frame">
    <placeholder :text="$tm('placeholder.no_devices')" />
    <q-list separator v-if="devices && devices.length">
      <q-item>
        <q-btn flat @click="viewDevice" label="asdad" />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

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

<style lang="scss">
.sol-devices-list-frame {
  position: relative;
  min-height: 250px;
}
</style>
