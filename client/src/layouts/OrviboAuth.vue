<template>
  Authenticating....
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AuthAPI from 'src/api/authentication';

export default defineComponent({
  name: 'OrviboAuth',
  setup() {
    const route = useRoute();
    const router = useRouter();
    onBeforeMount(async () => {
      const loggedIn = await AuthAPI.orviboLogin(route.query.code);
      if (loggedIn.data && loggedIn.data.access_token) {
        AuthAPI.setOrviboToken(loggedIn.data);
        await router.push('/home');
      }
    });
  },
});
</script>

<style scoped>

</style>
