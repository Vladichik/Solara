<template>
  <q-tab-panels v-model="panel" animated>
    <q-tab-panel name="products" class="q-pa-none">
      <products-list :view-device="viewDevice" />
    </q-tab-panel>
    <q-tab-panel name="device-details">
      <device-full-view :on-back="getBackToDevicesList" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent } from 'vue';
import ProductsList from 'components/my-account/ProductsList';
import DeviceFullView from 'components/my-account/DeviceFullView';

export default defineComponent({
  name: 'ProductsInfo',
  components: { ProductsList, DeviceFullView },
  data() {
    return {
      panel: 'products',
      deviceInView: null,
    };
  },
  methods: {
    /**
     * Function that opens device full view
     * @param device - Device that should be shown in full view
     * Vlad. 02/08/21
     */
    viewDevice(device) {
      this.deviceInView = device;
      this.panel = 'device-details';
    },

    /**
     * Function that closes device full view and gets
     * back to devices list
     * Vlad. 02/08/21
     */
    getBackToDevicesList() {
      this.deviceInView = null;
      this.panel = 'products';
    },
  },
});
</script>

<style scoped>

</style>
