// add to cart.js
import { addToCart, logCartItems, loadCartFromStorage } from './cart.js';
import { products } from './products.js';

document.addEventListener('DOMContentLoaded', function() {
   console.log('add-to-cart.js is loaded successfully on the shop page.');
    loadCartFromStorage();
    logCartItems();
    console.log('add to cart.js script is loaded and DOM is fully parsed.');

    // Event listener for adding items to cart
    document.querySelectorAll('.ajax_add_to_cart').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
    
            // Get the product ID from the button's data attribute and prepend "product-"
            const itemId = `product-${this.dataset.product_id}`;
    
            // Find the product in the products array that matches the ID
            const product = products.find(product => product.id === itemId);
    
            if (!product) {
                console.error(`Product with ID ${itemId} not found in the products array.`);
                return;
            }
    
            // Extract the 100x100 image from the srcset
            let image100x100 = '';
            if (product.image && product.image.srcset) {
                const srcset = product.image.srcset;
                const src100x100 = srcset.split(', ').find(src => src.includes('100w'));
                image100x100 = src100x100 ? src100x100.split(' ')[0] : ''; // Extract the URL part
            } else {
                console.error(`Image or srcset is missing for product ID: ${product.id}`);
            }
    
            // Use the product object to populate the necessary details
            const productToAdd = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1, // Default quantity to 1
                image: image100x100 || product.image.dataThumb // Fallback to dataThumb if 100x100 is not found
            };
    
            // Add the product to the cart
            addToCart(productToAdd);
    
            // Log the product being added
            console.log('Adding product to cart:', productToAdd);
    
            // Update button UI
            this.classList.add('added');
            this.textContent = 'Added to Cart';
    
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('added_to_cart')) {
                const viewCartLink = document.createElement('a');
                viewCartLink.href = 'my-accounts/cart.html'; // Replace with your actual cart URL
                viewCartLink.classList.add('added_to_cart');
                viewCartLink.textContent = 'View Cart';
                this.parentNode.insertBefore(viewCartLink, this.nextSibling);
            }
        });
    });

    // Function to handle adding the product and updating the UI
    function handleAddToCart(event) {
        event.preventDefault();
        event.stopImmediatePropagation();  // Ensure no other handlers can override

        console.log('Span clicked, preventing form submission.');

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        console.log('Product ID from URL:', productId);

        // Find the product that matches the ID
        const product = products.find(product => product.id === productId);

        console.log('Product found:', product);

        // Extract the quantity from the form's input field
        const quantityInput = document.querySelector('input[name="quantity"]');
        const quantity = parseInt(quantityInput.value, 10) || 1; // Default to 1 if input is invalid

        console.log('Quantity:', quantity);

        // Check if the product was found
        if (product) {
            let itemId = product.id;
            let productTitle = product.name;
            let productPrice = product.price;
            let productImage = product.image.dataThumb;
            let productQuantity = quantity;

            let productToAdd = {
                id: itemId,
                name: productTitle,
                price: productPrice,
                quantity: productQuantity,
                image: productImage
            };

            addToCart(productToAdd);

            // Update button UI
            console.log('Adding product to cart:', productToAdd);
            
            const existingMessageDiv = document.querySelector('.woocommerce-message');

            // If the div already exists, return
            if (existingMessageDiv) {
                
                return;
            }
        
            // Create a new div with the exact HTML content
            const messageDiv = document.createElement('div');
            messageDiv.className = 'woocommerce-message';
            messageDiv.setAttribute('role', 'alert');
            messageDiv.innerHTML = `
                <a href="my-accounts/cart.html" class="button wc-forward">View cart</a>
                “${productTitle}” has been added to your cart.
            `;
            // Find the woocommerce_breadcrumb element
            const breadcrumbDiv = document.querySelector('.woocommerce-breadcrumb');

            // Check if breadcrumbDiv exists before trying to insert
            if (breadcrumbDiv) {
                // Insert the messageDiv after the breadcrumbDiv
                breadcrumbDiv.parentNode.insertBefore(messageDiv, breadcrumbDiv.nextSibling);
            } else {
                console.error('Breadcrumb element not found');
            }
        } else {
            console.error('Product not found');
        }
    }

    const addToCartSpan = document.querySelector('#singles');
    
    if (addToCartSpan) {
        console.log('Add to Cart span found, attaching event listener.');
        addToCartSpan.addEventListener('click', handleAddToCart);
    } else {
        console.error('Add to Cart span not found');
        logCartItems();
    }
   
});
