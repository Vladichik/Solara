<template>
  <q-expansion-item
    default-opened
    v-for="group in environments"
    :key="group.uid"
    expand-separator
    class="bg-primary sol-white-arrow"
    header-class="text-white sol-expansion-head"
    :label="group.deviceName"
  >
    <q-list separator>
      <q-item class="bg-grey-2 sol-favorites-devices-list"
              v-for="device in group.devices"
              :key="device.id">
        <q-item-section class="text-center q-pb-md q-pt-sm">
          <q-item-label>{{ $t(device.assembly_type) }}</q-item-label>
        </q-item-section>
        <q-list class="sol-favorite-parts-list">
          <q-item class="sol-favorite-part-row text-blue-grey-8" v-for="part in device.favorites_set"
                  :key="part.orvibo_id">
            <q-item-section>{{ getPartName(part.orvibo_id) }}</q-item-section>
            <q-item-section>
              <motor-favorites-picker
                :part="part"
                @on-mode-selected="(val) => updateDeviceData(val, device)" />
            </q-item-section>
          </q-item>
        </q-list>
        <q-card flat>
          <q-card-section class='text-center'>
            <q-btn @click="initiateFavoritesProcess(device)" v-if='user.is_pro'>Trigger</q-btn>
            <upgrade-button v-if='!user.is_pro' />
          </q-card-section>
        </q-card>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  onBeforeMount,
  reactive,
} from 'vue';
import { useStore } from 'vuex';
import OrviboAndSolaraDevicesCombiner from 'src/mixins/OrviboAndSolaraDevicesCombiner';
import DataGettersCompositions from 'src/mixins/DataGettersCompositions';
import DeviceCommander from 'src/mixins/DeviceCommander';
import MotorFavoritesPicker from 'components/inputs/MotorFavoritesPicker';
import UpgradeButton from 'components/UpgradeButton';
import DevicesAPI from 'src/api/device';

export default defineComponent({
  name: 'Favorites',
  components: {
    MotorFavoritesPicker,
    UpgradeButton,
  },
  setup() {
    const { generateEnvironments } = OrviboAndSolaraDevicesCombiner();
    const { getPartName } = DataGettersCompositions();
    const { initiateFavoritesProcess } = DeviceCommander();
    const store = useStore();
    const environments = reactive([]);
    const myDevices = computed(() => store.state.Devices.myDevices);
    const user = computed(() => store.state.User.user);

    const prepareFavoritesList = () => {
      const env = generateEnvironments();
      Object.assign(environments, env);
    };

    /**
     * Function that is triggered after each device favorite setup change
     * it saves changed favorites settings in Solara atabase
     * @param pickerData - Selected option object
     * @param device - Object, device which settings have been changed
     * @returns {Promise<void>}
     * Vlad. 01/10/21
     */
    const updateDeviceData = async (pickerData, device) => {
      const partToUpdate = device.favorites_set.find((part) => part.orvibo_id === pickerData.orvibo_id);
      if (!partToUpdate) return;
      store.commit('General/setMainLoaderState', true);
      partToUpdate.state = pickerData.state;
      const updated = await DevicesAPI.updateDevice(device);
      if (updated.status === 200 && updated.data.id) {
        await store.dispatch('Devices/getMyDevices');
      }
      store.commit('General/setMainLoaderState', false);
    };

    onBeforeMount(() => {
      prepareFavoritesList();
    });

    watch(myDevices, () => {
      prepareFavoritesList();
    });

    return {
      user,
      environments,
      getPartName,
      updateDeviceData,
      initiateFavoritesProcess,
    };
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-favorites-devices-list {
  padding: 10px 0 0 0 !important;
  flex-direction: column;

  .q-item__label {
    font-size: 18px;
  }
}

.sol-favorite-parts-list {
  @include setGridAuto(60px, null, "rows");

  .q-item {
    align-items: center;
    border-top: solid 1px lightgray;

    &:last-child {
      border-bottom: solid 1px lightgray;
    }
  }

  .q-item__section {
    margin: 0;
  }
}

.sol-favorite-part-row {
  padding: 0 0 0 15px;
  @include setGrid(1fr 180px, 10px, null, null, "columns");
}
</style>
