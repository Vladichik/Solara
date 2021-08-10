<template>
  <q-dialog persistent v-model="showDialog">
    <q-card class="sol-dialog-default overflow-hidden sol-delete-address-dlg">
      <div class="text-h6">{{ $tm('delete_address') }}</div>
      <span class="text-center sol-dialog-text">{{ $t('addr_delete_msg') }}</span>
      <span class="q-pt-sm q-pr-lg q-pl-lg q-pb-md text-center text-blue-6 sol-dialog-text">
        {{ addressToDelete.place_name }}
      </span>
      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated
               color="primary"
               @click="performDelete">
          {{ $t('confirm') }}
        </q-btn>
      </div>
      <preloader v-if="processing" />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import DeviceAddressesAPI from 'src/api/device-addresses';

export default defineComponent({
  name: 'ConfirmAddressDelete',
  props: ['addressToDelete'],
  setup(props) {
    const store = useStore();
    const showDialog = ref(false);
    const processing = ref(false);

    const performDelete = async () => {
      processing.value = true;
      const deleted = await DeviceAddressesAPI.deleteDeviceAddress(props.addressToDelete.id);
      processing.value = false;
    };

    return {
      showDialog,
      processing,
      performDelete,
    };
  },
});
</script>

<style lang="scss">
.sol-delete-address-dlg {
  width: 400px;
  .sol-dialog-text {
    font-size: 16px;
  }
}
</style>
