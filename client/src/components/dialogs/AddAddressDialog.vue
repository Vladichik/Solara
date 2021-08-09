<template>
  <q-dialog persistent v-model="showDialog" @before-hide="resetAddress">
    <q-card class="sol-dialog-default overflow-hidden sol-add-address-dlg">
      <div class="text-h6">{{ $tm('add_address') }}</div>
      <div class="q-pa-md">
        <address-autocomplete :model="selectedAddress" />
      </div>
      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated
               color="primary"
               @click="addNewAddress()">
          {{ $t('add') }}
        </q-btn>
      </div>
      <preloader v-if="processing" />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import AddressAutocomplete from 'components/inputs/AddressAutocomplete';
import DeviceAddressesAPI from 'src/api/device-addresses';
import AuthAPI from 'src/api/authentication';

export default defineComponent({
  name: 'AddAddress',
  components: {
    AddressAutocomplete,
  },
  setup() {
    const showDialog = ref(false);
    const processing = ref(false);
    const selectedAddress = reactive({});
    let addressData = reactive({});

    const resetAddress = () => {
      Object.assign(selectedAddress, { address: { place_name: '' } });
    };
    const addNewAddress = async () => {
      if (selectedAddress.address && selectedAddress.address.place_name) {
        const city = selectedAddress.address.context.find((c) => c.id.includes('place'));
        const district = selectedAddress.address.context.find((c) => c.id.includes('district'));
        const region = selectedAddress.address.context.find((c) => c.id.includes('region'));
        const country = selectedAddress.address.context.find((c) => c.id.includes('country'));
        addressData = {
          user_id: AuthAPI.getUserId(),
          place_name: selectedAddress.address.place_name,
          lat: selectedAddress.address.center[0],
          long: selectedAddress.address.center[1],
          city: city ? city.text : '',
          district: district ? district.text : '',
          region: region ? region.text : '',
          country: country ? country.text : '',
        };
        if (addressData.user_id) {
          processing.value = true;
          const added = await DeviceAddressesAPI.addDeviceAddress(addressData);
          if (added.status === 200 && added.data.id) {
            resetAddress();
            showDialog.value = false;
          }
          processing.value = false;
        }
      }
    };

    return {
      showDialog,
      selectedAddress,
      addressData,
      processing,
      addNewAddress,
      resetAddress,
    };
  },
});
</script>

<style lang="scss">
.sol-add-address-dlg {
  width: 400px;
  position: relative;
}
</style>
