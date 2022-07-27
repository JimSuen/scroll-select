<template>
  <el-select ref="selector" v-model="selectValue" multiple>
    <el-option
      v-for="item in displayOptions"
      :key="item.key"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>
<script setup lang="ts">
import { ref, toRefs, watch } from "vue";

interface Option {
  value: string | number;
  key: string | number;
  label: string;
}

interface Props {
  options: Option[];
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
});

const { options } = toRefs(props);
const SIZE = 50;
const index = ref(0);
const displayOptions = ref<Option[]>([]);
const selectValue = ref<null | number | number[]>([]);
const selector = ref<any | null>(null);

const sliceOptions = (idx: number) => {
  const startIndex = idx * SIZE;
  const endIndex = startIndex + SIZE;
  const list = options.value.slice(startIndex, endIndex);
  return list;
};

const filterSelectedOptions = (optionList: Option[]) => {
  if (!Array.isArray(selectValue.value)) {
    return optionList;
  }
  return optionList.filter(
    (item) => !(selectValue.value as number[]).includes(item.value as number)
  );
};

const initScrollListener = () => {
  if (!selector.value) return;
  const popperId = selector.value?.$el
    ?.querySelector(".select-trigger")
    ?.getAttribute("aria-describedby");
  const scrollContainer = document
    .getElementById(popperId)
    ?.querySelector(".el-select__popper .el-select-dropdown__wrap");
  let scrollPosition = 0;
  let allowLoad = true;
  scrollContainer?.addEventListener("scroll", (event: any) => {
    if (!allowLoad) return;
    allowLoad = false;
    setTimeout(() => {
      if (!event.target) return;
      const isFinished = index.value * SIZE > options.value.length;
      if (isFinished) return;
      const { scrollTop, clientHeight, scrollHeight } = event.target;
      const isToUp = scrollTop < scrollPosition;
      if (isToUp) return;
      scrollPosition = scrollTop;
      const LIMIT_BOTTOM = 100;
      const isBottom = scrollHeight - (scrollTop + clientHeight) < LIMIT_BOTTOM;
      if (isBottom) {
        const list = filterSelectedOptions(sliceOptions((index.value += 1)));
        displayOptions.value.push(...list);
      }
      allowLoad = true;
    }, 500);
  });
};

const init = () => {
  displayOptions.value.length = 0;
  if (options.value.length) {
    if (Array.isArray(selectValue.value)) {
      const selectedOptions = options.value.filter((item) =>
        (selectValue.value as number[]).includes(item.value as number)
      );
      displayOptions.value.push(...selectedOptions);
    }
    index.value = 0;
    displayOptions.value.push(
      ...filterSelectedOptions(sliceOptions(index.value))
    );
  }
  initScrollListener();
};

watch(options.value, init, { immediate: true });
</script>

<style scoped></style>
