<template>
  <q-card flat>
    <q-card-section>
      <q-toggle
        :disable='!user.is_pro'
        size='lg'
        v-model='smartMode'
        checked-icon='check'
        color='red'
        :label="$t('auto_patio_msg')"
        @click='setSmartMode'
        unchecked-icon='clear'
      />
    </q-card-section>
    <q-card-section>
      <upgrade-button />
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import UserAPI from 'src/api/user';
import UpgradeButton from '../components/UpgradeButton';

export default {
  name: 'SolaraPro',
  components: {
    UpgradeButton,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const smartMode = ref(false);

    const setSmartMode = async () => {
      if (user.value.is_pro) {
        const updatedUser = { ...user.value };
        updatedUser.smart_active = smartMode.value;
        store.commit('General/setMainLoaderState', true);
        await UserAPI.updateUser(updatedUser);
        await store.dispatch('User/getLoggedInUser');
        store.commit('General/setMainLoaderState', false);
      }
    };

    watch(user, () => {
      if (user.value && user.value.smart_active) {
        smartMode.value = user.value.smart_active;
      }
    });

    return {
      smartMode,
      user,
      setSmartMode,
    };
  },
};
</script>

<style scoped>

</style>
