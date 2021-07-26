<template>
  <q-dialog persistent v-model="showDialog">
    <q-card class="sol-dialog-default overflow-hidden">
      <div class="text-h6">{{ $tm('add_device') }}</div>

      <q-card-section class="sol-dialog-content">
        Lorem ipsum dolor sit amet consectetur
        Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut, natus minima, porro labore.
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut,
        natus minima, porro labore.Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at
        omnis vel numquam exercitationem aut, natus minima, porro labore.
      </q-card-section>

      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" @click="$emit('logout-close')" />
        <q-btn unelevated color="primary">{{ $t('add') }}</q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CreateDeviceDialog',
  setup() {
    const showDialog = ref(false);
    return {
      showDialog,
    };
  },
  // data() {
  //   return {
  //     showDialog: false,
  //   };
  // },
  // methods: {},
});
</script>

<style scoped>

</style>
