<template>
  <section :class="['sol-device-control-panel weather-def', getWeatherBackgroundClass(currentWeather)]">
    <navbar :absolute='true'
            :title='getDeviceName(device)'
            :go-back='goHome' />
    <q-btn flat no-caps
           icon='control_camera'
           class='sol-motors-panel-trigger'
           label='Motors' @click='$refs.motorSelectionPanel.showDialog = true' />
    <div class='sol-control-panel-main full-height'>
      <PleaseFillDeviceDetails v-if='!isAllowedToUse' :device='solaraDevice' />
      <div class='sol-weather-content'>
        <div>
          {{ date.formatDate(currentWeather.last_updated_epoch * 1000, 'MMMM Do') }}
        </div>
        <span>{{ weatherLocation.name }}</span>
        <div class='sol-condition-block'>
          <q-img spinner-color='white' :src='getIconUrl' style='height: 80px; width: 80px' />
          <span class='sol-degrees-elem'>{{ getCentigradeTemp }}</span>
        </div>
        <span>{{ currentWeather.condition ? currentWeather.condition.text : '' }}</span>
      </div>
    </div>
    <div class='sol-controls-ring-holder'>
      <div class='sol-controls-ring shadow-5'>
        <div class='sol-ring-btn-upper'>
          <div class='sol-ctr-button-frame'>
            <q-btn :class="['text-blue-grey-7', { 'sol-btn-disabled': processing} ]"
                   :disable='processing'
                   round color='white'
                   size='lg'
                   @click='validateDeviceLockAndTrigger(constants.MOTOR_SEM_OPEN)'>
              <i class='sol-ninety-deg'></i>
            </q-btn>
          </div>
        </div>
        <div class='sol-ring-btn-base q-pl-md q-pr-md'>
          <div class='sol-ctr-button-frame'>
            <q-btn :class="['text-blue-grey-7', { 'sol-btn-disabled': processing} ]"
                   :disable='processing'
                   round color='white'
                   size='lg'
                   @click='validateDeviceLockAndTrigger("open")'>
              <i class='sol-open'></i>
            </q-btn>
            <!--            <span class="text-blue-grey-3">{{ $t('open') }}</span>-->
          </div>
          <q-btn :class="['sol-control-btn-abs-left text-blue-grey-7', { 'sol-btn-disabled': processing} ]"
                 :disable='processing'
                 round color='white'
                 size='lg'
                 @click='validateDeviceLockAndTrigger(constants.MOTOR_QT_OPEN)'>
            <i class='sol-semi-open'></i>
          </q-btn>
          <div>
            <q-btn round color='primary'
                   icon='pause'
                   size='lg'
                   :disable='processingSemi || (!processing && !processingSemi)'
                   @click='stopProcess(device)' />
          </div>
          <q-btn :class="['sol-control-btn-abs-right text-blue-grey-7', { 'sol-btn-disabled': processing} ]"
                 :disable='processing'
                 round color='white'
                 size='lg'
                 @click='validateDeviceLockAndTrigger(constants.MOTOR_ALM_OPEN)'>
            <i class='sol-semi-closed'></i>
          </q-btn>
          <div class='sol-ctr-button-frame'>
            <q-btn :class="['text-blue-grey-7', { 'sol-btn-disabled': processing} ]"
                   :disable='processing'
                   round color='white'
                   size='lg'
                   @click='validateDeviceLockAndTrigger("close")'>
              <i class='sol-closed'></i>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
    <motor-selection-panel :device='device'
                           ref='motorSelectionPanel'
                           @on-panel-close='saveSelectedMotors' />
  </section>
  <unlock-device-dialog ref='unlockDeviceDialog'
                        :device='device'
                        :lock-type='activeLockType'
                        :unlock='triggerRelevantDeviceCommand' />
</template>

<script>
import {
  defineComponent,
  computed,
  ref,
  ComputedRef,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import { date } from 'quasar';
import moment from 'moment';
import { Constants } from 'src/config/constants';
import MotorSelectionPanel from 'components/dialogs/MotorSelectionPanel';
import DataGettersCompositions from 'src/mixins/DataGettersCompositions';
import DeviceCommander from 'src/mixins/DeviceCommander';
import WeatherDataComposition from 'src/mixins/WeatherDataComposition';
import UnlockDeviceDialog from 'components/dialogs/UnlockDeviceDialog';
import PleaseFillDeviceDetails from 'components/home/PleaseFillDeviceDetails';
import DevicesAPI from 'src/api/device';
import WeatherAPI from 'src/api/weather';

export default defineComponent({
  name: 'DeviceControlPanel',
  props: ['device', 'goHome'],
  components: {
    MotorSelectionPanel,
    UnlockDeviceDialog,
    PleaseFillDeviceDetails,
  },
  setup(props) {
    const {
      openDevice,
      closeDevice,
      stopProcess,
      initiateMotorsPartialOpeningProcess,
    } = DeviceCommander();
    const constants = Constants;
    const { getDeviceName } = DataGettersCompositions();
    const { getWeatherBackgroundClass } = WeatherDataComposition();
    const store = useStore();
    const solaraDevice = ref({});
    const currentWeather = ref({});
    const weatherLocation = ref({});
    const unlockDeviceDialog = ref(null);
    const activeLockType = ref(null);
    const operationMode = ref(null);
    const myDevices = computed(() => store.state.Devices.myDevices);
    const processing = computed(() => store.state.General.processing);
    const processingSemi = computed(() => store.state.General.processingSemi);
    const isAllowedToUse = computed(() => {
      if (solaraDevice.value && solaraDevice.value.id) {
        return solaraDevice.value.technician_company.length > 0 && solaraDevice.value.technician_name.length > 0;
      }
      return true;
    });

    const getWeatherForDevice = () => {
      if (myDevices.value && myDevices.value.length) {
        solaraDevice.value = myDevices.value.find((device) => device.orvibo_id === props.device.deviceId);
        if (solaraDevice.value && solaraDevice.value.address) {
          const payload = {
            city: solaraDevice.value.address.city,
            lat: solaraDevice.value.address.lat,
            long: solaraDevice.value.address.long,
          };
          store.commit('General/setMainLoaderState', true);
          WeatherAPI.getWeatherForDevice(payload).then((weather) => {
            store.commit('General/setMainLoaderState', false);
            if (weather.data && weather.data.current) {
              currentWeather.value = weather.data.current;
              weatherLocation.value = weather.data.location;
            } else {
              currentWeather.value = {};
              weatherLocation.value = {};
            }
          });
        }
      }
    };

    /**
     * Computed property that assembles weather icon url from weather api
     * @type {ComputedRef<unknown>}
     * Vlad. 11/09/21
     */
    const getIconUrl = computed(() => {
      if (currentWeather.value && currentWeather.value.condition && currentWeather.value.condition.icon) {
        return `https:${currentWeather.value.condition.icon}`;
      }
      return '';
    });

    /**
     * Function that formats current weather temperature.
     * @type {ComputedRef<unknown>}
     * Vlad. 11/09/21
     */
    const getCentigradeTemp = computed(() => {
      if (currentWeather.value && currentWeather.value.temp_c) {
        return `${Math.round(currentWeather.value.temp_c)}\xB0`;
      }
      return '';
    });

    /**
     * Function that updates selected Motors for device in Solara Database
     * @param selectedMotors - array of motor ids
     * @returns {Promise<void>}
     * Vlad. 14/09/21
     */
    const saveSelectedMotors = async (selectedMotors) => {
      store.commit('General/setMainLoaderState', true);
      const cloned = JSON.parse(JSON.stringify(props.device));
      cloned.selected_ids = selectedMotors;
      Object.assign(props.device, cloned);
      await DevicesAPI.updateDevice(props.device);
      store.commit('General/setMainLoaderState', false);
    };

    const validateDeviceLockAndTrigger = (mode) => {
      const lockTypes = ['lock_snow', 'lock_rain', 'lock_wind'];
      activeLockType.value = lockTypes.find((type) => moment(props.device[type]).isAfter(new Date()));
      if (activeLockType.value && activeLockType.value.length) {
        unlockDeviceDialog.value.showDialog = true;
        operationMode.value = mode;
      } else {
        triggerRelevantDeviceCommand(mode);
      }
    };

    /**
     * Command trigger for different operations
     * @param mode
     * V
     */
    const triggerRelevantDeviceCommand = (mode = operationMode.value) => {
      const partialProcesses = [constants.MOTOR_SEM_OPEN, constants.MOTOR_QT_OPEN, constants.MOTOR_ALM_OPEN];
      if (partialProcesses.includes(mode)) {
        initiateMotorsPartialOpeningProcess(props.device, mode);
      }
      if (mode === 'close') {
        closeDevice(props.device);
      }
      if (mode === 'open') {
        openDevice(props.device);
      }
      if (mode === 'close' || mode === 'open') {
        setTimeout(() => {
          store.commit('General/setMainLoaderState', false);
        }, constants[`${props.device.motor_type}_SPEED`]);
      }
    };

    onBeforeMount(() => {
      getWeatherForDevice();
    });
    return {
      constants,
      processing,
      processingSemi,
      currentWeather,
      weatherLocation,
      getIconUrl,
      getCentigradeTemp,
      activeLockType,
      unlockDeviceDialog,
      isAllowedToUse,
      solaraDevice,
      date,
      getDeviceName,
      openDevice,
      closeDevice,
      stopProcess,
      initiateMotorsPartialOpeningProcess,
      saveSelectedMotors,
      getWeatherBackgroundClass,
      validateDeviceLockAndTrigger,
      triggerRelevantDeviceCommand,
    };
  },
});
</script>

<style lang='scss'>
@import "src/css/mixins";

.sol-device-control-panel {
  height: calc(100vh - 130px);
  position: relative;
}

.sol-control-panel-main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sol-weather-content {
  text-shadow: 1px 1px 1px #000000;
  color: white;
  font-size: 18px;
  justify-items: center;
  @include setGridAuto(auto, 10px, "rows");
}

.sol-controls-ring-holder {
  position: fixed;
  height: 320px;
  width: 100%;
  bottom: -160px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.sol-controls-ring {
  width: 100%;
  height: 100%;
  max-width: 320px;
  background: white;
  margin: 0 10px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
}

.sol-ring-btn-base {
  position: relative;
  width: 100%;
  margin: 0 0 80px 0;
  justify-content: space-between;
  align-items: center;
  @include setGridAuto(auto, null, "columns");
}

.sol-ctr-button-frame {
  justify-items: center;
  @include setGridAuto(auto, 4px, "rows");

  span {
    font-size: 13px;
  }
}

.sol-condition-block {
  align-items: center;
  justify-content: center;
  @include setGridAuto(auto, null, "columns");
}

.sol-degrees-elem {
  font-size: 27px;
}

.sol-motors-panel-trigger {
  position: absolute;
  right: 10px;
  color: white;
  top: 11px;
}

.sol-ring-btn-upper {
  position: absolute;
  top: 10px;
  width: 100%;
  justify-content: center;
  @include setGridAuto(auto, 10px, "columns");
}

.q-btn.disabled.sol-btn-disabled {
  opacity: .4 !important;
}
</style>
