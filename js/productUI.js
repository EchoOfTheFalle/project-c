import { products } from './products.js';

// Function to get the product ID from the URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to find the product in the array
function getProductById(productId) {
    return products.find(product => product.id === productId);
}

// Function to update the HTML content with the product details
export function updateProductDetails(product) {
    if (!product) {
        console.error('Product not found');
        return;
    }

    // Update product image
    const productWrapper = document.querySelector('.woocommerce-product-gallery__wrapper div');
    const productLink = productWrapper.querySelector('a');
    const productImage = productWrapper.querySelector('img');

    productWrapper.setAttribute('data-thumb', product.image.dataThumb);
    productLink.href = product.image.href;
    productImage.src = product.image.src;
    productImage.setAttribute('data-src', product.image.dataSrc);
    productImage.setAttribute('data-large_image', product.image.dataLargeImage);
    productImage.setAttribute('srcset', product.image.srcset);

    // updating the type links 
    const trailItemLink = document.querySelector('#middle a');
    trailItemLink.href = product.type;

    // updating the type text 
    const trailItemText = document.querySelector('#middle_text');
    trailItemLink.textContent = product.type_text;

    // updating the product name 
    const trailItemName = document.querySelector('#name');
    trailItemName.textContent = product.name;
    
    // Update product title
    const productTitle = document.querySelector('.product_title');
    productTitle.textContent = product.name;

    // Update product price
    const productPrice = document.querySelector('#tert');
    productPrice.textContent = product.price;

    // Update product short description
    const shortProductDescription = document.querySelector('.woocommerce-product-details__short-description p');
    shortProductDescription.textContent = product.shortDescription;

       // Update product short description
     const productDescription = document.querySelector('#description');
     productDescription.textContent = product.description;
   
  // Select the <span> element with the class 'posted_in'
const postedInSpan = document.querySelector('.posted_in');

// Ensure the element exists before proceeding
if (postedInSpan) {
    // Select all <a> tags within the 'posted_in' span
    const categoryLinks = postedInSpan.querySelectorAll('a');

    // Update the first <a> tag
    if (categoryLinks[0]) {
        categoryLinks[0].href = product.category_1_link;
        categoryLinks[0].textContent = product.category_1_text;
    }

    // Update the second <a> tag
    if (categoryLinks[1]) {
        categoryLinks[1].href = product.category_2_link;
        categoryLinks[1].textContent = product.category_2_text;
    }
}
  

 
    // Update product tags
    const tagsSpan = document.querySelector('.tagged_as');
    const tagLinks = tagsSpan.querySelectorAll('a');

    tagLinks[0].href = product.tag_1_link;
    tagLinks[0].textContent = product.tag_1_text;

    if (tagLinks[1]) {
        tagLinks[1].href = product.tag_2_link;
        tagLinks[1].textContent = product.tag_2_text;
    }

    if (tagLinks[2]) {
        tagLinks[2].href = product.tag_3_link;
        tagLinks[2].textContent = product.tag_3_text;
    }

    // Select the input element by its class
const quantityInput = document.querySelector('.input-text.qty.text');

// Change the ID
quantityInput.id = product.id;


    console.log('Product details updated:', product);
}

// Main function to execute the above functions
function main() {
    const productId = getProductIdFromUrl();
    const product = getProductById(productId);
    if (product) {
        console.log('Running script for product ID:', productId);
        updateProductDetails(product);
    } else {
        console.error('No product found for ID:', productId);
    }
}

// Run the main function on page load
window.addEventListener('DOMContentLoaded', main);


// Select the gallery container
const galleryContainer = document.getElementById('gallery-1');

// Step 1: Clear existing content inside the gallery
galleryContainer.innerHTML = '';

// Step 2: Shuffle the array to randomize image order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(0, 9); // return only the first 9 items after shuffling
  }
  
const shuffledProducts = shuffleArray(products);

// Step 3: Loop through the shuffled array and build elements
shuffledProducts.forEach(product => {
  // Create <figure class="gallery-item">
  const figure = document.createElement('figure');
  figure.classList.add('gallery-item');

  // Create <div class="gallery-icon landscape">
  const div = document.createElement('div');
  div.classList.add('gallery-icon', 'landscape');

  // Create <a href="...">
  const a = document.createElement('a');
  a.href = product.type;

  // Create <img ...>
  const img = document.createElement('img');
  img.setAttribute('width', '150');
  img.setAttribute('height', '150');
  img.setAttribute('class', 'attachment-thumbnail size-thumbnail');
  img.setAttribute('alt', product.name);

  // Use srcset from object
  const srcset = product.image.srcset;
  img.setAttribute('srcset', srcset);

  // Extract the 150w image for src
  const matches = srcset.match(/(https:\/\/[^\s]+?150\*150\.jpeg)\s150w/);
  const src150 = matches ? matches[1].replace('*', 'x') : product.image.src;
  img.setAttribute('src', src150);

  // Append everything
  a.appendChild(img);
  div.appendChild(a);
  figure.appendChild(div);
  galleryContainer.appendChild(figure);
});


// Step 2: Helper to split and normalize text into keywords
function extractKeywords(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 1); // Filter out short/common words
}

// Step 3: Calculate relevance score
function calculateRelevanceScore(currentProduct, otherProduct) {
    let score = 0;

    const currentKeywords = [
        ...extractKeywords(currentProduct.category_1_text || ''),
        ...extractKeywords(currentProduct.category_2_text || ''),
        ...extractKeywords(currentProduct.tag_1_text || ''),
        ...extractKeywords(currentProduct.tag_2_text || '')
    ];

    const otherCategoryKeywords = [
        ...extractKeywords(otherProduct.category_1_text || ''),
        ...extractKeywords(otherProduct.category_2_text || '')
    ];
    const otherTagKeywords = [
        ...extractKeywords(otherProduct.tag_1_text || ''),
        ...extractKeywords(otherProduct.tag_2_text || '')
    ];

    currentKeywords.forEach(keyword => {
        if (otherCategoryKeywords.includes(keyword)) {
            score += 2; // category match
        }
        if (otherTagKeywords.includes(keyword)) {
            score += 1; // tag match
        }
    });

    return score;
}

// Step 4: Main logic
function getRelatedProducts(products) {
    const currentId = getProductIdFromUrl();
    const currentProduct = products.find(p => p.id === currentId);
    if (!currentProduct) return [];

    const scoredProducts = products
        .filter(p => p.id !== currentId)
        .map(product => ({
            ...product,
            relevanceScore: calculateRelevanceScore(currentProduct, product)
        }))
        .filter(p => p.relevanceScore > 0) // only show related items
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3); // get top 3 only
    return scoredProducts;
}

// Example usage:
const relatedProducts = getRelatedProducts(products); // assuming productsArray is imported
console.log("Related Products:", relatedProducts);

// You can now use `relatedProducts` to dynamically display them on the page

  // Calculate relevance score
  function calculateScore(baseKeywords, targetKeywords, weight = 1) {
    let score = 0;
    for (const keyword of baseKeywords) {
      for (const target of targetKeywords) {
        if (target.toLowerCase().includes(keyword.toLowerCase())) {
          score += weight * 2;
        }
      }
    }
    return score;
  }

  function displayRelatedProducts() {
    const ul = document.querySelector(".products.columns-3");
    ul.innerHTML = "";
  
    relatedProducts.forEach((product, index) => {
      const imageMatch = product.image.srcset
        .split(", ")
        .find(img => img.includes("300x300") || img.includes("300w")) || product.image.srcset.split(", ")[0];
      const imageUrl = imageMatch.split(" ")[0];
  
      let liClass = "post-108 product type-product status-publish has-post-thumbnail product_cat-clothing product_cat-women product_tag-fashion product_tag-modern instock featured shipping-taxable purchasable product-type-simple";
  
      // Add 'first' to the first item, 'last' to the last item
      if (index === 0) {
        liClass += " first";
      } else if (index === relatedProducts.length - 1) {
        liClass += " last";
      }
      const shortTitle = product.name.split(" ").slice(0, 2).join(" ");

      const li = document.createElement("li");
      li.className = liClass;
      li.innerHTML = `
        <div class="product-thumb-wrap yith-enabled">
          <img width="300" height="300" src="${imageUrl}" srcset="${product.image.srcset}" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail wp-post-image" alt=""  sizes="(max-width: 300px) 100vw, 300px"/>
          <div class="add-to-cart-wrap">
            <a  class="button product_type_simple add_to_cart_button ajax_add_to_cart" data-product_id="${product.id.replace("product-", "")}" rel="nofollow">Add to cart</a>
          </div>
          <div class="view-detail-wishlist-wrap">
            <div class="view-detail-wishlist-inner">
              <div class="add-to-wishlist-wrap">
                <div class="yith-wcwl-add-to-wishlist add-to-wishlist-${product.id}">
                  <div class="yith-wcwl-add-button show" style="display:block">
                    <a href="?add_to_wishlist=${product.id}" class="add_to_wishlist"><i class="fa fa-heart-o" aria-hidden="true"></i></a>
                    <img src="https://www.prodesigns.com/wordpress-themes/demo/ecommerce-gem/wp-content/plugins/yith-woocommerce-wishlist/assets/images/wpspin_light.gif" class="ajax-loading" alt="loading" width="16" height="16" style="visibility:hidden" />
                  </div>
                </div>
                <div class="clear"></div>
              </div>
              <div class="view-detail-wrap">
                <a href="shop-details.html?id=${product.id}" class="view-product"><i class="fa fa-eye" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div class="product-info-wrap">
          <a href="shop-details.html?id=${product.id}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
            <h2 class="woocommerce-loop-product__title">${shortTitle}</h2>
          </a>
          <span class="price">
            <span class="woocommerce-Price-amount amount">
              <span class="woocommerce-Price-currencySymbol">&#36;</span>${product.price}
            </span>
          </span>
        </div>
      `;
      ul.appendChild(li);
    });
  }
  

  // Run when page loads
  window.addEventListener("DOMContentLoaded", displayRelatedProducts);

