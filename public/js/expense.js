let currentPage = 1;
let totalPages = 1;
const itemsPerPage = localStorage.getItem('itemsPerPage') || 10;
document.getElementById('itemsPerPage').value = itemsPerPage;
async function fetchExpenses(page) {
  const token = localStorage.getItem('token');
  const perPage = localStorage.getItem('itemsPerPage') || 10;

  try {
    const response = await axios.get(`/expenses?page=${page}&perPage=${perPage}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { expenses, totalPages: total } = response.data;
    totalPages = total;
    currentPage = page;

    displayExpenses(expenses);
    updatePaginationControls();
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
}

window.onload = async function() {

const token = localStorage.getItem('token');
if (!token) {
  alert('Please log in first');
  window.location.href = '/login';
  return;
}
if (localStorage.getItem('isPremium') === 'true') {
document.getElementById('buyPremiumBtn').style.display = 'none';
displayPremiumBadge();
fetchDownloadHistory();
document.getElementById('leaderboardBtn').style.display = 'block';
document.getElementById('expenseFilters').style.display = 'block';
document.getElementById('downloadBtn').style.display = 'block';
}

// const response = await axios.get('/expenses', {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// });

// try {
//     const response = await axios.get('/expenses', {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     displayExpenses(response.data);
//   } catch (error) {
//     console.error('Error fetching expenses:', error);
//   }

//displayExpenses(response.data);

 fetchExpenses(1);
};

// Handle form submission
document.getElementById('expenseForm').onsubmit = async function(event) {
event.preventDefault();
//console.log('gvgvgvghvjjhjjhbhjb');
const amount = document.getElementById('amount').value;
const description = document.getElementById('description').value;
const category = document.getElementById('category').value;

try {
const response = await axios.post(
  '/expenses',
  { amount, description, category },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
);
// displayExpenses([response.data]); // Display the new expense
fetchExpenses(currentPage);
} catch (error) {
console.error('Error adding expense:', error);
}
};

// Display expenses in the list
function displayExpenses(expenses) {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = ''; // Clear current list

  expenses.forEach(expense => {
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.amount} - ${expense.description} (${expense.category})`;
    listItem.setAttribute('data-id', expense.id);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteExpense(expense.id);
    listItem.appendChild(deleteButton);

    expenseList.appendChild(listItem);
  });
}
function updatePaginationControls() {
  document.getElementById('currentPage').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}

document.getElementById('prevPage').onclick = () => {
  if (currentPage > 1) fetchExpenses(currentPage - 1);
};

document.getElementById('nextPage').onclick = () => {
  if (currentPage < totalPages) fetchExpenses(currentPage + 1);
};
document.getElementById('itemsPerPage').onchange = function () {
const selectedValue = this.value;
localStorage.setItem('itemsPerPage', selectedValue); 
fetchExpenses(1); 
};

// Delete expense function
async function deleteExpense(id) {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert('Expense deleted successfully');
    
//     // Refresh the expense list after deletion
//     const expenseItem = document.querySelector(`li[data-id="${id}"]`);
// if (expenseItem) {
//   expenseItem.remove();
// }
fetchExpenses(currentPage);
} catch (error) {
console.error('Error deleting expense:', error);
}
}
//for razorpay
document.getElementById('buyPremiumBtn').onclick = async function () {
const token = localStorage.getItem('token');

try {
const response = await axios.get('/create_order', {
  headers: { Authorization: `Bearer ${token}` },
});
const order = response.data.order;

var options = {
  "key": response.data.key_id,
  "order_id": order.id,
  "handler": async function (paymentResponse) {
    // Successful payment handler
    const token = localStorage.getItem('token');
try {
    // Notify your backend of the successful payment
    const response = await axios.post('/payment/webhook', {
        order_id: order.id,
        payment_id: paymentResponse.razorpay_payment_id,
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });

    // Retrieve the updated token with the premium status
    const newToken = response.data.token;
    
    // Store the updated token in localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('isPremium', 'true');
     
    alert("You are now a Premium User!");

    // Update the UI for premium status
    document.getElementById('buyPremiumBtn').style.display = 'none';
    displayPremiumBadge();
    document.getElementById('leaderboardBtn').style.display = 'block';
    document.getElementById('expenseFilters').style.display = 'block';
    document.getElementById('downloadBtn').style.display = 'block';
} catch (error) {
    console.error("Error processing payment success:", error);
}},
  "modal": {
    "ondismiss": async function () {
      // Payment not completed alert with a retry option
      const tryAgain = confirm("Payment not completed. Would you like to try again?");
      if (tryAgain) {
        // Retry creating the order and marking as FAILED in database
        await axios.post('/payment/webhook', {
          order_id: order.id,
          payment_id: null // Indicate failure with no payment ID
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Call the function again to reopen Razorpay modal
        document.getElementById('buyPremiumBtn').click();
      } else {
        // Mark the order as failed if user doesn't want to retry
        await axios.post('/payment/webhook', {
          order_id: order.id,
          payment_id: null
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Order marked as failed. Please try again later.");
      }
    }
  }
};

const rzp = new Razorpay(options);
rzp.open();
} catch (error) {
console.error("Error initiating payment:", error);
alert("There was an error initiating the payment. Please try again later.");
}
};
function displayPremiumBadge() {
const badge = document.createElement('div');
badge.innerText = 'You are a Premium User!';
badge.style.color = 'gold';
badge.style.position = 'absolute';
badge.style.right = '20px';
badge.style.top = '20px';
document.body.appendChild(badge);
}

// Show leaderboard on button click
document.getElementById('leaderboardBtn').onclick = async function () {
const token = localStorage.getItem('token');

try {
  const response = await axios.get('/leaderboard', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // Display leaderboard data
  displayLeaderboard(response.data);
} catch (error) {
  console.error("Error fetching leaderboard:", error);
}
};

// Function to display leaderboard data
function displayLeaderboard(leaderboard) {
const leaderboardContainer = document.createElement('div');
leaderboardContainer.innerHTML = '<h2>Leaderboard</h2>';

const leaderboardList = document.createElement('ul');
leaderboard.forEach(user => {
  const listItem = document.createElement('li');
  listItem.textContent = `${user.name} (${user.email}) - Total Spent: ${user.totalSpent}`;
  leaderboardList.appendChild(listItem);
});

leaderboardContainer.appendChild(leaderboardList);
document.body.appendChild(leaderboardContainer);
}
function filterExpenses(period) {
const token = localStorage.getItem('token');
axios
.get(`/expenses/filter/${period}`, {
  headers: { Authorization: `Bearer ${token}` },
})
.then((response) => {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = ''; // Clear current list
  displayExpenses(response.data); // Display filtered expenses
})
.catch((error) => {
  console.error(`Error fetching ${period} expenses:`, error);
});
}
document.getElementById('downloadBtn').onclick = async function () {
const token = localStorage.getItem('token');

axios.get('/expenses/download', {
headers: { Authorization: `Bearer ${token}` },
})
.then((response) => {
if(response.status===200){
  var a=document.createElement("a");
  a.href=response.data.fileUrl;
  a.download='myexpense.csv';
  a.click();
}
else{
  throw new Error(response.data.message);
}
fetchDownloadHistory();
}).catch( (error) =>{
console.error('Error downloading expenses:', error);
})
};
async function fetchDownloadHistory() {
const token = localStorage.getItem('token');
try {
  const response = await axios.get('/expenses/download/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const historyList = document.getElementById('downloadHistory');
  historyList.innerHTML = '';
  response.data.fileUrls.forEach(file => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.textContent = file.fileUrl;
    link.target = '_blank';
    listItem.appendChild(link);
    historyList.appendChild(listItem);
  });
} catch (error) {
  console.error('Error fetching download history:', error);
}
}

