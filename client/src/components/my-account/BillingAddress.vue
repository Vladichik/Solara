<template>
  <q-expansion-item
    expand-separator
    label="Billing Address"
    header-class="text-white sol-expansion-head"
    class="bg-primary sol-white-arrow"
  >
    <q-card flat>
      <q-card-section class="sol-form-grid">
        <q-select filled class="sf-subject-picker"
                  color="blue-13"
                  map-options
                  emit-value
                  option-value="name"
                  option-label="name"
                  v-model="billingAddress.state"
                  :model-value="billingAddress.state"
                  :options="$tm('states')" />
        <q-input filled v-model="billingAddress.city"
                 :model-value="billingAddress.city"
                 :label="$t('city')" />
        <q-input filled v-model="billingAddress.street"
                 :model-value="billingAddress.street"
                 :label="$t('street')" />
        <div class="sol-grid-twin-cols">
          <q-input filled v-model="billingAddress.house_no"
                   :model-value="billingAddress.house_no"
                   :label="$t('house_n')" />
          <q-input filled v-model="billingAddress.flat_no"
                   :model-value="billingAddress.flat_no"
                   :label="$t('apt_n')" />
          <q-input filled v-model="billingAddress.zip"
                   :model-value="billingAddress.zip"
                   :label="$t('zip')" />
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'BillingAddress',
  setup() {
    const billingAddress = reactive({
      state: '',
      city: '',
      street: '',
      house_no: '',
      flat_no: '',
      zip: '',
    });
    return {
      billingAddress,
    };
  },
});
</script>

<style scoped>

</style>
