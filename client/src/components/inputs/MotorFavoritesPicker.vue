<template>
  <q-select :model-value="state"
            v-model="state"
            map-options
            emit-value
            filled
            option-value="key"
            option-label="text"
            :label="$t('mode')"
            :options="options"
            :disable='!user.is_pro'
            @update:model-value="$emit('on-mode-selected', {state, orvibo_id: part.orvibo_id})" />
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';

export default defineComponent({
  name: 'MotorFavoritesPicker',
  props: ['part'],
  setup(props) {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const state = ref(props.part.state);
    const options = [
      { key: 'OPEN', text: 'Open' },
      { key: Constants.MOTOR_QT_OPEN, text: 'Quarter Open' },
      { key: Constants.MOTOR_SEM_OPEN, text: 'Semi Open' },
      { key: Constants.MOTOR_ALM_OPEN, text: 'Almost Open' },
      { key: 'close', text: 'Close' },
    ];
    return {
      options,
      state,
      user,
    };
  },
});
</script>
