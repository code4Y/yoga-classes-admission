const loginBtn = document.querySelector(".login-btn");
const loginForm = document.querySelector(".log-cnt");
const registrationForm = document.querySelector(".reg-cnt");

// URL to hosted server
const hostServerUrl = 'https://average-lamb-wetsuit.cyclic.app';


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
    const response = await fetch(`${hostServerUrl}/api/register`, {
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
        const response = await fetch(`${hostServerUrl}/api/pay-fee`, {
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

// Function to handle Login
const handleLogin = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Validate email
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Validate password
  if (!password.trim()) {
    alert('Password cannot be empty.');
    return;
  }

  const formData = { email, password };

  try {
    const response = await fetch(`${hostServerUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const userData = await response.json();
      updateProfile(userData);
      // Redirect to the profile section
      document.querySelector('.profile').classList.add('visible');
      loginForm.classList.toggle("hidden");
      return;
    } else {
      console.error('Login failed');
      const errorData = await response.json(); // Get error details if available
      console.error('Error details:', errorData);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Function to Update profile
const updateProfile = (userData) => {
  const profileName = document.getElementById('profile-name');
  const profileAge = document.getElementById('profile-age');
  const profileEmail = document.getElementById('profile-email');
  const profileBatch = document.getElementById('profile-batch');
  const profileFeeStatus = document.getElementById('profile-fee-status');
  const payFeesBtn = document.getElementById('pay-fees');
  const changeBatch = document.getElementById('change-batch');

  profileName.textContent = userData.name;
  profileAge.textContent = userData.age;
  profileEmail.textContent = userData.email;
  profileBatch.value = userData.batchID;
  profileFeeStatus.textContent = userData.paymentStatus;

  // Function to disable or enable the select element based on the 1st day of the month
  const disableOrEnableSelect = () => {
    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;

    // Disable select if it's not the 1st day of the month
    if (!isFirstDayOfMonth) {
      profileBatch.disabled = true;
      changeBatch.style.display = 'none';
    } else {
      profileBatch.disabled = false;
      changeBatch.style.display = 'inline';
    }
  };
  
  // Check and set the initial state of the select element
  disableOrEnableSelect();

  // Update batch ID on select change
  changeBatch.addEventListener('click', async () => {
    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;

    if (isFirstDayOfMonth) {
      const newBatchID = profileBatch.value; 

      try {
        const response = await fetch(`/api/change-batch/${userData.userID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newBatchID }),
        });

        if (response.ok) {
          profileBatch.value = newBatchID;
          console.log('Batch ID updated successfully');
        } else {
          console.error('Batch ID update failed');
        }
      } catch (error) {
        console.error('Batch ID update error:', error);
      }
    } else {
      console.log('Batch changes are allowed only on the 1st day of the month');
    }
  });

  // Function to update fee status and hide button
  const updateFeeStatusAndButton = () => {
    profileFeeStatus.textContent = 'PAID';
    payFeesBtn.classList.add('hidden');
  };

  // Fee payment button show on UNPAID fee status
  if (userData.paymentStatus === 'PAID') {
    payFeesBtn.classList.add('hidden');
  } else {
    // User click to pay fee button
    payFeesBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(`${hostServerUrl}/api/pay-fee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: userData.userID }),
        });

        if (response.ok) {
          hidePaymentPopup();
          updateFeeStatusAndButton(); // Update fee status and hide button on successful payment
        } else {
          console.error('Payment failed');
        }
      } catch (error) {
        console.error('Payment error:', error);
      }
    });
  }
};


// Event listener
document.getElementById('register').addEventListener('click', handleRegistration);
document.getElementById('login').addEventListener('click', handleLogin);
document.getElementById('logout').addEventListener('click', () => {
  document.querySelector('.profile').classList.remove('visible');
  registrationForm.classList.toggle("hidden");
});