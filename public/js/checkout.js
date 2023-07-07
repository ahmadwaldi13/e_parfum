// Shipping method ongkir
function shipping() {
    const radio = document.getElementById("imageRadioShipping");
    const img = radio.nextElementSibling.querySelector("img");
    if (radio.disabled) {
        radio.disabled = false;
        img.style.borderColor = "";
        img.style.boxShadow = "none";
        // const shippingCost = 35000
        // const shipping = document.querySelector('.shipping')
        // shipping.innerHTML = '-'
        const totalPrice = document.querySelector('.total_price');
        const orderTotal = Number(totalPrice.innerText.replace(/,00$/, '').replace(/[^0-9]/g, '')) - shippingCost
        totalPrice.innerHTML = orderTotal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      } else {
          radio.disabled = true;
          img.style.borderColor = "#007bff";
          img.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)"
        //   const shippingCost = 35000
        //   const shipping = document.querySelector('.shipping')
        //   shipping.innerHTML = shippingCost.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
          const totalPrice = document.querySelector('.total_price')
          const orderTotal = Number(totalPrice.innerText.replace(/,00$/, '').replace(/[^0-9]/g, ''))
          totalPrice.innerHTML = orderTotal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      }
}
// Order to product
function order(userAddress, cartItemUser) {
    const shippingMethod = document.getElementById('imageRadioShipping')
    const shippingPayment = document.querySelectorAll('.form-check-payment-input')
    const totalPrice = document.querySelector('.total_price')
    const orderTotal = Number(totalPrice.innerText.replace(/,00$/, '').replace(/[^0-9]/g, ''))
    const paymentArray = Array.from(shippingPayment);
    // validation shipping method
    if(!shippingMethod.disabled) {
        const toast = document.querySelector('.toast')
        const toastBody = document.querySelector('.toast-body span')
        toastBody.innerHTML = 'Please select shipping method'
        toast.classList.remove('d-none')
        toast.classList.add('fade', 'show')
        setTimeout(() => {
            toast.classList.remove('fade', 'show')
            toast.classList.add('d-none')
        }, 3500)
    }
    //validating payment method
    const payment = paymentArray.filter(pay => {
        return pay.checked === true
    })
    if(payment.length === 0) {
        const toast = document.querySelector('.toast')
        const toastBody = document.querySelector('.toast-body span')
        toastBody.innerHTML = 'Please select payment type'
        toast.classList.remove('d-none')
        toast.classList.add('fade', 'show')
        setTimeout(() => {
            toast.classList.remove('fade', 'show')
            toast.classList.add('d-none')
        }, 3500)
        return
    }
    // POST to Api
    const spinner = document.getElementById('loader-btn-order')
    spinner.classList.remove('d-none')
    fetch('/user/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payment_type: 'bank_transfer', 
            payment_method: payment[0].value, 
            order_total: orderTotal,
            user_address: userAddress,
            cart_item_user: cartItemUser,
            shipping_method: shippingMethod.value
        })
    })
        .then(response => {
            return response.json()
        })
        .then(() => {
            // Modal Success
            spinner.classList.add('d-none') 
            const section = document.querySelector("section")
            const overlay = document.querySelector(".overlay")
            const closeBtn = document.querySelector(".close-btn")   
            section.classList.remove('d-none')
            section.classList.add("active")

            overlay.addEventListener("click", () =>
            section.classList.remove("active")
            )

            closeBtn.addEventListener("click", () =>
            section.classList.remove("active")
            )
            // End Modal Success
        })
        .catch(err => {
            console.log(err)
        })
}
// End POST to Api

function toOrders() {
    window.location.href = '/user/orders'
}


// remove toast 
function removeToast() {
    const toast = document.querySelector('.toast')
    toast.classList.add('d-none')
  }
// End remove toast


