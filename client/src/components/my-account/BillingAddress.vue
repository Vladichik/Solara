<template>
  <q-expansion-item
    expand-separator
    label="Billing Address"
    header-class="text-white sol-expansion-head"
    class="bg-primary sol-white-arrow"
  >
    <q-card flat>
      <q-form class="sol-form-grid q-pa-md" @submit="saveAddress()">
        <q-select filled class="sf-subject-picker"
                  color="blue-13"
                  map-options
                  emit-value
                  option-value="name"
                  option-label="name"
                  v-model="address.state"
                  :model-value="address.state"
                  :options="$tm('states')" />
        <q-input filled v-model="address.city"
                 :model-value="address.city"
                 :label="$t('city')" />
        <q-input filled v-model="address.street"
                 :model-value="address.street"
                 :label="$t('street')" />
        <div class="sol-grid-twin-cols">
          <q-input filled v-model="address.house_no"
                   :model-value="address.house_no"
                   :label="$t('house_n')" />
          <q-input filled v-model="address.flat_no"
                   :model-value="address.flat_no"
                   :label="$t('apt_n')" />
          <q-input filled v-model="address.zip"
                   :model-value="address.zip"
                   :label="$t('zip')" />
        </div>
        <q-btn color="primary"
               type="submit"
               :label="$t('save')"
               size="18px" />
      </q-form>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import AuthAPI from 'src/api/authentication';
import AddressesAPI from 'src/api/addresses';

export default defineComponent({
  name: 'address',
  setup() {
    const store = useStore();
    const address = reactive({
      user_id: '',
      type: 'billing',
      state: '',
      city: '',
      street: '',
      house_no: '',
      flat_no: '',
      zip: '',
    });

    const saveAddress = async () => {
      store.commit('General/setMainLoaderState', true);
      address.user_id = AuthAPI.getUserId();
      if (address.user_id && address.user_id.length) {
        await AddressesAPI.saveAddress(address);
      }
    };
    return {
      address,
      saveAddress,
    };
  },
});
</script>

<style scoped>

</style>
