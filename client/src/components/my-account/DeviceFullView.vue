<template>
  <device-image-parallax :on-back='onBack' :device='formData' />
  <q-form ref='deviceForm'
          class='sol-device-details-form sol-form-grid q-pl-lg q-pr-lg q-pb-lg'
          @submit='saveDevice()'>
    <!--    <q-input filled :label="$t('location_name')"-->
    <!--             v-model="formData.location_name"-->
    <!--             :model-value="formData.location_name"-->
    <!--             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />-->
    <!--    <q-input filled :label="$t('device_name')"-->
    <!--             :model-value="formData.device_name"-->
    <!--             v-model="formData.device_name"-->
    <!--             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />-->
    <q-select v-for='comp in multiselectComponents'
              :key='comp.mdl'
              behavior='menu'
              filled
              :multiple='comp.multi'
              map-options
              emit-value
              option-value='key'
              option-label='text'
              v-model='formData[comp.mdl]'
              :model-value='formData[comp.mdl]'
              :label='comp.title'
              :options='comp.options'
              :rules="[ val => !comp.multi ? val !== null : val.length > 0 || $t('mandatory_field')]">
      <template v-slot:option='scope' v-if='comp.multi'>
        <q-item v-bind='scope.itemProps'>
          <q-item-section avatar class='q-pr-sm'>
            <q-icon name='radio_button_unchecked' v-if='!scope.itemProps.active' />
            <q-icon name='task_alt' v-if='scope.itemProps.active' />
          </q-item-section>
          <q-item-section class='znz-lang-picker-opt'>
            {{ scope.opt.text }}
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:selected-item='scope'>
        <q-chip color='primary' text-color='white'>
          {{ scope.opt.text }}
        </q-chip>
      </template>
    </q-select>
    <!--    <q-select filled-->
    <!--              map-options-->
    <!--              emit-value-->
    <!--              option-value="key"-->
    <!--              option-label="text"-->
    <!--              v-model="formData.motor_type"-->
    <!--              :model-value="formData.motor_type"-->
    <!--              :options="motorsTypeOptions"-->
    <!--              :label="$t('motor_type')" />-->
    <q-input filled :label="$t('technician_name')"
             v-model='formData.technician_name'
             :rules="[ val => val.length > 0 || $t('mandatory_field')]" />
    <q-input filled
             :label="$t('technician_company')"
             v-model='formData.technician_company'
             :model-value='formData.technician_company'
             :rules="[ val => val.length > 0 || $t('mandatory_field')]" />
    <q-input square filled :label="$tm('install_date')"
             v-model='formData.installation_date'
             :model-value='formData.installation_date'
             mask='date'
             :rules="[ val => val !== null && val.length > 3 || $t('mandatory_field')]">
      <template v-slot:append>
        <q-icon name='event' class='cursor-pointer'>
          <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
            <q-date v-model='formData.installation_date'>
              <!--                    :options='getDatePickerOptions'>-->
              <div class='row items-center justify-end'>
                <q-btn v-close-popup label='Close' color='primary' flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-select :model-value='formData.address'
              v-model='formData.address'
              behavior='menu'
              map-options
              emit-value
              filled
              option-value='id'
              option-label='place_name'
              :label="$t('address')"
              :options='deviceAddresses'
              :rules="[ val => val !== null || $t('mandatory_field')]" />
    <q-card flat class='bg-grey-3'>
      <q-card-section class='sol-receipt-btn-sec'>
        <q-btn flat
               class='bg-grey-5'
               :label="$t('add_receipt')"
               icon='upload'
               @click='openReceiptUploader()'
               size='18px' />
        <a :href='getReceiptDownloadLink' v-if='device.receipt_url'>
          <q-btn flat
                 class='bg-grey-5 full-width'
                 :label="$t('download_receipt')"
                 icon='download'
                 size='18px' />
        </a>
      </q-card-section>
    </q-card>
    <q-btn flat
           class='bg-grey-3'
           :label="$t('add_photo')"
           icon='photo_camera'
           @click='openImageUploader()'
           size='18px' />
    <q-btn color='primary'
           :label="$t('save')"
           @click='$refs.deviceForm.submit()'
           size='18px' />
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
import { useI18n } from 'vue-i18n';
import NotificationsMixins from 'src/mixins/NotificationsMixins';
import DeviceImageParallax from 'components/my-account/DeviceImageParallax';
import DevicesAPI from 'src/api/device';
import CloudinaryAPI from 'src/api/cloudinary';
import { Constants } from 'src/config/constants';

export default defineComponent({
  name: 'DeviceFullView',
  props: ['onBack', 'device'],
  mixins: [NotificationsMixins],
  components: {
    DeviceImageParallax,
  },
  setup(props) {
    const store = useStore();
    const { tm } = useI18n();
    const getDatePickerOptions = (d) => d >= date.formatDate(Date.now(), 'YYYY/MM/DD');
    const deviceAddresses = computed(() => store.state.Addresses.deviceAddresses);
    const colorOptions = tm('patio_color_opts');
    const louverTypeOptions = tm('louver_type_opts');
    const motorsTypeOptions = tm('motor_type_opts');
    const rafterSizes = Array.apply(0, Array(98 - 1)).map((element, index) => ({ text: index + 4, key: index + 4 }));
    const louverSizes = Array.apply(0, Array(21 - 1)).map((element, index) => ({ text: index + 4, key: index + 4 }));
    const amountsOfMotors = Array.from({ length: 20 }, (_, i) => ({ text: i + 1, key: i + 1 }));
    const multiselectComponents = [
      {
        title: tm('pergola_colors'), options: colorOptions, mdl: 'patio_colors', multi: true,
      },
      {
        title: tm('rafter_size'), options: rafterSizes, mdl: 'rafter_size', multi: true,
      },
      {
        title: tm('louver_size'), options: louverSizes, mdl: 'louver_size', multi: true,
      },
      {
        title: tm('louver_type'), options: louverTypeOptions, mdl: 'louver_type', multi: false,
      },
      {
        title: tm('num_motors'), options: amountsOfMotors, mdl: 'amount_of_motors', multi: false,
      },
    ];

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
      patio_colors: null,
      louver_type: null,
      rafter_size: null,
      louver_size: null,
      amount_of_motors: null,
      motor_type: 'TIM_MOTOR',
    });

    const initFormData = () => {
      if (props.device && props.device.id) {
        Object.assign(formData, props.device);
      } else {
        formData.motor_type = Constants.MOTOR_TIM;
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
      colorOptions,
      rafterSizes,
      louverSizes,
      louverTypeOptions,
      amountsOfMotors,
      motorsTypeOptions,
      multiselectComponents,
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

<style lang='scss'>
@import "src/css/mixins";
.sol-device-details-form {
  .q-select__dropdown-icon {
    font-size: 50px;
  }
}
.sol-receipt-btn-sec {
  align-content: center;
  @include setGridAuto(auto, 10px, "rows");

  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>
