<template>
  <section :class="['sol-device-control-panel weather-def', getWeatherBackgroundClass(currentWeather)]">
    <navbar :absolute='true'
            :title='getDeviceName(device)'
            :btn-label="$tm('nav_bar.home')" :go-back='goHome' />
    <q-btn flat no-caps
           icon='control_camera'
           class='sol-motors-panel-trigger'
           label='Motors' @click='$refs.motorSelectionPanel.showDialog = true' />
    <div class='sol-control-panel-main full-height'>
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
            <q-btn class='text-blue-grey-7'
                   round color='white'
                   size='lg'
                   @click='triggerMotorsPartialOpening(device, constants.MOTOR_SEM_OPEN)'>
              <i class='sol-ninety-deg'></i>
            </q-btn>
          </div>
        </div>
        <div class='sol-ring-btn-base q-pl-md q-pr-md'>
          <div class='sol-ctr-button-frame'>
            <q-btn class='text-blue-grey-5'
                   round color='white'
                   size='lg'
                   @click='openDevice(device)'>
              <i class='sol-open'></i>
            </q-btn>
            <!--            <span class="text-blue-grey-3">{{ $t('open') }}</span>-->
          </div>
          <q-btn class='sol-control-btn-abs-left text-blue-grey-5'
                 round color='white'
                 size='lg'
                 @click='triggerMotorsPartialOpening(device, constants.MOTOR_QT_OPEN)'>
            <i class='sol-semi-open'></i>
          </q-btn>
          <div>
            <q-btn round color='primary'
                   icon='pause'
                   size='lg'
                   @click='stopProcess(device)' />
          </div>
          <q-btn class='sol-control-btn-abs-right text-blue-grey-5'
                 round color='white'
                 size='lg'
                 @click='triggerMotorsPartialOpening(device, constants.MOTOR_ALM_OPEN)'>
            <i class='sol-semi-closed'></i>
          </q-btn>
          <div class='sol-ctr-button-frame'>
            <q-btn class='text-blue-grey-5'
                   round color='white'
                   size='lg'
                   @click='closeDevice(device)'>
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
import { Constants } from 'src/config/constants';
import MotorSelectionPanel from 'components/dialogs/MotorSelectionPanel';
import DataGettersCompositions from 'src/mixins/DataGettersCompositions';
import DeviceCommander from 'src/mixins/DeviceCommander';
import WeatherDataComposition from 'src/mixins/WeatherDataComposition';
import DevicesAPI from 'src/api/device';
import WeatherAPI from 'src/api/weather';

export default defineComponent({
  name: 'DeviceControlPanel',
  props: ['device', 'goHome'],
  components: {
    MotorSelectionPanel,
  },
  setup(props) {
    const {
      openDevice,
      closeDevice,
      stopProcess,
      triggerMotorsPartialOpening,
    } = DeviceCommander();
    const constants = Constants;
    const { getDeviceName } = DataGettersCompositions();
    const { getWeatherBackgroundClass } = WeatherDataComposition();
    const store = useStore();
    const solaraDevice = ref({});
    const currentWeather = ref({});
    const weatherLocation = ref({});
    const myDevices = computed(() => store.state.Devices.myDevices);

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
              // console.log(weather.data);
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

    onBeforeMount(() => {
      getWeatherForDevice();
      // console.log(props.device);
    });
    return {
      constants,
      currentWeather,
      weatherLocation,
      getIconUrl,
      getCentigradeTemp,
      date,
      getDeviceName,
      openDevice,
      closeDevice,
      stopProcess,
      triggerMotorsPartialOpening,
      saveSelectedMotors,
      getWeatherBackgroundClass,
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
</style>
