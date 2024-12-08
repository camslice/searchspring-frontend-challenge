import { defineStore } from 'pinia';
import { toRaw } from 'vue';
import { poll } from '@/utils';

const CART_ITEMS_LOCAL_STORAGE_KEY = 'mt_cart_items';
const CART_TOTAL_LOCAL_STORAGE_KEY = 'mt_cart_total';

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

function getCartItemsDefault() {
  return new Map();
}

function getCartTotalDefault() {
  return 0;
}

function getCartItems() {
  const cartItems = localStorage.getItem(CART_ITEMS_LOCAL_STORAGE_KEY);
  return cartItems ? JSON.parse(cartItems, reviver) : getCartItemsDefault();
}

function getCartTotal() {
  const cartTotal = localStorage.getItem(CART_TOTAL_LOCAL_STORAGE_KEY);
  return cartTotal ? Number(cartTotal) : getCartTotalDefault();
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: getCartItems(),
    total: getCartTotal(),
  }),
  getters: {
    getCountItem(state) {
      return (key) => {
        const group = state.items.get(key);
        return group ? group.length : 0;
      };
    },
    getCountAll(state) {
      let count = 0;
      state.items.forEach((group) => {
        if (group?.length) {
          count += group.length;
        }
      });
      return count;
    },
  },
  actions: {
    write() {
      this.total = this.getCountAll;
      localStorage.setItem(CART_ITEMS_LOCAL_STORAGE_KEY, JSON.stringify(this.items, replacer));
      localStorage.setItem(CART_TOTAL_LOCAL_STORAGE_KEY, JSON.stringify(this.total));
    },
    addItem(item) {
      item = toRaw(item);
      const group = this.items.get(item.id);
      if (group) {
        this.items.set(item.id, [...group, item]);
      } else {
        this.items.set(item.id, [item]);
      }
      this.write();
    },
    removeItem(id) {
      const group = this.items.get(id);
      if (group?.length) {
        this.items.set(id, group.slice(0, -1));
      }
      this.write();
    },
  },
});

export function syncCartStorage() {
  const cart = useCartStore();
  poll(
    () => getCartTotal(),
    (newVal) => {
      cart.total = newVal;
      cart.items = getCartItems();
    },
    { debug: false },
  );
}
