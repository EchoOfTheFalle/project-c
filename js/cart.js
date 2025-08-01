let cartItems = [];

export function addToCart(product) {
    loadCartFromStorage();
    // Ensure cartItems array exists
// Check if cartItems is an array
if (!Array.isArray(cartItems)) {
 console.log("cartItems was not an array. Initializing it as an empty array.");
 cartItems = []; // Initialize it if it's not an array
}

 let existingItem = cartItems.find(item => item.id === product.id);

 if (existingItem) {
     existingItem.quantity += product.quantity;
 } else {
     cartItems.push(product);
 }

 console.log(`Item with ID ${product.id} added to cart.`);
 logCartItems(); // Log the updated cart items
 saveCartToStorage(); // Save updated cart to localStorage
}


export function initCart() {
    console.log('Cart script initialized.');
    // Load cartItems from localStorage on initialization
    loadCartFromStorage();
    // Call updateCartUI to reflect any pre-existing cart items
    logCartItems();
    updateCartUI()
}


export function initCartpage() {
    console.log('Cart script initialized.hhhhhhhhhhhhhhhhhhhh');
    // Load cartItems from localStorage on initialization
    loadCartFromStorage();
    
    // Call updateCartUI to reflect any pre-existing cart items
    logCartItems();
} 


export function loadCartFromStorage() {
    let storedCart = localStorage.getItem('cartItems');
    cartItems = storedCart ? JSON.parse(storedCart) : [];
}

export function saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCartTotals() {
    console.log('Updating cart totals...');
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    let subtotalElement = document.querySelector('.cart-subtotal td .woocommerce-Price-amount');
    let totalElement = document.querySelector('.order-total td .woocommerce-Price-amount');
    if (subtotalElement && totalElement) {
        subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
        totalElement.innerText = `$${subtotal.toFixed(2)}`;
    }
}

const UI = (() => {
    // Create a new form element
    const form = document.createElement('form');

    // Set attributes for the form
    form.setAttribute('class', 'woocommerce-cart-form');
   

    // Create a new table element
    const table = document.createElement('table');

    // Set attributes for the table
    table.setAttribute('class', 'shop_table shop_table_responsive cart woocommerce-cart-form__contents');
    table.setAttribute('cellspacing', '0');

    // Append the table to the form
    form.appendChild(table);

    // Create a new thead element
    const thead = document.createElement('thead');

    // Set the innerHTML of the thead to the specified content
    thead.innerHTML = `
        <tr>
            <th class="product-remove">&nbsp;</th>
            <th class="product-thumbnail">&nbsp;</th>
            <th class="product-name">Product</th>
            <th class="product-price">Price</th>
            <th class="product-quantity">Quantity</th>
            <th class="product-subtotal">Total</th>
        </tr>
    `;

    // Append the thead to the table
    table.appendChild(thead);

    const cartTableBody = document.createElement('tbody');

    // Append the tbody to the table
    table.appendChild(cartTableBody);


    
 

    
    // Create a new td element with the specified attributes
    const actionsTd = document.createElement('td');
    actionsTd.setAttribute('colspan', '6');
    actionsTd.classList.add('actions');

    // Set the innerHTML of the td element
    actionsTd.innerHTML = `
        
            <div class="coupon">
                        <label for="coupon_code">Coupon:</label> <input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="Coupon code" /> <button type="submit" class="button" name="apply_coupon" value="Apply coupon">Apply coupon</button>
                                                </div>
                
                <button type="submit" class="button" name="update_cart" value="Update cart">Update cart</button>

                
                <input type="hidden" id="woocommerce-cart-nonce" name="woocommerce-cart-nonce" value="e1f65413cd" /><input type="hidden" name="_wp_http_referer" value="/wordpress-themes/demo/ecommerce-gem/cart/" />	
    `;

    // Append the td element to the cartTableBody
    cartTableBody.appendChild(actionsTd);

    // Create a new div element with the specified class
    const cartCollateralsDiv = document.createElement('div');
    cartCollateralsDiv.classList.add('cart-collaterals');

    // Create a new div element with the specified class
    const cartTotalsDiv = document.createElement('div');
    cartTotalsDiv.classList.add('cart_totals');

    // Append the div element to the cartCollateralsDiv
    cartCollateralsDiv.appendChild(cartTotalsDiv);

    // Create an h2 element with the specified text
    const cartTotalsHeading = document.createElement('h2');
    cartTotalsHeading.textContent = 'Cart totals';

    // Append the h2 element to the cartTotalsDiv
    cartTotalsDiv.appendChild(cartTotalsHeading);

    // Create the table element with the specified attributes
    const cartTotalsTable = document.createElement('table');
    cartTotalsTable.setAttribute('cellspacing', '0');
    cartTotalsTable.classList.add('shop_table', 'shop_table_responsive');

    // Append the table element to the cartTotalsDiv
    cartTotalsDiv.appendChild(cartTotalsTable);

    // Set the innerHTML of cartTotalsTable
    cartTotalsTable.innerHTML = `
        <tr class="cart-subtotal">
            <th>Subtotal</th>
            <td data-title="Subtotal">
                <span class="woocommerce-Price-amount amount">383.00</span>
            </td>
        </tr>
        <tr class="order-total">
            <th>Total</th>
            <td data-title="Total">
                <strong><span class="woocommerce-Price-amount amount">383.00</span></strong>
            </td>
        </tr>
    `;

    // Create the div with class "wc-proceed-to-checkout"
    const wcProceedToCheckoutDiv = document.createElement('div');
    wcProceedToCheckoutDiv.className = 'wc-proceed-to-checkout';


    wcProceedToCheckoutDiv.innerHTML = `
       <a href="https://www.prodesigns.com/wordpress-themes/demo/ecommerce-gem/checkout/" class="checkout-button button alt wc-forward">
        Proceed to checkout</a>
    `;
    // Append the div to cartTotalsDiv
    cartTotalsDiv.appendChild(wcProceedToCheckoutDiv);

    // Return an object with references to all created elements
    return {
        form,
        table,
        cartTableBody,
        cartCollateralsDiv,
        cartTotalsDiv,
        wcProceedToCheckoutDiv
    };
})();



function updateCartUI() {

    
    // Select the content area where the cart UI will be updated
    let content = document.querySelector(' #trash');

    // Check if there are items in the cart
    if (cartItems.length === 0) {
        // If there are no items, stop execution
        return;
    }

    // Clear the innerHTML of the content area
    content.innerHTML = '';

    // Append the UI elements from the UI constant to the content area
    content.appendChild(UI.form);

    // Ensure the form is part of the DOM before appending the cart collaterals
    if (UI.form.parentNode) {
        UI.form.parentNode.insertBefore(UI.cartCollateralsDiv, UI.form.nextSibling);
    } else {
        content.appendChild(UI.cartCollateralsDiv);
    }

    cartItems.forEach(item => {
        let row = `
            <tr class="woocommerce-cart-form__cart-item cart_item">
                <td class="product-remove">
                    <a href="#" class="remove" aria-label="Remove this item" data-product_id="${item.id}" data-product_sku="">
                        &times;
                    </a>
                </td>
                <td class="product-thumbnail">
                    <a href="${item.image}">
                        <img width="300" height="300" src="${item.image}" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail wp-post-image" alt="">
                    </a>
                </td>
                <td class="product-name" data-title="Product">
                    <a href="#">${item.name}</a>
                </td>
                <td class="product-price" data-title="Price">
                    <span class="woocommerce-Price-amount amount">
                        <span class="woocommerce-Price-currencySymbol">$</span>${item.price.toFixed(2)}
                    </span>
                </td>
                <td class="product-quantity" data-title="Quantity">
                    <div class="quantity">
                        <label class="screen-reader-text" for="quantity_${item.id}">Quantity</label>
                        <input
                            type="number"
                            id="quantity_${item.id}"
                            class="input-text qty text"
                            step="1"
                            min="0"
                            name="cart[${item.id}][qty]"
                            value="${item.quantity}"
                            title="Qty"
                            size="4"
                            pattern="[0-9]*"
                            inputmode="numeric"
                            aria-labelledby="${item.name} quantity"
                        />
                    </div>
                </td>
                <td class="product-subtotal" data-title="Total">
                    <span class="woocommerce-Price-amount amount">
                        <span class="woocommerce-Price-currencySymbol">$</span>${(item.price * item.quantity).toFixed(2)}
                    </span>
                </td>
            </tr>
        `;

        // Append the row to the table body
        UI.cartTableBody.insertAdjacentHTML('afterbegin', row);
    });

    updateCartTotals();
    updateEventListeners();
    
}




function updateEventListeners() {
    document.querySelectorAll('.product-remove a').forEach(removeBtn => {
        removeBtn.addEventListener('click', function(event) {
            event.preventDefault();
            let itemId = this.dataset.product_id;
            removeFromCart(itemId);
        });
    });

    document.querySelectorAll('.woocommerce-cart-form__cart-item .product-quantity input').forEach(quantityInput => {
        quantityInput.addEventListener('click', function() {
            let itemId = this.name.split('[')[1].split(']')[0];
            let quantity = parseInt(this.value, 10);
            updateCartItemQuantity(itemId, quantity);
        });
    });
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
   
    console.log(`Item with ID ${itemId} removed from cart.`);
    logCartItems(); // Log the updated cart items
    saveCartToStorage(); // Save updated cart to localStorage
    location.reload(); // Reload the page to reflect changes
   
    
  
}


function updateCartItemQuantity(itemId, quantity) {
    let item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity = quantity;
    }
  
    console.log(`Item with ID ${itemId} quantity updated to ${quantity}.`);
    logCartItems(); // Log the updated cart items
    saveCartToStorage(); // Save updated cart to localStorage
    
}

export function logCartItems() {
    console.log('Current cart items:', cartItems);
}


