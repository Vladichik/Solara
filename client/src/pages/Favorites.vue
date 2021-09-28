<template>
  <q-expansion-item
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
          <q-item class="q-pl-md q-pr-md text-blue-grey-8" v-for="part in device.favorites_set" :key="part.orvibo_id">
            {{ getPartName(part.orvibo_id) }}
          </q-item>
        </q-list>
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

export default defineComponent({
  name: 'Favorites',
  setup() {
    const { generateEnvironments } = OrviboAndSolaraDevicesCombiner();
    const { getPartName } = DataGettersCompositions();
    const store = useStore();
    const environments = reactive([]);
    const myDevices = computed(() => store.state.Devices.myDevices);

    const prepareFavoritesList = () => {
      const env = generateEnvironments();
      Object.assign(environments, env);
      console.log(env);
    };

    onBeforeMount(() => {
      prepareFavoritesList();
    });

    watch(myDevices, () => {
      prepareFavoritesList();
    });

    return {
      environments,
      getPartName,
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
}
</style>
