<template>
  <q-list flat separator>
    <q-item clickable
            v-ripple
            class="q-pt-lg q-pb-lg"
            v-for="item in $tm('my_account_links')"
            :to="item.path"
            :key="item.name">
      <q-icon :name="item.icon" size="sm" class="q-pr-md" />
      <q-item-section>
        <q-item-label>{{ item.name }}</q-item-label>
      </q-item-section>
<!--      <q-item-section avatar>-->
<!--        <q-icon color="grey-5" name="arrow_forward_ios" size="xs" />-->
<!--      </q-item-section>-->
    </q-item>
    <q-item clickable
            v-ripple
            class="q-pt-lg q-pb-lg"
            @click="$refs.confirmLogout.showDialog = true">
      <q-icon name="logout" size="sm" class="q-pr-md" />
      <q-item-section>
        <q-item-label>{{ $t('logout') }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <confirm-logout ref="confirmLogout" />
</template>
<script>
import { defineComponent } from 'vue';
import ConfirmLogout from 'components/dialogs/ConfirmLogout';

export default defineComponent({
  name: 'MainTabs',
  components: { ConfirmLogout },
});
</script>

<style scoped>

</style>
