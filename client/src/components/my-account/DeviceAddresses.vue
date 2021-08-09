<template>
  <q-expansion-item
    expand-separator
    :label="$t('device_adr')"
    header-class="text-white sol-expansion-head"
    class="bg-primary sol-white-arrow"
  >
    <q-card flat>
      <div class="q-pa-md sol-dev-addresses-head">
        <q-btn outline
               icon="add"
               color="primary"
               :label="$t('add_address')"
               @click="$refs.addAddressDlg.showDialog = true" />
        <add-address-dialog ref="addAddressDlg" />
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue';
import AddAddressDialog from 'components/dialogs/AddAddressDialog';

export default defineComponent({
  name: 'DeviceAddresses',
  components: {
    AddAddressDialog,
  },
});
</script>

<style scoped>

</style>
