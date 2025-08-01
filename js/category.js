import { products } from './products.js';

// Event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    const category = new URLSearchParams(window.location.search).get('category') || '';
    const currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;

    // Update breadcrumb dynamically
    updateBreadcrumb(category);

    // Update the page title dynamically
    updatePageTitle(category);

    // Filter products by category
    const filteredProducts = filterProducts(category);

    // Render products for the current page
    renderProducts(filteredProducts, currentPage);

    // Render pagination dynamically
    renderPagination(filteredProducts.length, currentPage, category);

    // Update the result count dynamically
    updateResultCount(filteredProducts.length, currentPage);
});

// Function to filter products by category
function filterProducts(category) {
    return products.filter(product => 
        product.category_1_text === category || product.category_2_text === category
    );
}

// Function to update the page title dynamically
function updatePageTitle(category) {
    if (category) {
        const decodedCategory = decodeURIComponent(category);
        const pageTitle = document.querySelector('.woocommerce-products-header__title.page-title');
        if (pageTitle) {
            pageTitle.textContent = decodedCategory;
        }
    }
}

// Function to update the breadcrumb dynamically
function updateBreadcrumb(category) {
    if (category) {
        const decodedCategory = decodeURIComponent(category);
        const breadcrumbTrailEnd = document.querySelector('.breadcrumb-trail .trail-end span[itemprop="name"]');
        if (breadcrumbTrailEnd) {
            breadcrumbTrailEnd.textContent = decodedCategory;
        }
    }
}


// Function to update the result count dynamically
function updateResultCount(totalCount, currentPage) {
    const resultCountElement = document.querySelector('.woocommerce-result-count');
    if (resultCountElement) {
        const start = (currentPage - 1) * 9 + 1; // Calculate the starting index for the current page
        const end = Math.min(currentPage * 9, totalCount); // Calculate the ending index for the current page
        resultCountElement.textContent = `Showing ${start}–${end} of ${totalCount} results`;
    }
}

// Helper function to get the 300*300 image from srcset
function getImageSrc(srcset) {
    const srcArray = srcset.split(', ');
    const src300 = srcArray.find(src => src.includes('300x300'));
    return src300 ? src300.split(' ')[0] : '';
}

// Helper function to truncate product names to two words
function truncateName(name) {
    return name.split(' ').slice(0, 2).join(' ');
}


// Function to render pagination dynamically
function renderPagination(totalProducts, currentPage, category) {
    const paginationContainer = document.querySelector('.woocommerce-pagination .page-numbers');
    const totalPages = Math.ceil(totalProducts / 9);

    if (!paginationContainer) {
        console.warn('Pagination container not found.');
        return;
    }

    paginationContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;

        // If the page is the current page, render it as a span with class "current"
        if (page === currentPage) {
            return `
                <li><span class="page-numbers current">${page}</span></li>
            `;
        }

        // Otherwise, render it as a link
        return `
            <li><a class="page-numbers" href="?category=${encodeURIComponent(category)}&page=${page}">${page}</a></li>
        `;
    }).join('');
}


// Function to render products dynamically
function renderProducts(filteredProducts, currentPage) {
    const productList = document.getElementById('product-list');
    if (!productList) {
        console.warn('No element with ID "product-list" found.');
        return;
    }

    productList.innerHTML = ''; // Clear existing products

    const startIndex = (currentPage - 1) * 9;
    const endIndex = startIndex + 9;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);


    productList.innerHTML = productsToDisplay.map((product, index) => {
        // Determine the class based on the position in the row
        let additionalClass = '';
        if (index % 3 === 0) {
            additionalClass = 'first'; // First in the row
        } else if ((index + 1) % 3 === 0) {
            additionalClass = 'last'; // Last in the row
        }

        return `
        <li    class="product has-post-thumbnail instock shipping-taxable purchasable ${additionalClass}">
        <div   class="product-thumb-wrap yith-enabled">
               <img 
               width="300" 
               height="300" 
               src="${getImageSrc(product.image.srcset)}"  
               srcset="${product.image.srcset}" 
               class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail wp-post-image" alt=""  
               sizes="(max-width: 300px) 100vw, 300px"/>
        <div   class="add-to-cart-wrap">
        <a  
               class="button product_type_simple add_to_cart_button ajax_add_to_cart" 
               data-product_id="${product.id.split('-')[1]}" 
               rel="nofollow">Add to cart</a>
        </div>
        <div   class="view-detail-wishlist-wrap">
        <div   class="view-detail-wishlist-inner">
        <div   class="add-to-wishlist-wrap">
        <div   class="yith-wcwl-add-to-wishlist add-to-wishlist-${product.id}">
        <div   class="yith-wcwl-add-button show" style="display:block">
        <a     href="?add_to_wishlist=${product.id}" class="add_to_wishlist" data-product_id="${product.id.split('-')[1]}"><i class="fa fa-heart-o" aria-hidden="true"></i></a>
        <img   src="https://www.prodesigns.com/wordpress-themes/demo/ecommerce-gem/wp-content/plugins/yith-woocommerce-wishlist/assets/images/wpspin_light.gif" class="ajax-loading" alt="loading" width="16" height="16" style="visibility:hidden" />
        </div>
        </div>
        <div   class="clear"></div>
        </div>
        <div   class="view-detail-wrap">
        <a     href="shop-details.html?id=${product.id}" class="view-product"><i class="fa fa-eye" aria-hidden="true"></i></a>
        </div>
        </div>
        </div>
        </div>
        <div   class="product-info-wrap">
        <a     href="shop-details.html?id=${product.id}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
        <h2    class="woocommerce-loop-product__title">${truncateName(product.name)}</h2>
        </a>
        <span  class="price">
        <span  class="woocommerce-Price-amount amount">
        <span  class="woocommerce-Price-currencySymbol">&#36;</span>${product.price}
        </span>
        </span>
        </div>

        </li>
        `;
    }).join('');
}




