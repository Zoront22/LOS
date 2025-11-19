import CartContent from './cart-content.js';
import './svg-images-loaded-7454cac3.js';
import './events-6c2ed57e.js';

class CartPage extends CartContent {}

if (!customElements.get("cart-page")) {
  customElements.define("cart-page", CartPage);
}
