<template>
  <div class="conceal flex w-full justify-center gap-x-1 p-4" :class="{ reveal: currentPage }">
    <a class="btn btn-square" :href="hrefPrev" :class="{ 'btn-disabled': !hrefPrev }" @click.prevent="$emit('changePage', previousPage)">
      <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </a>
    <template v-for="{ href, num, stub } in pages">
      <span class="btn btn-square btn-ghost pointer-events-none" v-if="stub">...</span>
      <a class="btn btn-square" v-else :href="href" :class="{ 'btn-primary': num === currentPage }" @click.prevent="$emit('changePage', num)">
        {{ num }}
      </a>
    </template>
    <a class="btn btn-square" :href="hrefNext" :class="{ 'btn-disabled': !hrefNext }" @click.prevent="$emit('changePage', nextPage)">
      <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const RANGE_DEFAULT = 8;

const { begin, currentPage, defaultPerPage, end, nextPage, perPage, previousPage, totalPages, totalResults, keyword } = defineProps({
  begin: Number,
  currentPage: Number,
  defaultPerPage: Number,
  end: Number,
  nextPage: Number,
  perPage: Number,
  previousPage: Number,
  totalPages: Number,
  totalResults: Number,
  keyword: String,
});

function buildHref(page) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('page', String(page));
  if (keyword) {
    urlParams.set('q', keyword);
  }
  return `/?${urlParams.toString()}`;
}

const hrefPrev = computed(() => {
  if (begin === currentPage) {
    return false;
  }
  return buildHref(previousPage);
});

const hrefNext = computed(() => {
  if (!nextPage) {
    return false;
  }
  return buildHref(nextPage);
});

const pages = computed(() => {
  const data = [];

  let rangeFloor = currentPage - RANGE_DEFAULT / 2;
  if (rangeFloor + RANGE_DEFAULT > totalPages) {
    rangeFloor = totalPages - RANGE_DEFAULT;
  }
  if (rangeFloor < 1) {
    rangeFloor = 1;
  }

  if (rangeFloor > 3) {
    data.push({
      num: 1,
      href: buildHref(1),
    });
    data.push({
      stub: true,
    });
  }

  let rangeCeil = rangeFloor + RANGE_DEFAULT;
  if (rangeCeil > totalPages) {
    rangeCeil = totalPages;
  }

  for (let step = rangeFloor; step <= rangeCeil; step++) {
    data.push({
      num: step,
      href: buildHref(step),
    });
  }

  if (rangeCeil < totalPages - 3) {
    data.push({
      stub: true,
    });
    data.push({
      num: totalPages,
      href: buildHref(totalPages),
    });
  }

  return data;
});
</script>
