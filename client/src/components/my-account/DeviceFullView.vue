<template>
  <device-image-parallax :on-back="onBack" :device="formData" />
  <q-form ref="deviceForm"
          class="sol-form-grid q-pl-lg q-pr-lg q-pb-lg"
          @submit="saveDevice()">
    <q-input filled :label="$t('location_name')"
             v-model="formData.location_name"
             :model-value="formData.location_name"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    <q-input filled :label="$t('device_name')"
             :model-value="formData.device_name"
             v-model="formData.device_name"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    <q-select filled :label="$t('pergola_colors')" />
    <q-select filled :label="$t('rafter_size')" />
    <q-select filled :label="$t('louvered_size')" />
    <q-select filled :label="$t('num_motors')" />
    <q-input filled :label="$t('technician_name')"
             v-model="formData.technician_name" />
    <q-input filled
             :label="$t('technician_company')"
             v-model="formData.technician_company"
             :model-value="formData.technician_company" />
    <q-input square filled :label="$tm('install_date')"
             v-model="formData.installation_date"
             :model-value="formData.installation_date"
             mask="date">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="formData.installation_date"
                    :model-value="formData.installation_date"
                    :options="getDatePickerOptions">
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
    <q-btn color="primary"
           :label="$t('save')"
           @click="$refs.deviceForm.submit()"
           size="18px" />
  </q-form>
</template>

<script>
import { defineComponent, reactive, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { date } from 'quasar';
import AddressAutocomplete from 'components/inputs/AddressAutocomplete';
import DeviceImageParallax from 'components/my-account/DeviceImageParallax';
import DevicesAPI from 'src/api/device';

export default defineComponent({
  name: 'DeviceFullView',
  props: ['onBack', 'device'],
  components: {
    AddressAutocomplete,
    DeviceImageParallax,
  },
  setup(props) {
    const store = useStore();
    const getDatePickerOptions = (d) => d >= date.formatDate(Date.now(), 'DD/MM/YYYY');
    const selectedAddress = reactive({});
    const formData = reactive({
      location_name: null,
      device_name: null,
      technician_name: null,
      technician_company: null,
      installation_date: null,
      device_image_url: null,
      address: null,
    });

    const initFormData = () => {
      if (props.device && props.device.id) {
        Object.assign(formData, props.device);
      }
    };
    /**
     * Function that saves new or edited device data in database
     * Vlad. 27/07/21
     */
    // const saveDevice = async () => {
    //   if (selectedAddress.address && selectedAddress.address.place_name) {
    //     const city = selectedAddress.address.context.find((c) => c.id.includes('place'));
    //     const district = selectedAddress.address.context.find((c) => c.id.includes('district'));
    //     const region = selectedAddress.address.context.find((c) => c.id.includes('region'));
    //     const country = selectedAddress.address.context.find((c) => c.id.includes('country'));
    //     formData.address = {
    //       full: selectedAddress.address.place_name,
    //       lat: selectedAddress.address.center[0],
    //       long: selectedAddress.address.center[1],
    //       city: city ? city.text : '',
    //       district: district ? district.text : '',
    //       region: region ? region.text : '',
    //       country: country ? country.text : '',
    //     };
    //     console.log(formData);
    //     // const updated = await DevicesAPI.updateDevice(formData);
    //     debugger;
    //   }
    // };

    onBeforeMount(() => {
      initFormData();
    });
    return {
      store,
      formData,
      selectedAddress,
      getDatePickerOptions,
      // saveDevice,
    };
  },
  methods: {
    async saveDevice() {
      if (this.selectedAddress.address && this.selectedAddress.address.place_name) {
        const city = this.selectedAddress.address.context.find((c) => c.id.includes('place'));
        const district = this.selectedAddress.address.context.find((c) => c.id.includes('district'));
        const region = this.selectedAddress.address.context.find((c) => c.id.includes('region'));
        const country = this.selectedAddress.address.context.find((c) => c.id.includes('country'));
        this.formData.address = {
          full: this.selectedAddress.address.place_name,
          lat: this.selectedAddress.address.center[0],
          long: this.selectedAddress.address.center[1],
          city: city ? city.text : '',
          district: district ? district.text : '',
          region: region ? region.text : '',
          country: country ? country.text : '',
        };
        this.store.commit('General/setMainLoaderState', true);
        console.log(this.formData);
        // const updated = await DevicesAPI.updateDevice(formData);
      }
    },
  },
});
</script>

<style scoped>

</style>
