<template>
  <device-image-parallax :on-back="onBack" :device="formData" />
  <q-form ref="deviceForm"
          class="sol-form-grid q-pl-lg q-pr-lg q-pb-lg"
          @submit="saveDevice()">
<!--    <q-input filled :label="$t('location_name')"-->
<!--             v-model="formData.location_name"-->
<!--             :model-value="formData.location_name"-->
<!--             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />-->
<!--    <q-input filled :label="$t('device_name')"-->
<!--             :model-value="formData.device_name"-->
<!--             v-model="formData.device_name"-->
<!--             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />-->
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
                    :options="getDatePickerOptions">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-select :model-value="formData.address"
              v-model="formData.address"
              map-options
              emit-value
              filled
              option-value="id"
              option-label="place_name"
              :label="$t('address')"
              :options="deviceAddresses" />
    <q-card flat class="bg-grey-3">
      <q-card-section class="sol-receipt-btn-sec">
        <q-btn flat
               class="bg-grey-5"
               :label="$t('add_receipt')"
               icon="upload"
               @click="openReceiptUploader()"
               size="18px" />
        <a :href="getReceiptDownloadLink" v-if="device.receipt_url">
          <q-btn flat
                 class="bg-grey-5 full-width"
                 :label="$t('download_receipt')"
                 icon="download"
                 size="18px"/>
        </a>
      </q-card-section>
    </q-card>
    <q-btn flat
           class="bg-grey-3"
           :label="$t('add_photo')"
           icon="photo_camera"
           @click="openImageUploader()"
           size="18px" />
    <q-btn color="primary"
           :label="$t('save')"
           @click="$refs.deviceForm.submit()"
           size="18px" />
  </q-form>
</template>

<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
} from 'vue';
import { useStore } from 'vuex';
import { date } from 'quasar';
import NotificationsMixins from 'src/mixins/NotificationsMixins';
import DeviceImageParallax from 'components/my-account/DeviceImageParallax';
import DevicesAPI from 'src/api/device';
import CloudinaryAPI from 'src/api/cloudinary';

export default defineComponent({
  name: 'DeviceFullView',
  props: ['onBack', 'device'],
  mixins: [NotificationsMixins],
  components: {
    DeviceImageParallax,
  },
  setup(props) {
    const store = useStore();
    const getDatePickerOptions = (d) => d >= date.formatDate(Date.now(), 'YYYY/MM/DD');
    const deviceAddresses = computed(() => store.state.Addresses.deviceAddresses);

    const getReceiptDownloadLink = computed(() => {
      if (props.device && props.device.receipt_url) {
        const url = props.device.receipt_url;
        const atn = '/fl_attachment';
        const position = url.indexOf('upload');
        return [url.slice(0, position + 6), atn, url.slice(position + 6)].join('');
      }
      return '';
    });

    const formData = reactive({
      // location_name: null,
      // device_name: null,
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
     * Function that saves uploaded device image url
     * in Solara DB
     * @param image - Image Object
     * @param isReceipt - Boolean is true when called from receipt upload poceess
     * @returns {Promise<void>}
     */
    const updateUploadedImageDataForDevice = async (image, isReceipt) => {
      if (image) {
        store.commit('General/setMainLoaderState', true);
        const deviceUpdateFields = {
          id: props.device.id,
        };
        if (isReceipt) {
          if (props.device.receipt_public_id) {
            await CloudinaryAPI.deleteImageFromCloudinary(props.device.receipt_public_id);
          }
          deviceUpdateFields.receipt_url = image.url;
          deviceUpdateFields.receipt_public_id = image.public_id;
        } else {
          if (props.device.image_public_id) {
            await CloudinaryAPI.deleteImageFromCloudinary(props.device.image_public_id);
          }
          deviceUpdateFields.image_url = image.url;
          deviceUpdateFields.image_public_id = image.public_id;
        }
        const updated = await DevicesAPI.updateDevice(deviceUpdateFields);
        if (updated.status === 200 && updated.data.id) {
          Object.assign(formData, deviceUpdateFields);
          await store.dispatch('Devices/getMyDevices');
        }
        store.commit('General/setMainLoaderState', false);
      }
    };

    /**
     * Cloudinary instance for Device Image upload
     * Vlad.
     */
    const uploaderWidget = cloudinary.createUploadWidget({
      cloudName: 'solara',
      uploadPreset: 'gtvkezma',
      folder: 'devices',
      sources: ['local', 'camera'],
      multiple: false,
    }, (error, result) => {
      if (!error && result && result.event === 'success') {
        updateUploadedImageDataForDevice(result.info);
      }
    });

    /**
     * Cloudinary instance for Receipt image upload
     * Vlad.
     */
    const uploaderWidgetForReceipt = cloudinary.createUploadWidget({
      cloudName: 'solara',
      uploadPreset: 'nqfah6p5',
      folder: 'receipts',
      sources: ['local', 'camera'],
      multiple: false,
    }, (error, result) => {
      if (!error && result && result.event === 'success') {
        updateUploadedImageDataForDevice(result.info, true);
      }
    });

    const openImageUploader = () => {
      uploaderWidget.open();
    };

    const openReceiptUploader = () => {
      uploaderWidgetForReceipt.open();
    };

    onBeforeMount(() => {
      initFormData();
    });
    return {
      store,
      formData,
      deviceAddresses,
      getReceiptDownloadLink,
      getDatePickerOptions,
      openImageUploader,
      openReceiptUploader,
    };
  },
  methods: {
    /**
     * Function that saves new or edited device data in database
     * Vlad. 27/07/21
     */
    async saveDevice() {
      this.store.commit('General/setMainLoaderState', true);
      const updated = await DevicesAPI.updateDevice(this.formData);
      if (updated.status === 200) {
        await this.$store.dispatch('Devices/getMyDevices');
        this.showInfoNotification(this.$tm('notifications.data_saved'));
      } else {
        this.showWarningNotification(this.$tm('notifications.saving_failed'));
      }
      this.store.commit('General/setMainLoaderState', false);
    },
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-receipt-btn-sec {
  align-content: center;
  @include setGridAuto(auto, 10px, "rows");
  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>
