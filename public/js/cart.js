//ADD TO CART
function toggleChecklist(cartItemId, i) {
    const checkbox = document.getElementById(`product${i}`)
    const minusQty = document.getElementById(`minusBtn${i}`)
    const plusQty = document.getElementById(`plusBtn${i}`)
    const label = checkbox.nextElementSibling
    console.info(cartItemId)
    if (checkbox.checked) {
      label.style.textDecoration = "line-through"
      minusQty.disabled = true
      plusQty.disabled = true   
      fetch('/user/cart/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_default: true,
          cartItemId
        })
      })
        .then(response => {
          if (response) {
            return response.json()
          } else {
            throw new Error('Failed to update cart item. Error: ' + response.status)
          }
        })
        .then((data) => {
            const amount = document.getElementById(`product-amount${i}`).textContent
            const tempTotalPrice = document.getElementById('bold-total-price').textContent
            if(tempTotalPrice ==  0) {
              const totalPrice = document.getElementById('bold-total-price')
              totalPrice.innerHTML = amount
            }else {
              const tempTotalPrice = document.getElementById('bold-total-price').textContent
              const formattedPrice = Number(tempTotalPrice.replace(/,00$/, '').replace(/[^0-9]/g, ''))
              const totalPriceProduct = data.total_price + formattedPrice
              const totalPrice = document.getElementById('bold-total-price')
              totalPrice.innerHTML = totalPriceProduct.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
            }
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      label.style.textDecoration = "none"
      minusQty.disabled = false
      plusQty.disabled = false
      fetch('/user/cart/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_default: false,
          cartItemId
        })
      })
        .then(response => {
          if(response) {
            return response.json()
          } else {
            throw new Error('Failed to update cart item. Error: ' + response.status)
          }
        })
        .then(data => {
            const tempTotalPrice = document.getElementById('bold-total-price').textContent
            const formattedPrice = Number(tempTotalPrice.replace(/,00$/, '').replace(/[^0-9]/g, ''))
            const totalPriceProduct = formattedPrice - data.total_price
            if(totalPriceProduct === 0) {
              const totalPrice = document.getElementById('bold-total-price')
              return totalPrice.innerHTML = 0
            }
            const totalPrice = document.getElementById('bold-total-price')
            totalPrice.innerHTML = totalPriceProduct.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
        })
        .catch(error => {
          console.error(error)
        })
    }
  }

  function minusQty(cartItemId, i) {
    let quantityInput = document.getElementById(`quantityInput${i}`)
    let quantity = parseInt(quantityInput.value)
  
    if (quantity > 1) {
      quantityInput.value = quantity - 1;
      fetch('/user/cart/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: quantityInput.value,
          cartItemId
        })
      })
      .then(response => {
        if (response) {
          return response.json()
        } else {
          throw new Error('Failed to update cart item. Error: ' + response.status)
        }
      })
      .then(data => {
        document.getElementById(`quantityInput${i}`).value = data.quantity
        document.getElementById(`product-amount${i}`).textContent = data.total_price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      })
      .catch(error => {
        console.error(error)
      });
    }
  }
  
  function plusQty(cartItemId, i) {
    let quantityInput = document.getElementById(`quantityInput${i}`)
    let quantity = parseInt(quantityInput.value)
    quantityInput.value = quantity + 1;
    //send value input quantity to server
    fetch('/user/cart/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quantity: quantityInput.value,
        cartItemId
      })
    })
      .then(response => {
        if (response) {
          return response.json()
        } else {
          throw new Error('Failed to update cart item. Error: ' + response.status)
        }
      })
      .then(data => {
          document.getElementById(`quantityInput${i}`).value = data.quantity
          document.getElementById(`product-amount${i}`).textContent = data.total_price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      })
      .catch(error => {
        console.error(error)
      })
  }

  function checkoutBtn() {
    const checkboxs = document.querySelectorAll('input[type=checkbox')
    checkboxChecked = []
    checkboxNoChecked = []
    checkboxs.forEach(checkbox => {
       if(checkbox.checked) {
            return checkboxChecked.push(checkbox)
       }
       if(!checkbox.checked) {
            return checkboxNoChecked.push(checkbox)
        }
    })
    if(checkboxNoChecked.length === checkboxs.length) {
        const toast = document.querySelector('.toast')
        toast.classList.remove('d-none')
        toast.classList.add('fade', 'show')
        setTimeout(() => {
            toast.classList.remove('fade', 'show')
            toast.classList.add('d-none')
        }, 3500)
    }
    if(checkboxChecked.length > 0) {
        const btnCheckout = document.getElementById('btn-checkout')
        btnCheckout.setAttribute('href', '/user/checkout')
    }
  }
  function removeToast() {
    const toast = document.querySelector('.toast')
    toast.classList.add('d-none')
  }

  // END ADD TO CART