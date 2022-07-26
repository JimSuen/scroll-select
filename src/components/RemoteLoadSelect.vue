<template>
  <el-select
    ref="selector"
    v-bind="$props"
    v-model="selectedValue"
    :loading="loading"
    :filter-method="handleFilter"
    @change="handleChange"
  >
    <el-option
      v-for="item in displayOptions"
      :key="typeof item === 'object' ? item.key ?? item.value : item"
      :value="typeof item === 'object' ? item.value : item"
      :label="typeof item === 'object' ? item.label : item"
    ></el-option>
    <span v-show="!isFinish && displayOptions.length" class="loading__text">
      数据加载中...
    </span>
  </el-select>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue";

interface ObjectOption {
  value: string | number;
  key?: string | number;
  label?: string;
}

type Options<T> = T[];

interface Props {
  modelValue?: string | number | number[] | string[];
  total: number;
  // eslint-disable-next-line no-unused-vars
  optionFormatter?: (value: string | number) => ObjectOption | string | number; // 将选中值转为下拉框的格式转换
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  optionFormatter: (value: string | number) => value,
});
const emits = defineEmits(["load", "update:modelValue", "change"]);

// 绑定值更新
const selectedValue = ref(props.modelValue);
const handleChange = (value: string | number) => {
  emits("update:modelValue", value);
  emits("change", value);
};

const { total } = toRefs(props);
const index = ref(1);
const displayOptions = ref<Options<ObjectOption | string | number>>([]);
const filterKey = ref<string | undefined>();
const loading = ref(true);
const selector = ref<any | null>(null);
let scrollPosition = 0; // 记录当前滚动位置， 用来区分是下拉还是上拉

const isFinish = computed(() => {
  return displayOptions.value.length >= total.value;
});

const initSelectedOptions = () => {
  if (!selectedValue.value) return [];
  let options: Options<ObjectOption | string | number> = [];
  if (selectedValue?.value && Array.isArray(selectedValue.value)) {
    options = selectedValue.value.map((item: string | number) => {
      return props.optionFormatter?.(item) ?? item;
    });
  } else {
    options = [
      props.optionFormatter?.(selectedValue.value as string | number) ??
        selectedValue.value,
    ];
  }
  return options;
  // }
};

const loadNewOptions = async (idx: number) => {
  loading.value = true;
  await emits(
    "load",
    { index: idx, filterKey: filterKey.value },
    (list: Options<ObjectOption | string | number>) => {
      const filteredOptions = list.filter((item) => {
        if (typeof item === "object") {
          return !(displayOptions.value as Options<ObjectOption>).find(
            (displayItem) =>
              displayItem.value === item.value &&
              displayItem.key === item.key &&
              displayItem.label === item.label
          );
        }
        return !displayOptions.value.includes(item);
      });
      displayOptions.value.push(...filteredOptions);
    }
  );
  loading.value = false;
};

const pushSelectedOptions = () => {
  const selectedOptions = initSelectedOptions();
  if (selectedOptions.length) {
    displayOptions.value.unshift(...selectedOptions);
  }
};

let allowFilter = true;
const handleFilter = (val: string) => {
  filterKey.value = val;
  if (!allowFilter) return;
  allowFilter = false;
  setTimeout(() => {
    scrollPosition = 0; // 下拉框位置重置
    index.value = 1;
    displayOptions.value.length = 0;
    pushSelectedOptions();
    loadNewOptions(index.value);
    allowFilter = true;
  }, 500);
};

let allowLoad = true;
const handleOptionsScroller = (event: Event) => {
  if (isFinish.value) return;
  if (allowLoad) {
    allowLoad = false;
    setTimeout(() => {
      if (event.target) {
        const { scrollTop, clientHeight, scrollHeight } = event.target as any;
        const isToUp = scrollTop < scrollPosition;
        if (!isToUp) {
          scrollPosition = scrollTop;
          const LIMIT_BOTTOM = 100;
          const isBottom =
            scrollHeight - (scrollTop + clientHeight) < LIMIT_BOTTOM;
          if (isBottom) {
            loadNewOptions((index.value += 1)).then(() => {
              allowLoad = true;
            });
          } else {
            allowLoad = true;
          }
        }
      }
      allowLoad = true;
    }, 500);
  } else {
    event.preventDefault();
  }
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
  scrollContainer?.addEventListener("scroll", handleOptionsScroller);
};

const init = () => {
  displayOptions.value.length = 0;
  pushSelectedOptions();
  loadNewOptions(index.value);
  initScrollListener();
};

onMounted(init);

defineExpose({
  reload: () => {
    displayOptions.value.length = 0;
    index.value = 1;
    filterKey.value = undefined;
    loadNewOptions(index.value);
  },
});
</script>

<style scoped>
.loading__text {
  display: block;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #c0c4cc;
  text-align: center;
}
</style>
