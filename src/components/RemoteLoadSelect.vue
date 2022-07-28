<template>
  <el-select
    ref="selector"
    v-bind="$props"
    filterable
    :filter-method="handleFilter"
    :loading="loading"
  >
    <el-option
      v-for="item in displayOptions"
      :key="typeof item === 'object' ? item.key : item"
      :value="typeof item === 'object' ? item.key : item"
      :label="typeof item === 'object' ? item.key : item"
    ></el-option>
    <el-option disabled v-show="!isFinish" value="-" key="-"
      >数据加载中...</el-option
    >
  </el-select>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue";

interface ObjectOption {
  value: string | number;
  key: string | number;
  label: string;
}

type Options<T> = T[];

interface Props {
  // options: Options<ObjectOption | string | number>;
  total: number;
}

const props = withDefaults(defineProps<Props>(), {
  // options: () => [],
  total: 0,
});

const emits = defineEmits(["load"]);

const { total } = toRefs(props);
const index = ref(0);
const displayOptions = ref<Options<ObjectOption | string | number>>([]);
const loading = ref(true);
const selector = ref<any | null>(null);
let scrollPosition = 0; // 记录当前滚动位置， 用来区分是下拉还是上拉

const isFinish = computed(() => {
  return total.value === displayOptions.value.length;
});

const loadNewOptions = async (idx: number, filterKey?: string) => {
  loading.value = true;
  await emits(
    "load",
    { index: idx, filterKey },
    (list: Options<ObjectOption | string | number>) => {
      displayOptions.value.push(...list);
    }
  );
  loading.value = false;
};

const handleFilter = (val: string) => {
  scrollPosition = 0; // 下拉框位置重置
  index.value = 0;
  displayOptions.value.length = 0;
  loadNewOptions(index.value, val);
};

const initScrollListener = () => {
  if (!selector.value) return;
  const popperId = selector.value?.$el
    ?.querySelector(".select-trigger")
    ?.getAttribute("aria-describedby");
  const selectPopper = document.getElementById(popperId);
  const scrollContainer = selectPopper?.querySelector(
    ".el-select__popper .el-select-dropdown__wrap"
  );

  let allowLoad = true;
  scrollContainer?.addEventListener("scroll", (event: any) => {
    if (!allowLoad) {
      event.preventDefault();
      return;
    }
    allowLoad = false;
    setTimeout(() => {
      if (!event.target) {
        allowLoad = true;
        return;
      }
      const { scrollTop, clientHeight, scrollHeight } = event.target;
      const isToUp = scrollTop < scrollPosition;
      if (isToUp) {
        allowLoad = true;
        return;
      }
      scrollPosition = scrollTop;
      const LIMIT_BOTTOM = 100;
      const isBottom = scrollHeight - (scrollTop + clientHeight) < LIMIT_BOTTOM;
      if (isBottom) {
        loadNewOptions((index.value += 1)).then(() => {
          allowLoad = true;
        });
      } else {
        allowLoad = true;
      }
    }, 500);
  });
};

const init = () => {
  displayOptions.value.length = 0;
  loadNewOptions(index.value);
  initScrollListener();
};

onMounted(init);
</script>

<style scoped></style>
