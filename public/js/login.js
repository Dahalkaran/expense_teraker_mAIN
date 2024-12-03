document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    loginForm.onsubmit = async function (event) {
      event.preventDefault();
  
      const errorMessage = document.getElementById('error-message');
      errorMessage.style.display = 'none';
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await axios.post('/login', { email, password });
  
        alert(response.data.message);
  
        const token = response.data.token;
        console.log(token);
        localStorage.setItem('token', token);
  
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
  
        if (decodedToken.buyPremium) {
          localStorage.setItem('isPremium', true);
        } else {
          localStorage.removeItem('isPremium');
        }
        window.location.href = '/expenses/view';
      } catch (error) {
        errorMessage.textContent =
          error.response?.data?.error || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    };
  
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  
    forgotPasswordBtn.onclick = function () {
      forgotPasswordForm.style.display = 'block';
    };
  
    forgotPasswordForm.onsubmit = async function (event) {
      event.preventDefault();
  
      const email = document.getElementById('forgot-email').value;
      const forgotErrorMessage = document.getElementById('forgot-error-message');
      forgotErrorMessage.style.display = 'none';
  
      try {
        const response = await axios.post('/forgotpassword', { email });
        alert(
          'A password reset email has been sent if the email exists in our system.'
        );
      } catch (error) {
        forgotErrorMessage.textContent =
          error.response?.data?.error || 'An error occurred. Please try again.';
        forgotErrorMessage.style.display = 'block';
      }
    };
  });
  