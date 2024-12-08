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
