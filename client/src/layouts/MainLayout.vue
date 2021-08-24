<template>
  <q-layout view="hHh lpR fFf" class="sol-main-frame">
    <q-header class="bg-white text-primary shadow-1" height-hint="98">
      <q-toolbar>
        <!--        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />-->
        <q-toolbar-title>
          <solara-logo width="120" height="40" class="q-mt-sm" />
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left" narrow-indicator>
        <q-route-tab no-caps
                     v-for="r in $tm('main_tabs')"
                     :to="r.route"
                     :label="r.name"
                     :icon="r.icon"
                     :key="r.route" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay>
      sdfgsdfg
      sdfgsdfg
      sdfgsdfg
    </q-drawer>

    <q-page-container class="full-height">
      <router-view />
    </q-page-container>
    <splash-screen />
    <preloader v-if="processing" fixed />
  </q-layout>
</template>

<script>
import { ref, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';
import SolaraLogo from 'components/icons/SolaraLogo';
import SplashScreen from 'components/splash/SplashScreen';
import AuthAPI from 'src/api/authentication';

export default {
  components: {
    SolaraLogo,
    SplashScreen,
  },
  setup() {
    const store = useStore();
    const processing = computed(() => store.state.General.processing);
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    onBeforeMount(async () => {
      store.commit('General/setMainLoaderState', true);
      await store.dispatch('User/getLoggedInUser');
      await store.dispatch('Devices/getMyDevices');
      await store.dispatch('Addresses/getDeviceAddresses');
      store.commit('General/setMainLoaderState', false);
      // await AuthAPI.orviboLogin();
    });

    return {
      processing,
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
};
</script>
