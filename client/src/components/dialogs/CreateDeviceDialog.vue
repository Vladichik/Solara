<template>
  <q-dialog persistent v-model="showDialog">
    <q-card class="sol-dialog-default overflow-hidden sol-add-device-dlg">
      <div class="text-h6">{{ $tm('add_device') }}</div>

      <q-card-section class="sol-dialog-content sol-form-grid">
        <q-select filled :label="$t('pergola_colors')" />
        <q-select filled :label="$t('rafter_size')" />
        <q-select filled :label="$t('louvered_size')" />
        <q-select filled :label="$t('num_motors')" />
        <q-input filled :label="$t('technician_name')" v-model="formData.technician_name" />
        <q-input filled :label="$t('technician_company')" v-model="formData.technician_company" />
        <q-input square filled :label="$tm('install_date')"
                 v-model="formData.installation_date"
                 mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.installation_date" :options="getDatePickerOptions">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn flat class="bg-grey-3" :label="$t('add_photo')" icon="photo_camera" size="18px" />
        <address-autocomplete :model="formData" />
      </q-card-section>

      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" @click="$emit('logout-close')" />
        <q-btn unelevated color="primary">{{ $t('add') }}</q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { date } from 'quasar';
import AddressAutocomplete from 'components/inputs/AddressAutocomplete';

export default defineComponent({
  name: 'CreateDeviceDialog',
  components: {
    AddressAutocomplete,
  },
  setup() {
    const showDialog = ref(false);
    const formData = reactive({
      technician_name: null,
      technician_company: null,
      installation_date: null,
      device_image_url: null,
      address: null,
      lat: null,
      long: null,
    });
    const getDatePickerOptions = (d) => d >= date.formatDate(Date.now(), 'YYYY/MM/DD');
    return {
      showDialog,
      formData,
      getDatePickerOptions,
    };
  },
});
</script>

<style lang="scss">
.sol-add-device-dlg {
  width: 500px;
}
</style>
