

/* 
  Cart System Logic
  - Handles adding items, state management, and checkout 
*/
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject "Add to Cart" buttons
    const itemDetails = document.querySelectorAll('.item-details');
    itemDetails.forEach(detail => {
        // Safety: Only add button if item has a price
        const menuItem = detail.closest('.menu-item');
        if (!menuItem || !menuItem.querySelector('.item-price')) return;

        if (!detail.querySelector('.btn-add-cart')) {
            const btn = document.createElement('button');
            btn.className = 'btn-add-cart';
            btn.innerHTML = '<i class="fas fa-shopping-cart cart-icon"></i> Add to Cart';
            detail.appendChild(btn);

            // Add click event
            btn.addEventListener('click', function (e) {
                // Find parent menu-item
                const menuItem = this.closest('.menu-item');
                addItemToCart(menuItem);

                // Temporary Button Feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Added';
                this.style.backgroundColor = '#2ecc71';
                this.style.color = 'white';
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }, 1500);
            });
        }
    });

    // 2. State Management
    let cart = JSON.parse(localStorage.getItem('maharajaCart')) || [];

    // DOM Elements
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartTrigger = document.getElementById('cart-trigger');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total-price');
    const cartCountEl = document.getElementById('cart-count');
    const btnCheckout = document.getElementById('btn-checkout');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutTotalEl = document.getElementById('checkout-total');

    // Initialize UI
    updateCartUI();

    // 3. Functions
    function saveCart() {
        localStorage.setItem('maharajaCart', JSON.stringify(cart));
        updateCartUI();
    }

    function addItemToCart(menuItem) {
        const id = menuItem.querySelector('h3').textContent.trim(); // Use name as ID for simplicity
        const title = menuItem.querySelector('h3').textContent.trim();
        const priceStr = menuItem.querySelector('.item-price').textContent.replace('₹', '').trim();
        const price = parseInt(priceStr);
        const imageSrc = menuItem.querySelector('.item-image').src;

        // Check if item exists
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                title,
                price,
                image: imageSrc,
                quantity: 1
            });
        }

        saveCart();
        // openCart(); // Removed auto-open

        // Trigger Animation
        const img = menuItem.querySelector('.item-image');
        if (img && cartTrigger) {
            flyToCart(img, cartTrigger);
        }
    }

    // New Animation Function
    function flyToCart(sourceImg, targetIcon) {
        const sourceRect = sourceImg.getBoundingClientRect();
        const targetRect = targetIcon.getBoundingClientRect();

        const clone = sourceImg.cloneNode();
        clone.style.position = 'fixed';
        clone.style.left = `${sourceRect.left}px`;
        clone.style.top = `${sourceRect.top}px`;
        clone.style.width = `${sourceRect.width}px`;
        clone.style.height = `${sourceRect.height}px`;
        clone.style.opacity = '0.8';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
        clone.style.borderRadius = '50%'; // Make it round while flying

        document.body.appendChild(clone);

        // Trigger animation in next frame
        requestAnimationFrame(() => {
            clone.style.left = `${targetRect.left}px`;
            clone.style.top = `${targetRect.top}px`;
            clone.style.width = '20px'; // Shrink
            clone.style.height = '20px';
            clone.style.opacity = '0';
        });

        // Cleanup
        setTimeout(() => {
            clone.remove();
            // Pulse the cart icon
            targetIcon.classList.add('cart-pulse');
            setTimeout(() => targetIcon.classList.remove('cart-pulse'), 300);
        }, 800);
    }

    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
    }

    function updateCartUI() {
        // Update Count
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (cartCountEl) cartCountEl.textContent = totalItems;

        // Update Total Price
        const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const formattedPrice = `₹${totalPrice}`;
        if (cartTotalEl) cartTotalEl.textContent = formattedPrice;
        if (checkoutTotalEl) checkoutTotalEl.textContent = formattedPrice;

        // Render Items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div style="text-align: center; margin-top: 50px; color: #888;">
                        <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <p>Your cart is empty.</p>
                    </div>`;
                return;
            }

            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>₹${item.price} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <span style="font-weight:bold;">₹${item.price * item.quantity}</span>
                        <button class="btn-remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);

                // Add remove listener
                itemEl.querySelector('.btn-remove-item').addEventListener('click', () => {
                    removeItem(item.id);
                });
            });
        }
    }

    function openCart() {
        if (cartSidebar) cartSidebar.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('active');
    }

    function closeCart() {
        if (cartSidebar) cartSidebar.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
    }

    // 4. Event Listeners
    if (cartTrigger) {
        cartTrigger.addEventListener('click', openCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            closeCart();
            if (checkoutModal) checkoutModal.classList.add('active');
        });
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.remove('active');
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate Order Placement
            const name = document.getElementById('order-name').value;
            const phone = document.getElementById('order-phone').value;
            const address = document.getElementById('order-address').value;

            if (name && phone && address) {
                // Success
                alert(`Thank you, ${name}! Your order has been placed successfully. Payment of ${cartTotalEl.textContent} to be made on delivery.`);

                // Reset
                cart = [];
                updateCartUI();
                checkoutForm.reset();
                closeCart(); // Close all modals
            }
        });
    }
});
