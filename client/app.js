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
  const formData = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    batch: document.getElementById('batch').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      showPaymentPopup();
    } else {
      console.error('Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Function to handle payment
const handlePayment = async (payNow) => {
  const userID = ''; // Retrieve user ID from somewhere

  try {
    if (payNow) {
      const response = await fetch('http://localhost:3000/api/pay-fee', {
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
    } else {
      hidePaymentPopup();
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};

// Add event listeners to form and buttons
document.getElementById('registrationForm').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission
  handleRegistration();
});

document.getElementById('payNowBtn').addEventListener('click', () => {
  handlePayment(true);
});

document.getElementById('payLaterBtn').addEventListener('click', () => {
  handlePayment(false);
});
