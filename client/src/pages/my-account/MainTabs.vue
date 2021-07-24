<template>
  <q-list flat separator>
    <q-item clickable
            v-ripple
            class="q-pt-lg q-pb-lg sol-main-links"
            v-for="item in $tm('my_account_links')"
            :to="item.path"
            :key="item.name">
      <q-item-section>
        <q-item-label>{{item.name}}</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-icon color="grey-5" name="arrow_forward_ios" size="xs" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'MainTabs',
};
</script>

<style scoped>

</style>
