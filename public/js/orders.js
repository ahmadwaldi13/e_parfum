// Alradry Paid
function successPay(orderId) {
  console.log(JSON.stringify(orderId))
  fetch(`/user/payment/status/${orderId}`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      if(result.msg === 'expired') {
        const section = document.querySelector("section")
        const overlay = document.querySelector(".overlay")
        const closeBtn = document.querySelector(".close-btn")
        const title = document.querySelector('.title')
        const message = document.querySelector('.message')
        const icon = document.querySelector('.icon')
        const btnClose = document.querySelector('.close-btn')

        title.innerHTML = 'Expired'
        message.innerHTML = 'payment expiration time'
        icon.innerHTML = `<i style="color: red;" class="fas fa-times-circle"></i>`
        btnClose.classList.add('bg-danger')
        section.classList.remove("d-none");
        section.classList.add("active")

        overlay.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
        })

        closeBtn.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
          location.reload()
        })
      } else if(result.msg === 'settlement') {
        const section = document.querySelector("section")
        const overlay = document.querySelector(".overlay")
        const closeBtn = document.querySelector(".close-btn")

        section.classList.remove("d-none");
        section.classList.add("active")

        overlay.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
        })

        closeBtn.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
          location.reload()
        })
      }else if(result.msg === 'pending') {
        const section = document.querySelector("section")
        const overlay = document.querySelector(".overlay")
        const closeBtn = document.querySelector(".close-btn")
        const title = document.querySelector('.title')
        const message = document.querySelector('.message')
        const icon = document.querySelector('.icon')
        const btnClose = document.querySelector('.close-btn')

        title.innerHTML = 'Pending'
        message.innerHTML = "you haven't paid"
        icon.innerHTML = `<i style="color: #FFC107" class="fas fa-exclamation-circle"></i>`
        btnClose.classList.add('bg-warning')
        section.classList.remove("d-none");
        section.classList.add("active")

        overlay.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
        })

        closeBtn.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
          location.reload()
        })
      }
    })
}

// End Already Paid

// Payment Now
// const modalPaymentNow = document.querySelector('[data-target="#staticBackdrop"]')
// modalPaymentNow.addEventListener("click", () => {
//   console.info("Payment Now") 
// })

// Modal Detail
function detail(order) {
  console.info(order)
  // orderId & order date
  const orderDate = document.querySelector('.order-date')
  const orderId = document.querySelector('.order-id')
  const date = new Date(order.order_date)

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }

  const formattedDate = date.toLocaleString('id-ID', options)
  orderId.innerHTML = `OrderId : ${order.transaction_orderId}`
  orderDate.innerHTML = formattedDate

  //product items
  order.product_items.forEach(item => {
    const quantity = document.querySelector('.quantity')
    const productImage = document.querySelector('.product-image')
    const totalPrice = document.querySelector('.price')
    const name = document.querySelector('.order-item')

    quantity.innerHTML = item.order_detail.quantity
    productImage.src = item.product_image
    totalPrice.innerHTML = (item.order_detail.price * item.order_detail.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    name.innerHTML = item.name
  })

  //payment method
  const imgPayment = document.querySelector('.img-payment')
  const accountNumber = document.querySelector('.account-number-order-detail')
  if(order.payment_method.bank === 'bca') {
    imgPayment.src = '/images/icons/bca.png'
    accountNumber.innerHTML = order.payment_method.account_number
  }else if(order.payment_method.bank === 'bni') {
    imgPayment.src = '/images/icons/bni.png'
    accountNumber.innerHTML = order.payment_method.account_number
  }else if(order.payment_method.bank === 'bri') {
    imgPayment.src = '/images/icons/bri.png'
    accountNumber.innerHTML = order.payment_method.account_number
  }

  // order total
  let orderTotal = document.querySelector('.order-total-detail-order')
  orderTotal.innerHTML = order.order_total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })

  // shipping address
  const shippingAddress = JSON.parse(order.shipping_address)
  const paragraf1 = document.getElementById('address1')
  const paragraf2 = document.getElementById('address2')

  const addressLine1 = `${shippingAddress.name}, ${shippingAddress.phone_number}, ${shippingAddress.subdistrict}, ${shippingAddress.postal_code}, ${shippingAddress.city}, ${shippingAddress.province}`
  const addressLine2 = `${shippingAddress.detail_address}`
  
  paragraf1.innerHTML = addressLine1
  paragraf2.innerHTML = addressLine2

  // status order
  const orderStatus = document.querySelector('.order-detail-status')
  orderStatus.innerHTML = `Status: ${order.order_status}`
  
  orderTotal = document.querySelector('.order-total-subscriptions')
  orderTotal.innerHTML = order.order_total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
}
// End Modal Detail

// Modal Payment Now
function paynow(order) {

  fetch(`/user/payment/status/${order.transaction_orderId}`)
    .then((response) => {
      return response.json()
    })
    .then(result => {
      // order status
      const statusPayment = document.querySelector('.status-payment-container')
      if(result.msg === 'pending') {
        statusPayment.classList.remove('d-none')
        const pending = document.querySelector('.pending')
        pending.innerHTML = result.msg
      } else if(result.msg === 'settlement') {
        // return alert('Anda sudah melakukan pembayaran, silahkan klik tombol "already pay" ')

        const section = document.querySelector("section")
        const overlay = document.querySelector(".overlay")
        const closeBtn = document.querySelector(".close-btn")
        const title = document.querySelector('.title')
        const message = document.querySelector('.message')

        title.innerHTML = 'Successfully'
        message.innerHTML = "You have made a payment"
        section.classList.remove("d-none");
        section.classList.add("active")

        overlay.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
        })

        closeBtn.addEventListener("click", (event) => {
          event.stopPropagation()
          section.classList.remove("active")
          location.reload()
        })
      }else {
        statusPayment.classList.remove('d-none')
        const expired = document.querySelector('.other')
        expired.innerHTML = result.msg
      }
      
      // account number
      const accountNumberBca = document.querySelector('.account-number-bca')
      const accountNumberBni = document.querySelector('.account-number-bni')
      const accountNumberBri = document.querySelector('.account-number-bri')
      if(order.payment_method.bank === 'bca') {
        accountNumberBca.classList.remove('d-none')
        const bca = document.querySelector('.account-number-bca-input')
        bca.value = order.payment_method.account_number
        const closeModal = document.querySelector('.close-modal')
        closeModal.addEventListener('click', () => {
          accountNumberBca.classList.add('d-none')
        })
      }else if(order.payment_method.bank === 'bni') {
        accountNumberBni.classList.remove('d-none')
        const bni = document.querySelector('.account-number-bni-input')
        bni.value = order.payment_method.account_number
        const closeModal = document.querySelector('.close-modal')
        closeModal.addEventListener('click', () => {
          accountNumberBni.classList.add('d-none')
        })
      }else if(order.payment_method.bank === 'bri'){
        accountNumberBri.classList.remove('d-none')
        const bri = document.querySelector('.account-number-bri-input')
        bri.value = order.payment_method.account_number
        const closeModal = document.querySelector('.close-modal')
        closeModal.addEventListener('click', () => {
          accountNumberBri.classList.add('d-none')
        })
      }
      
      const expiredDate = document.querySelector('.expired-date')
      const totalPrice = document.querySelector('.total-price')
      const orderTotal = document.querySelector('.order-total')
      const date = new Date(order.payment_method.expiry_date)

      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }

      const formattedDate = date.toLocaleString('id-ID', options)
      expiredDate.innerHTML = formattedDate
      totalPrice.innerHTML = order.order_total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) 
      orderTotal.innerHTML = order.order_total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })  
    })
}
// End Payment Now

