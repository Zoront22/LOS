// Iske andar yeh hona chahiye:
let initialized = false;

function initLoadMore() {
  if (initialized) return;
  initialized = true;

  const loadMoreBtn = document.querySelector('[js-load-more]');
  const productGrid = document.querySelector('[js-product-grid]');
  const paginationWrapper = document.querySelector('.pagination-wrapper');

  if (!loadMoreBtn || !productGrid) return;

  loadMoreBtn.addEventListener('click', function () {
    const nextUrl = loadMoreBtn.getAttribute('data-next-url') || '/collections/shop-tops?page=2';

    loadMoreBtn.textContent = 'Loading...';

    fetch(nextUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newProducts = doc.querySelector('[js-product-grid]');
        const newPagination = doc.querySelector('.pagination-wrapper');
        const newLoadMore = doc.querySelector('[js-load-more]');

        if (newProducts) {
          productGrid.insertAdjacentHTML('beforeend', newProducts.innerHTML);
        }

        if (paginationWrapper && newPagination) {
          paginationWrapper.innerHTML = newPagination.innerHTML;
        }

        if (newLoadMore) {
          loadMoreBtn.setAttribute('data-next-url', newLoadMore.getAttribute('data-next-url'));
          loadMoreBtn.textContent = 'Load more';
        } else {
          loadMoreBtn.remove();
        }
      })
      .catch(err => {
        console.error('Load more error:', err);
        loadMoreBtn.textContent = 'Try again';
      });
  });
}

window.initLoadMore = initLoadMore;
