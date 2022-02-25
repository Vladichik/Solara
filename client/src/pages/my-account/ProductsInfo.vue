<template>
  <q-tab-panels v-model='panel' animated>
    <q-tab-panel name='products' class='q-pa-none'>
      <products-list :view-device='viewDevice' />
    </q-tab-panel>
    <q-tab-panel name='device-details' class='q-pa-none'>
      <device-full-view :on-back='getBackToDevicesList' :device='deviceInView' />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
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
  computed: {
    ...mapState({
      myDevices: (state) => state.Devices.myDevices,
    }),
  },
  async created() {
    this.$store.commit('General/setMainLoaderState', true);
    await this.$store.dispatch('Devices/getMyDevices');
    this.$store.commit('General/setMainLoaderState', false);
    console.log(this.$route);
  },
  watch: {
    myDevices(v) {
      this.redirectToDeviceDetailsIfNeeded();
    },
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

    redirectToDeviceDetailsIfNeeded() {
      if (this.$route.params.deviceId && this.myDevices && this.myDevices.length) {
        const currentDevice = this.myDevices.find((device) => device.id === this.$route.params.deviceId);
        if (currentDevice) {
          this.viewDevice(currentDevice);
          this.$router.replace('/products-info');
        }
      }
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
