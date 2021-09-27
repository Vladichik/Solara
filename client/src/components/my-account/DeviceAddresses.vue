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
      <q-list bordered separator>
        <q-item v-for="address in addresses" :key="address.id" class="sol-address-list">
          <span>{{ address.place_name }}</span>
          <q-btn flat outline
                 icon="delete"
                 size="md"
                 @click="openConfirmAddressDelete(address)" />
        </q-item>
      </q-list>
      <confirm-address-delete ref="deleteAddressDlg" :address-to-delete="addressToDelete" />
    </q-card>
  </q-expansion-item>
</template>

<script>
import { computed, defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import AddAddressDialog from 'components/dialogs/AddAddressDialog';
import ConfirmAddressDelete from 'components/dialogs/ConfirmAddressDelete';

export default defineComponent({
  name: 'DeviceAddresses',
  components: {
    AddAddressDialog,
    ConfirmAddressDelete,
  },
  setup() {
    const store = useStore();
    const addresses = computed(() => store.state.Addresses.deviceAddresses);
    const addressToDelete = reactive({});

    return {
      addresses,
      addressToDelete,
    };
  },
  methods: {
    openConfirmAddressDelete(address) {
      Object.assign(this.addressToDelete, address);
      this.$refs.deleteAddressDlg.showDialog = true;
    },
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-address-list {
  font-size: 16px;
  align-items: center;
  @include setGrid(1fr auto, 10px, null, null, "columns");
}
</style>
