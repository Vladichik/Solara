<template>
  <q-select dense outlined label="Weather" :options="options" v-model="selected" map-options emit-value />
  <q-btn dense no-caps color="red" label="Trigger" :loading="processing" @click="simulateWeather" />
</template>

<script>
import { defineComponent, ref } from 'vue';
import DevicesAPI from '../../api/device';

export default defineComponent({
  name: 'WeatherSim',
  setup() {
    const processing = ref(false);
    const selected = ref(null);
    const simulateWeather = async () => {
      if (selected.value) {
        processing.value = true;
        await DevicesAPI.simulateWeather(payloads[selected.value]);
        processing.value = false;
      }
    };

    const options = [
      { label: '', value: null },
      { label: 'Snow', value: 'SNOW' },
      { label: 'Wind', value: 'WIND' },
      { label: 'Rain', value: 'RAIN' },
    ];

    const payloads = {
      SNOW: {
        code: 1066,
        text: 'Snow - Closing',
        time: 720,
        condition: 'SNOW',
        action: 'TurnOff',
      },
      WIND: {
        code: 60,
        text: 'Wind - Opening',
        time: 14,
        condition: 'WIND',
        action: 'TurnOn',
      },
      RAIN: {
        code: 1063,
        text: 'Rain - Closing',
        time: 14,
        condition: 'RAIN',
        action: 'TurnOff',
      },
    };

    // return {

    // };

    // if (this.rainCodes.includes(relForecast.condition.code)) {
    //   return {
    //     code: relForecast.condition.code,
    //     text: relForecast.condition.text,
    //     time: relForecast.time,
    //     condition: 'RAIN',
    //     action: this.actOff,
    //   };
    // }
    // if (relForecast.wind_mph >= this.maxWindSpeed) {
    //   return {
    //     code: relForecast.condition.code,
    //     text: relForecast.condition.text,
    //     time: relForecast.time,
    //     condition: 'WIND',
    //     action: this.actOn,
    //   };
    // }

    return {
      selected,
      options,
      processing,
      simulateWeather,
    };
  },
});
</script>

<style lang="scss">
.sol-devices-list-frame {
  position: relative;
  min-height: 250px;
}

.sol-new-device-btn-frame {
  display: flex;
  justify-content: center;
}
</style>
