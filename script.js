const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Example/Default Transactions for Indian context
const dummyTransactions = [
  { id: 1, text: 'Monthly Salary', amount: 25000 },
  { id: 2, text: 'Groceries Store', amount: -1250 },
  { id: 3, text: 'Freelance Design', amount: 4500 },
  { id: 4, text: 'Electric Bill', amount: -950 }
];

// Load from LocalStorage or fall back to dummy placeholder data
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorageTransactions !== null ? localStorageTransactions : dummyTransactions;

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a valid description and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = '';
  amount.value = '';
}

// Generate unique ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Format number to Indian Rupee Currency display style
function formatCurrency(num) {
  return '₹' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Determine sign
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Add class based on sign value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${formatCurrency(Math.abs(transaction.amount))}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
        <span class="material-icons">delete</span>
    </button>
  `;

  list.appendChild(item);
}

// Update the balance, income and expense totals
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  );

  balance.innerText = `${total < 0 ? '-' : ''}${formatCurrency(Math.abs(total))}`;
  money_plus.innerText = `+${formatCurrency(income)}`;
  money_minus.innerText = `-${formatCurrency(expense)}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Sync with Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize Application state
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);