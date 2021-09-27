<template>
  <navbar :title="$tm('nav_bar.address')"
          :btn-label="$tm('nav_bar.my_account')"
          to="/my-account" />
  <manual-address ref="billingAddress"
                  type="billing"
                  :label="$t('bill_address')"
                  :manual-addresses="manualAddresses" />
  <device-addresses />
</template>

<script>
import { defineComponent, reactive, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import ManualAddress from 'components/my-account/ManualAddress';
import DeviceAddresses from 'components/my-account/DeviceAddresses';
import AddressesAPI from 'src/api/addresses';

export default defineComponent({
  name: 'Address',
  components: {
    ManualAddress,
    DeviceAddresses,
  },
  setup() {
    const store = useStore();
    const manualAddresses = reactive([]);
    /**
     * Function that is being called each time view loads and
     * fetches manual addresses
     * @returns {Promise<void>}
     */
    const getManualAddresses = async () => {
      store.commit('General/setMainLoaderState', true);
      const addresses = await AddressesAPI.getAddresses();
      store.commit('General/setMainLoaderState', false);
      if (addresses.status === 200 && addresses.data.length) {
        Object.assign(manualAddresses, addresses.data);
      }
    };

    onBeforeMount(() => {
      getManualAddresses();
    });
    return {
      manualAddresses,
    };
  },
});
</script>

<style scoped>

</style>
