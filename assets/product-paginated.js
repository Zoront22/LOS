class ProductPaginated extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      container: ".product-paginated-wrap",
      items: ".product-paginated__item",
      prevButton: ".product-paginated__nav-button--prev",
      nextButton: ".product-paginated__nav-button--next",
    };

    this.classes = {
      hidden: "product-paginated__item--hidden",
    };
  }

  connectedCallback() {
    this.container = this.querySelector(this.selectors.container);

    if (!this.container) return;

    const paginatedId = this.dataset.paginatedId;
    
    // Find navigation buttons in the header (outside the container)
    const headerNav = document.querySelector(
      `.featured-collection-paginated__header-navigation[data-paginated-id="${paginatedId}"]`
    );
    
    if (headerNav) {
      this.prevButton = headerNav.querySelector(this.selectors.prevButton);
      this.nextButton = headerNav.querySelector(this.selectors.nextButton);
    } else {
      // Fallback to buttons inside container if header nav not found
      this.prevButton = this.container.querySelector(this.selectors.prevButton);
      this.nextButton = this.container.querySelector(this.selectors.nextButton);
    }

    this.items = this.container.querySelectorAll(this.selectors.items);

    this.productsPerPage = parseInt(
      this.container.dataset.productsPerPage || "4",
      10
    );
    this.totalProducts = parseInt(
      this.container.dataset.totalProducts || "0",
      10
    );
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.totalProducts / this.productsPerPage);

    if (this.items.length === 0 || this.totalPages <= 1) {
      // Hide navigation if there's only one page or no products
      if (this.prevButton) this.prevButton.style.display = "none";
      if (this.nextButton) this.nextButton.style.display = "none";
      return;
    }

    this.controller = new AbortController();

    if (this.prevButton) {
      this.prevButton.addEventListener(
        "click",
        this.handlePrevClick.bind(this),
        { signal: this.controller.signal }
      );
    }

    if (this.nextButton) {
      this.nextButton.addEventListener(
        "click",
        this.handleNextClick.bind(this),
        { signal: this.controller.signal }
      );
    }

    this.updateDisplay();
  }

  handlePrevClick(event) {
    event.preventDefault();
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplay();
    }
  }

  handleNextClick(event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplay();
    }
  }

  updateDisplay() {
    const startIndex = this.currentPage * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;

    // Hide all items first
    this.items.forEach((item) => {
      item.classList.add(this.classes.hidden);
    });

    // Show items for current page
    this.items.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
        item.classList.remove(this.classes.hidden);
      }
    });

    // Update button states
    if (this.prevButton) {
      this.prevButton.disabled = this.currentPage === 0;
    }

    if (this.nextButton) {
      this.nextButton.disabled = this.currentPage >= this.totalPages - 1;
    }
  }

  disconnectedCallback() {
    if (this.controller) {
      this.controller.abort();
    }
  }
}

if (!customElements.get("product-paginated")) {
  customElements.define("product-paginated", ProductPaginated);
}

