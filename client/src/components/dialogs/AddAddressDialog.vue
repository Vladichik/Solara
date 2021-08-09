<template>
  <q-dialog persistent v-model="showDialog">
    <q-card class="sol-dialog-default overflow-hidden sol-add-address-dlg">
      <div class="text-h6">{{ $tm('add_address') }}</div>
      <div class="q-pa-md">
        <address-autocomplete :model="selectedAddress" />
      </div>
      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated
               color="primary"
               @click="logout">
          {{ $t('add') }}
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AddressAutocomplete from 'components/inputs/AddressAutocomplete';

export default defineComponent({
  name: 'AddAddress',
  components: {
    AddressAutocomplete,
  },
  setup() {
    const showDialog = ref(false);
    const selectedAddress = reactive({});
    return {
      showDialog,
      selectedAddress,
    };
  },
});
</script>

<style lang="scss">
.sol-add-address-dlg {
  width: 400px;
}
</style>
