<template>
  <navbar :title="$tm('nav_bar.product_info')"
          :btn-label="$tm('nav_bar.my_account')"
          to="/my-account" />
  <q-tab-panels v-model="panel" animated>
    <q-tab-panel name="products" class="q-pt-none q-pl-lg q-pr-lg">
      <products-list :view-device="viewDevice" />
    </q-tab-panel>
    <q-tab-panel name="device-details">
      <div>sdasd</div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent } from 'vue';
import ProductsList from 'components/my-account/ProductsList';

export default defineComponent({
  name: 'ProductsInfo',
  components: { ProductsList },
  data() {
    return {
      panel: 'products',
      deviceInView: null,
    };
  },
  methods: {
    viewDevice(device) {
      this.deviceInView = device;
      this.panel = 'device-details';
    },
  },
});
</script>

<style scoped>

</style>
