const loginBtn = document.querySelector(".login-btn");
const loginForm = document.querySelector(".log-cnt");
const registrationForm = document.querySelector(".reg-cnt");

// Switch between Login and Registration Form 
loginBtn.addEventListener("click", () => {
  loginForm.classList.toggle("hidden");
  registrationForm.classList.toggle("hidden");

  if(registrationForm.classList.contains("hidden")) {
    loginBtn.textContent = "Sign Up";
  }
  else {
    loginBtn.textContent = "Login";
  }
});

// Function to show the payment popup
const showPaymentPopup = () => {
  document.getElementById('paymentPopup').style.display = 'block';
};

// Function to hide the payment popup
const hidePaymentPopup = () => {
  document.getElementById('paymentPopup').style.display = 'none';
};

// Function to handle form submission (Register)
const handleRegistration = async () => {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const batchid = document.getElementById('batch').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate name
  if(!name.trim()) {
    alert('Name cannot be empty.');
    return;
  }
  
  // Validate age
  if(age < 18 || age > 65) {
    alert('Please enter an age between 18 and 65.');
    return;
  }
  
  // Validate email
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Validate password
  if(!password.trim()) {
    alert('Password cannot be empty.');
    return;
  }

  const formData = { name, age, batchid, email, password };

  try {
    const response = await fetch('https://average-lamb-wetsuit.cyclic.app/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const { userID } = await response.json();
      handlePayment(userID, name);
      showPaymentPopup();
    } else {
      console.error('Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Function to handle payment
const handlePayment = async (userID, name) => {
  document.getElementById("paymentUserName").textContent = name;

  try {
    const payNowBtn = document.getElementById('payNowBtn');
    const payLaterBtn = document.getElementById('payLaterBtn');

    payNowBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('https://average-lamb-wetsuit.cyclic.app/api/pay-fee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID }),
        });

        if (response.ok) {
          hidePaymentPopup();
        } else {
          console.error('Payment failed');
        }
      } catch (error) {
        console.error('Payment error:', error);
      }
    });

    payLaterBtn.addEventListener('click', () => {
      hidePaymentPopup();
    });

  } catch (error) {
    console.error('Error in handlePayment:', error);
  }
};

document.getElementById('register').addEventListener('click', handleRegistration);