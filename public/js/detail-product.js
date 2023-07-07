// INSERT INTO PRODUCT TO CART
function addToCart(product) {
    fetch('/user/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_item_id: document.getElementById('product_item_id').value,
        quantity: 1,
        product: product
      })
    })
      .then(response => {
        if (response) {
          updateCartIcon()
          showToast()
        } else {
          throw new Error(`Failed to add item to cart. Error: ${response.status}`)
        }
      })
      .catch(error => {
        console.error(error);
      })
  }
  
  function showToast() {
    const toast = document.querySelector('.toast')
    const toastInstance = new bootstrap.Toast(toast)
    toast.classList.remove('d-none')
    toastInstance.show()
  }
  
  function updateCartIcon() {
    const cartIcon = document.getElementById("cartIcon");
  
    // Menghapus style yang sudah ada pada elemen
    cartIcon.removeAttribute("style");
  
    // Menambahkan gaya langsung untuk menampilkan atau menyembunyikan titik merah
      cartIcon.style.position = "relative";
      cartIcon.style.paddingRight = "5px"; // Atur jarak antara ikon dan titik merah
      cartIcon.style.marginRight = "5px"; // Atur jarak antara ikon dan konten sekitarnya
      cartIcon.style.borderRadius = "50%";
      cartIcon.style.backgroundColor = "red";
      cartIcon.style.width = "10px";
      cartIcon.style.height = "10px";
  }
  // END INTO PRODUCT TO CART
  
  //ORDER DETAIL 
  function changeProductImage(item) {
    // Mendapatkan elemen gambar utama
    const mainImage = document.getElementById('main_product_image')
    // Mengubah sumber gambar utama dan alternatif
    mainImage.src = item.product_image
  
    // Mengubah harga dan ukuran sesuai dengan item produk yang dipilih
    const priceProdItem = document.getElementById('price')
    const size = document.getElementById('size')
    const quantity = document.getElementById('quantity')
    // const fragrance = document.getElementById('fragrance')
    const name = document.getElementById('name')
    const productItemId = document.getElementById('product_item_id')
    const formattedPrice = item.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    priceProdItem.innerHTML = `${formattedPrice}`
    name.innerHTML = item.name
    name.innerHTML = item.name
    productItemId.setAttribute('value', item.id)
    size.innerHTML = item.product_variation_options[0].value
    quantity.innerHTML = item.quantity
    // fragrance.innerHTML = item.product_variation_options[1].value
  }
  // END ORDER DETAIL