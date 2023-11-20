let transactions = [];
let currentBalance = 0;
let savings = 0;

document.getElementById('add-transaction').addEventListener('click', function () {
    const transactionType = document.getElementById('transaction-type').value.trim().toLowerCase();
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionCategory = document.getElementById('transaction-category').value.trim();
    const transactionDate = document.getElementById('transaction-date').value;

    if (isNaN(transactionAmount) || transactionAmount < 0) {
        alert('Invalid amount. Please enter a valid non-negative number.');
        return;
    }

    if (transactionType === 'savings') {
        savings += transactionAmount;
        updateSavings();
    } else {
        const transaction = {
            type: transactionType,
            amount: transactionAmount,
            category: transactionCategory,
            date: transactionDate ? new Date(transactionDate) : new Date()
        };

        transactions.push(transaction);
        updateTransactionList();
    }

    clearTransactionForm();
});

function updateTransactionList() {
    const transactionListElement = document.getElementById('transaction-list');
    transactionListElement.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        const formattedDate = transaction.date.toLocaleDateString('en-US');
        li.textContent = transaction.type === 'expense'
            ? `${transaction.type}: ₹${transaction.amount.toFixed(2)} - ${transaction.category} on ${formattedDate}`
            : `${transaction.type}: ₹${transaction.amount.toFixed(2)} on ${formattedDate}`;
        li.classList.add(transaction.type.toLowerCase());
        transactionListElement.appendChild(li);
    });

    updateCurrentBalance();
    updateSavings();
    updateExpenseDetails();
}

function updateCurrentBalance() {
    const income = transactions.reduce((total, transaction) => (
        transaction.type.toLowerCase() === 'income' ? total + transaction.amount : total
    ), 0);

    const expenses = transactions.reduce((total, transaction) => (
        transaction.type.toLowerCase() === 'expense' ? total + transaction.amount : total
    ), 0);

    currentBalance = income - expenses;

    document.getElementById('current-balance').textContent = `₹${currentBalance.toFixed(2)}`;
}

function updateSavings() {
    document.getElementById('savings').textContent = `₹${savings.toFixed(2)}`;
}

function updateExpenseDetails() {
    const expenseDetailsElement = document.getElementById('expense-details');
    expenseDetailsElement.innerHTML = '';

    const expenseCategories = {};

    transactions.filter(transaction => transaction.type.toLowerCase() === 'expense').forEach(transaction => {
        expenseCategories[transaction.category] = (expenseCategories[transaction.category] || 0) + transaction.amount;

        const li = document.createElement('li');
        li.innerHTML = `<span class="expense-category">${transaction.category}:</span> ₹${transaction.amount.toFixed(2)}`;
        expenseDetailsElement.appendChild(li);
    });
}

function clearTransactionForm() {
    document.getElementById('transaction-form').reset();
}
