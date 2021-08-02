<template>
  <nav class="sol-nav-bar">
    <q-btn flat no-caps icon="chevron_left"
           color="blue-6"
           :label="btnLabel"
           :to="to"
           class="sol-nav-back-btn q-pl-none" />
    <h6 class="sol-nav-bar-ttl">{{title}}</h6>
  </nav>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NavBar',
  props: ['title', 'btnLabel', 'to'],
});
</script>

<style lang="scss">
.sol-nav-bar {
  height: 80px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sol-nav-back-btn {
  position: absolute;
  left: 24px;
}

.sol-nav-bar-ttl {
  font-size: 16px;
}
</style>
