<template>
  <ScrollSelect :options="options" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ScrollSelect from "./components/ScrollSelect.vue";

const options = ref<any[]>([]);

onMounted(() => {
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < 500; index++) {
    options.value.push({
      key: index,
      value: index,
      label: `option-${index}`,
    });
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
