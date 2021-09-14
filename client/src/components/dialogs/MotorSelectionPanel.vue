<template>
  <q-dialog v-model="showDialog" position="bottom" @before-show="setDevicesList">
    <q-card style="width: 300px">
      <q-card-section>
        <span class="q-pa-md">{{$t('select_motor')}}</span>
      </q-card-section>
      <q-list separator>
        <q-item class="sol-motor-panel-item" v-if="panelItems.length > 1">
          <span>{{$t('all')}}</span>
          <q-toggle
            v-model="selectedAllState"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            indeterminate-icon="help_outline"
            size="lg"
            :indeterminate-value="null"
          />
        </q-item>
        <q-item v-for="item in panelItems" :key="item.deviceId" class="sol-motor-panel-item">
          <span>{{item.deviceName}}</span>
          <q-toggle
            v-model="selectedMotors"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            size="lg"
            :val="item.deviceId"
          />
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  watch,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'MotorSelectionPanel',
  props: {
    device: Object,
  },
  setup(props) {
    const store = useStore();
    const showDialog = ref(false);
    const selectedAllState = ref(true);
    const panelItems = ref([]);
    const selectedMotors = ref([]);
    const myOrviboDevices = computed(() => store.state.Devices.myOrviboDevices);

    /**
     * Function that populates panel list with real devices from Orvibo
     * according to device ids recorded in solara assembly object
     * Vlad. 14/09/21
     */
    const setDevicesList = () => {
      if (myOrviboDevices.value && myOrviboDevices.value.length) {
        const oIds = props.device.orvibo_ids;
        panelItems.value = myOrviboDevices.value.filter((d) => oIds?.includes(d.deviceId));
      }
    };

    /**
     * Function that set the state of SELECT ALL toggle.
     * Vlad. 14/09/21
     */
    const getIndeterminateState = () => {
      if (!selectedMotors.value.length) {
        selectedAllState.value = false;
      } else if (selectedMotors.value.length === panelItems.value.length) {
        selectedAllState.value = true;
      } else {
        selectedAllState.value = null;
      }
    };

    watch(selectedMotors, (motors) => {
      getIndeterminateState();
    });

    return {
      showDialog,
      panelItems,
      selectedAllState,
      selectedMotors,
      setDevicesList,
    };
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";
.sol-motor-panel-item {
  font-family: Heebo-Regular, sans-serif;
  align-items: center;
  @include setGrid(1fr auto, 10px, null, null, "columns");
}
</style>
