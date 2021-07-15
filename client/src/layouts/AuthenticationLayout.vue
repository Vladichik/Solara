<template>
  <section class="sol-auth-view bg-grey-4 full-height q-pr-lg q-pl-lg q-pb-md">
    <div>logo</div>
    <q-tab-panels
      v-model="activeTab"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="sol-auth-panels bg-transparent"
    >
      <q-tab-panel v-for="panel in panels" :name="panel.name" :key="panel.name">
        <component :is="panel.componentName" @set-tab="setActiveTab" />
      </q-tab-panel>
    </q-tab-panels>
  </section>
</template>

<script>
import { ref } from 'vue';
import Login from 'components/auth/Login';
import Signup from 'components/auth/Signup';
import Forgot from 'components/auth/Forgot';

export default {
  name: 'AuthenticationLayout',
  components: {
    Login,
    Signup,
    Forgot,
  },
  setup() {
    const activeTab = ref('signup');
    const panels = [
      {
        componentName: 'Login',
        name: 'login',
      },
      {
        componentName: 'Signup',
        name: 'signup',
      },
      {
        componentName: 'Forgot',
        name: 'forgot',
      },
    ];
    const setActiveTab = (aTab) => {
      activeTab.value = aTab;
    };
    return {
      activeTab,
      panels,
      setActiveTab,
    };
  },
};
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-auth-view {
  justify-items: center;
  @include setGrid(null, null, 100px 1fr, null, "rows");
}
.sol-auth-panels {
  max-width: 600px;
  width: 100%;
}

.sol-auth-form-grid {
  @include setGridAuto(auto, 10px, "rows");
}
</style>
