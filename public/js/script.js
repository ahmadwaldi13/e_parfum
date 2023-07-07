//REMOVE ADDRESS CONFIRM
function removeAddress(addressId) {
  document.getElementById('removeAddressForm').setAttribute('action', `/user/address/remove/${addressId}?_method=DELETE`)
}
// END REMOVE ADDRESS CONFIRM

//UPDATE ADDRESS
async function showAddress(addressId) {
  fetch(`/user/address/${addressId}`)
    .then(response => {
      return response.json()
    })
    .then(dataAddress => {
      document.getElementById('nameInputUpdate').value = dataAddress.name;
      document.getElementById('phoneInputUpdate').value = dataAddress.phone_number;
      document.getElementById('provinceInputUpdate').value = dataAddress.province;
      document.getElementById('cityInputUpdate').value = dataAddress.city;
      document.getElementById('subdistrictInputUpdate').value = dataAddress.subdistrict;
      document.getElementById('postalCodeInputUpdate').value = dataAddress.postal_code;
      document.getElementById('addressInputUpdate').value = dataAddress.detail_address;
      document.getElementById('addressUpdateForm').setAttribute('action', `/user/address/update/${dataAddress.id}?_method=PATCH`)
    })
    .catch(err => {
      console.info(err)
    })
}
// END ADDRESS UPDATE



// LOGIN
function login() {
  const email = document.getElementById('email-login').value
  const password = document.getElementById('password-login').value

  const spinner = document.getElementById('loader-btn-login');
  spinner.classList.remove('d-none');
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })
    .then(response => {
      return response.json()
    })
    .then(result => {
      if (result.errors) {
        for (const err in result.errors) {
          const errorMessage = result.errors[err][0]
          showToastErrorLogin(errorMessage)
        }
        spinner.classList.add('d-none') 
      } else {
        window.location.href = '/user'
        spinner.classList.add('d-none')
      }
    })
    .catch(error => {
      console.info(error)
    })
}
function showToastErrorLogin(errorMessage) {
  const modalBodyLogin = document.getElementById('modal-body-login')

  const toast = document.createElement('div')
  toast.classList.add('toast', 'align-items-center', 'bg-danger')
  toast.setAttribute('role', 'alert')
  toast.setAttribute('aria-live', 'assertive')
  toast.setAttribute('aria-atomic', 'true')
  toast.style.marginBottom = '5px'
  toast.style.color = '#fff'

  const toastContent = document.createElement('div')
  toastContent.classList.add('d-flex', 'justify-content-between')

  const toastBody = document.createElement('div')
  toastBody.classList.add('toast-body')
  toastBody.id = 'toast-body'
  toastBody.textContent = errorMessage

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('btn-close', 'me-2', 'm-auto')
  closeButton.setAttribute('data-bs-dismiss', 'toast')
  closeButton.setAttribute('aria-label', 'Close')

  toastContent.appendChild(toastBody)
  toastContent.appendChild(closeButton)
  toast.appendChild(toastContent)
  
  modalBodyLogin.insertBefore(toast, modalBodyLogin.querySelector('form'))

  const toastInstance = new bootstrap.Toast(toast)
  toastInstance.show()
}
// END LOGIN

// REGISTER
function register() {
  const username = document.getElementById('username').value
  const email = document.getElementById('email-register').value
  const phone_number = document.getElementById('phone_number').value
  const password = document.getElementById('password-register').value
  const confirm_password = document.getElementById('cofirm_password').value

  const spinner = document.getElementById('loader-btn');
  spinner.classList.remove('d-none');
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      phone_number,
      password,
      confirm_password
    })
  })
    .then(response => {
      if(response.ok) {
        return response.json()
      }
      return response.json()
    })
    .then(result => {
      if (result.errors) {
        for (const err in result.errors) {
          const errorMessage = result.errors[err][0]
          showToastErrorRegister(errorMessage)
        }
        spinner.classList.add('d-none')
      } else {
        showToastSuccess(result.msg)
        spinner.classList.add('d-none') 
      }
    })
    .catch(error => {
      console.error(error)
    })
}
function showToastErrorRegister(errorMessage) {
  const modalBodyRegister = document.getElementById('modal-body-register')

  const toast = document.createElement('div')
  toast.classList.add('toast', 'align-items-center', 'bg-danger')
  toast.setAttribute('role', 'alert')
  toast.setAttribute('aria-live', 'assertive')
  toast.setAttribute('aria-atomic', 'true')
  toast.style.marginBottom = '5px'
  toast.style.color = '#fff'

  const toastContent = document.createElement('div')
  toastContent.classList.add('d-flex', 'justify-content-between')

  const toastBody = document.createElement('div')
  toastBody.classList.add('toast-body')
  toastBody.id = 'toast-body'
  toastBody.textContent = errorMessage

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('btn-close', 'me-2', 'm-auto')
  closeButton.setAttribute('data-bs-dismiss', 'toast')
  closeButton.setAttribute('aria-label', 'Close')

  toastContent.appendChild(toastBody)
  toastContent.appendChild(closeButton)
  toast.appendChild(toastContent)
  
  modalBodyRegister.insertBefore(toast, modalBodyRegister.querySelector('form'))

  const toastInstance = new bootstrap.Toast(toast)
  toastInstance.show()
}
function showToastSuccess(message) {
  const modalBodyRegister = document.getElementById('modal-body-register')

  const toast = document.createElement('div')
  toast.classList.add('toast', 'align-items-center', 'bg-success')
  toast.setAttribute('role', 'alert')
  toast.setAttribute('aria-live', 'assertive')
  toast.setAttribute('aria-atomic', 'true')
  toast.style.marginBottom = '5px'
  toast.style.color = '#fff'

  const toastContent = document.createElement('div')
  toastContent.classList.add('d-flex', 'justify-content-between')

  const toastBody = document.createElement('div')
  toastBody.classList.add('toast-body')
  toastBody.id = 'toast-body'
  toastBody.textContent = message

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('btn-close', 'me-2', 'm-auto')
  closeButton.setAttribute('data-bs-dismiss', 'toast')
  closeButton.setAttribute('aria-label', 'Close')

  toastContent.appendChild(toastBody)
  toastContent.appendChild(closeButton)
  toast.appendChild(toastContent)
  
  modalBodyRegister.insertBefore(toast, modalBodyRegister.querySelector('form'))

  const toastInstance = new bootstrap.Toast(toast)
  toastInstance.show()
}
// END REGISTER

// Loader Page
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  
  setTimeout(() => {
    loader.classList.add("loader--hidden");
    loader.addEventListener("transitionend", () => { 
      document.body.removeChild(loader);
    });
  }, 1300);

});

// End Loader Page

// My Order
  function myOrders() {
    fetch('/user/orders')
  }
// End My Order

