<template>
  <nav :class="['sol-nav-bar', {'sol-nav-abs': absolute}]">
    <q-btn flat no-caps icon="chevron_left"
           :color="absolute ? 'white' : 'black'"
           :label="btnLabel"
           :to="to"
           @click="goBack"
           class="sol-nav-back-btn q-pl-none" />
    <h6 class="sol-nav-bar-ttl">{{title}}</h6>
  </nav>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NavBar',
  props: ['title', 'btnLabel', 'to', 'goBack', 'absolute'],
});
</script>

<style lang="scss">
.sol-nav-bar {
  height: 60px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sol-nav-back-btn {
  position: absolute;
  left: 15px;
}

.sol-nav-bar-ttl {
  font-size: 16px;
}

.sol-nav-abs {
  position: absolute;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}
</style>
