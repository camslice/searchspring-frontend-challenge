<template>
  <div class="fixed top-0 z-10 w-full border-b bg-base-100 text-center">
    <Nav v-model="keyword" :loading="loading" @get-products="getProducts" />
  </div>
  <div class="mt-16 p-4 text-center">
    <div class="relative mx-auto max-w-7xl">
      <div class="center-x absolute bottom-0 top-0 z-10 w-full bg-white bg-opacity-80 pt-28" v-if="loading">
        <div class="loading loading-infinity loading-lg text-primary"></div>
        <div>Loading products</div>
      </div>
      <div class="flex flex-wrap" v-if="resultsData.length">
        <Pagination v-bind="paginationData" :keyword="keyword" @change-page="changePage" />
        <div class="w-full p-4 sm:w-1/2 md:w-1/3 lg:w-1/4" v-for="{ id, thumbnailImageUrl, name, price, msrp = 0 } in resultsData" :key="id">
          <div class="card h-full border bg-base-100">
            <figure class="loader border-b">
              <div class="responsive-9x16 conceal relative w-full bg-cover bg-center bg-no-repeat">
                <img class="sr-only" v-if="!thumbnailErrors.includes(thumbnailImageUrl)" :src="thumbnailImageUrl" :alt="name" @load="({ target }) => imgLoadedBg(target)" @error="({ target }) => handleThumbnailError(target, thumbnailImageUrl)" />
                <span class="center absolute text-neutral/50" v-else>No image</span>
              </div>
            </figure>
            <div class="card-body flex-col items-center p-4">
              <h2 class="card-title mb-2 text-lg font-medium leading-6 text-base-content">{{ name }}</h2>
              <div class="card-actions mt-auto w-full items-center justify-between">
                <div>
                  <div class="mr-1 text-neutral/50 line-through" v-if="msrp > price">{{ formatCurrency({ amount: msrp }) }}</div>
                  <div class="text-lg font-medium text-primary">{{ formatCurrency({ amount: price }) }}</div>
                </div>
                <Quantity :item="{ id }" />
              </div>
            </div>
          </div>
        </div>
        <Pagination v-bind="paginationData" :keyword="keyword" @change-page="changePage" />
      </div>
      <div class="w-full pt-20" v-else-if="!loading">
        <svg class="mx-auto my-4 size-12" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 32 32">
          <path fill="currentColor" d="M17.5 13c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm-9 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" />
          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
            <g stroke="currentColor">
              <path d="m23.4 23.4-2.2-2.2M30 27l-3.6-3.4a2 2 0 0 0-2.8 0 2 2 0 0 0 0 2.8L27 30a2 2 0 0 0 2.8 0 2 2 0 0 0 0-2.8z" />
              <circle cx="13" cy="13" r="11.5" />
              <path d="M12 15.5c0-.5.5-1 1-1s1 .5 1 1m3.5-2.5c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm-9 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" />
            </g>
            <g stroke="currentColor">
              <path d="m23.4 23.4-2.2-2.2M30 27l-3.6-3.4a2 2 0 0 0-2.8 0 2 2 0 0 0 0 2.8L27 30a2 2 0 0 0 2.8 0 2 2 0 0 0 0-2.8z" />
              <circle cx="13" cy="13" r="11.5" />
              <path d="M12 15.5c0-.5.5-1 1-1s1 .5 1 1m3.5-2.5c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm-9 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" />
            </g>
          </g>
        </svg>
        <div>No results</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed, reactive } from 'vue';
import axios from 'axios';
import { imgLoadedBg, formatCurrency } from '@/utils.js';
import Nav from '@/components/nav.vue';
import Pagination from '@/components/pagination.vue';
import Quantity from '@/components/quantity.vue';

const API_URL = 'http://api.searchspring.net/api/search/search.json';
const SITE_ID = 'scmq7n';
const PAGE_DEFAULT = 1;
const KEYWORD_DEFAULT = '';

const loading = ref(true);
const thumbnailErrors = ref([]);

const keyword = ref(KEYWORD_DEFAULT);
const page = ref(PAGE_DEFAULT);
const paginationData = ref(null);
const resultsData = ref([]);

function handleThumbnailError(target, url) {
  imgLoadedBg(target);
  thumbnailErrors.value.push(url);
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlKeyword = urlParams.get('q');
  if (urlKeyword) {
    keyword.value = urlKeyword;
  }
  const urlPage = urlParams.get('page');
  if (urlPage) {
    page.value = Number(urlPage);
  }
}

function setUrlParams(clear = false) {
  const urlParams = new URLSearchParams(window.location.search);
  if (clear) {
    keyword.value = KEYWORD_DEFAULT;
    page.value = PAGE_DEFAULT;
    urlParams.delete('q');
    urlParams.delete('page');
  } else {
    if (keyword.value) {
      urlParams.set('q', keyword.value);
    }
    if (page.value) {
      urlParams.set('page', page.value);
    }
  }
  history.replaceState(null, '', urlParams.size ? `?${urlParams.toString()}` : '/');
}

async function getProducts({ clear = false } = {}) {
  setUrlParams(clear);
  const params = {
    siteId: SITE_ID,
    resultsFormat: 'native',
    ...(!clear && {
      q: keyword.value,
      page: page.value,
    }),
  };
  try {
    loading.value = true;
    const { data } = await axios.get(API_URL, { params });
    const { breadcrumbs, facets, filterSummary, merchandising, pagination, resultLayout, results, sorting } = data;
    page.value = pagination.currentPage;
    paginationData.value = pagination;
    resultsData.value = results;
  } catch (error) {
    console.warn(error.response || error);
  } finally {
    loading.value = false;
  }
}

function changePage(newPage) {
  page.value = newPage;
  getProducts();
}

getUrlParams();
getProducts();
</script>
