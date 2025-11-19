document.addEventListener('DOMContentLoaded', () => {
  const wishlistButtons = document.querySelectorAll('.add-to-wishlist');

  wishlistButtons.forEach(button => {
    button.addEventListener('click', () => {
      const handle = button.dataset.productHandle;
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (!wishlist.includes(handle)) {
        wishlist.push(handle);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Added to wishlist!');
      }
    });
  });
});
