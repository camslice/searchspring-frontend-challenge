export function imgLoadedBg(target) {
  const { src, parentNode } = target;
  parentNode.style.backgroundImage = `url(${src})`;
  parentNode.classList.add('reveal');
  parentNode.parentNode.classList.remove('loader');
}

export function formatCurrency({ amount, currency = 'AUD' }) {
  const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
}

export function poll(getVal, callback, { once = false, debug = false } = {}) {
  if (debug) {
    console.log('poll started');
  }
  let oldVal = getVal();
  const interval = setInterval(() => {
    const newVal = getVal();
    if (oldVal !== newVal) {
      if (debug) {
        console.log('poll old value:', oldVal);
        console.log('poll new value:', newVal);
      }
      callback(newVal);
      oldVal = newVal;
      if (once) {
        if (debug) {
          console.log('poll stopped');
        }
        clearInterval(interval);
      }
    }
  }, 300);
}
