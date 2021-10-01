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
            @update:model-value="$emit('on-mode-selected', {state, orvibo_id: part.orvibo_id})" />
</template>

<script>
import {
  defineComponent,
  ref,
} from 'vue';

export default defineComponent({
  name: 'MotorFavoritesPicker',
  props: ['part'],
  setup(props) {
    const state = ref(props.part.state);
    const options = [
      { key: 'open', text: 'Open' },
      { key: 'quarter_open', text: 'Quarter Open' },
      { key: 'semi_open', text: 'Semi Open' },
      { key: 'almost_open', text: 'Almost Open' },
      { key: 'close', text: 'Close' },
    ];
    return {
      options,
      state,
    };
  },
});
</script>

<style scoped>

</style>
