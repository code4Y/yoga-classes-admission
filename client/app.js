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
    const response = await fetch('https://yoga-classes-admission-bend-code4ys-projects.vercel.app/api/register', {
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
      const response = await fetch('https://yoga-classes-admission-bend-code4ys-projects.vercel.app/api/pay-fee', {
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

document.getElementById('register').addEventListener('click', handleRegistration);
document.getElementById('payNowBtn').addEventListener('click', () => handlePayment(true));
document.getElementById('payLaterBtn').addEventListener('click', () => handlePayment(false));
