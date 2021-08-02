<template>
  <q-dialog persistent v-model="showDialog">
    <q-card class="sol-dialog-default overflow-hidden sol-logout-dlg">
      <div class="text-h6">{{ $tm('confirm_logout') }}</div>
      <span class="q-pa-lg text-center sol-logout-text">{{ $t('logout_msg') }}</span>
      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated
               color="primary"
               @click="logout">
          {{ $t('i_am_sure') }}
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ConfirmLogout',
  setup() {
    const store = useStore();
    const router = useRouter();
    const showDialog = ref(false);

    const logout = () => {
      store.commit('General/setMainLoaderState', true);
      setTimeout(() => {
        store.dispatch('Auth/signOut').then(() => {
          router.push('/authenticate');
          store.commit('General/setMainLoaderState', false);
        });
      }, 1000);
      showDialog.value = false;
    };

    return {
      showDialog,
      logout,
    };
  },
});
</script>

<style lang="scss">
.sol-logout-dlg {
  width: 400px;
}

.sol-logout-text {
  font-size: 16px;
}
</style>
