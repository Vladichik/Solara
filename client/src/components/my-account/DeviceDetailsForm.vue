<template>
  <q-form ref="deviceForm"
          class="sol-form-grid"
          @submit="saveDevice()">
    <q-select filled :label="$t('pergola_colors')" />
    <q-select filled :label="$t('rafter_size')" />
    <q-select filled :label="$t('louvered_size')" />
    <q-select filled :label="$t('num_motors')" />
    <q-input filled :label="$t('technician_name')"
             v-model="formData.technician_name"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    <q-input filled
             :label="$t('technician_company')"
             v-model="formData.technician_company"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    <q-input square filled :label="$tm('install_date')"
             v-model="formData.installation_date"
             mask="date"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]">
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
    <address-autocomplete :model="selectedAddress" @clear-address="selectedAddress = {}" />
    <q-btn flat
           class="bg-grey-3"
           :label="$t('add_photo')"
           icon="photo_camera"
           size="18px" />
  </q-form>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { date } from 'quasar';
import AddressAutocomplete from 'components/inputs/AddressAutocomplete';

export default defineComponent({
  name: 'DeviceDetailsForm',
  components: {
    AddressAutocomplete,
  },
  setup() {
    const selectedAddress = reactive({});
    const formData = reactive({
      technician_name: null,
      technician_company: null,
      installation_date: null,
      device_image_url: null,
      address: null,
    });
    /**
     * Function that saves new or edited device data in database
     * Vlad. 27/07/21
     */
    const saveDevice = () => {
      if (selectedAddress.address && selectedAddress.address.place_name) {
        const city = selectedAddress.address.context.find((c) => c.id.includes('place'));
        const district = selectedAddress.address.context.find((c) => c.id.includes('district'));
        const region = selectedAddress.address.context.find((c) => c.id.includes('region'));
        const country = selectedAddress.address.context.find((c) => c.id.includes('country'));
        formData.address = {
          full: selectedAddress.address.place_name,
          lat: selectedAddress.address.center[0],
          long: selectedAddress.address.center[1],
          city: city ? city.text : '',
          district: district ? district.text : '',
          region: region ? region.text : '',
          country: country ? country.text : '',
        };
        console.log(formData);
      }
    };
    const getDatePickerOptions = (d) => d >= date.formatDate(Date.now(), 'YYYY/MM/DD');
    return {
      formData,
      selectedAddress,
      getDatePickerOptions,
      saveDevice,
    };
  },
});
</script>

<style scoped>

</style>
