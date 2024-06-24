const expensesContainer = document.getElementById("expenses");
const budgetInput = document.getElementById("budget");
const totalExpenses = document.getElementById("total-expenses");
const remainingBudget = document.getElementById("remaining-budget");

/**
 * This function updates the summary of the budget calculator.
 * It calculates the total expense count and remaining budget count.
 * It then updates the displayed values of total expenses and remaining budget.
 */
const updateSummary = () => {
  // Get all the children of the expensesContainer
  const expenseItems = [...expensesContainer.children];

  // Reduce the expense items to a single value (the total expense count)
  // For each expense item, add the value of the second input field to the accumulator
  const totalExpenseCount = expenseItems.reduce(
    (accumulator, currentExpense) => {
      // Get the second child of the current expense item (the input field for the amount)
      const amountInput = currentExpense.children[0].children[1];

      // Convert the value of the input field to a number and add it to the accumulator
      return accumulator + Number(amountInput.value);
    },
    // Initialize the accumulator with 0
    0
  );

  // Calculate the remaining budget count by subtracting the total expense count from the budget input value
  const remainingBudgetCount = budgetInput.value - totalExpenseCount;

  // Update the displayed value of total expenses
  totalExpenses.textContent = totalExpenseCount;

  // Update the displayed value of remaining budget
  remainingBudget.textContent = remainingBudgetCount;
};

const createExpenseCards = (item) => {
  const newExpense = document.createElement("li");
  newExpense.classList.add("expense");

  // Set the innerHTML of the new expense
  newExpense.innerHTML = `
      <div>
        <input id="expense-item-name" value="${item.name}" disabled/>
        <input id="expense-item-amount" value="${item.amount}" disabled/>
      </div>
      <div class="expense-buttons">
        <!-- Add an edit button with the item id as data attribute -->
        <button class="edit-btn" data-id="${item.id}" onclick="editExpense(event)">Edit</button>
        <!-- Add a save button with the item id as data attribute -->
        <button class="save-btn hide" data-id="${item.id}" onclick="saveChanges(event)">Save</button>
        <!-- Add a delete button with the item id as data attribute -->
        <button class="delete-btn" onclick="deleteExpense(event)" data-id="${item.id}">Delete</button>
      </div>
    `;

  // Append the new expense to the expenses list
  expensesContainer.appendChild(newExpense);
};

// Add expense

/**
 * This function adds an expense to the expenses list and updates the summary.
 * It first retrieves the expense name and amount from the input fields.
 * If either of the input fields is empty, it displays an alert and returns early.
 * Otherwise, it creates a new expense item with the name, amount, and a unique id.
 * It then appends a new expense card to the expenses list with the item details.
 * It retrieves the current list of items from local storage, adds the new item to the list,
 * and updates the local storage with the new list.
 * Finally, it clears the expense name and amount input fields and updates the summary.
 */
const addExpense = () => {
  // Retrieve the expense name and amount from the input fields
  const expenseName = document.getElementById("expense-name");
  const expenseAmount = document.getElementById("expense-amount");

  // If either of the input fields is empty, display an alert and return early
  if (expenseName.value === "" || expenseAmount.value === "") {
    alert("Please fill in all fields");
    return;
  }

  // Create a new expense item with the name, amount, and a unique id
  const item = {
    name: expenseName.value,
    amount: expenseAmount.value,
    id: new Date().getTime(),
  };

  // Append a new expense card to the expenses list with the item details
  createExpenseCards(item);

  // Retrieve the current list of items from local storage
  const items = getItems();

  // Add the new item to the list
  items.push(item);

  // Update the local storage with the new list
  setItems(items);

  // Clear the expense name and amount input fields
  expenseName.value = "";
  expenseAmount.value = "";

  // Update the summary
  updateSummary();
};

// Get and setItems from local storage

const getItems = () => {
  const items = JSON.parse(localStorage.getItem("expenses")) || [];
  return items;
};

const setItems = (items) => {
  localStorage.setItem("expenses", JSON.stringify(items));
};

// Update summary when budget changes

budgetInput.addEventListener("keyup", (event) => {
  if ([...expensesContainer.children].length) {
    localStorage.setItem("budget", event.target.value);
    console.log(event.target.value);
    updateSummary();
  }
});

// Delete expense

/**
 * This function deletes an expense from the list and updates the local storage.
 *
 * @param {Event} event - The event that triggers the function.
 *
 * The function removes the parent element of the target of the event from the DOM.
 * It retrieves the items from local storage.
 * It gets the id of the expense from the data attribute of the target element.
 * It creates a new array of items with all items where the id is not equal to the id of the expense.
 * It updates the local storage with the new array of items.
 * It updates the summary.
 */
const deleteExpense = (event) => {
  // Remove the parent element of the target of the event from the DOM
  event.target.parentElement.parentElement.remove();

  // Retrieve the items from local storage
  const items = getItems();

  // Get the id of the expense from the data attribute of the target element
  const id = event.target.dataset.id;

  // Create a new array of items with all items where the id is not equal to the id of the expense
  const updatedItems = items.filter((item) => item.id != id);

  // Update the local storage with the new array of items
  setItems(updatedItems);

  // Update the summary
  updateSummary();
};

// Edit expense

/**
 * Edit expense function
 * @param {Event} event - The event that triggers the function
 *
 * This function is responsible for editing an expense.
 * It retrieves the input fields for the expense name and amount.
 * It hides the edit button, shows the save button,
 * and makes the input fields editable.
 */
const editExpense = (event) => {
  // Retrieve the input fields for the expense name and amount
  const expenseItemNameInput =
    event.target.parentElement.previousElementSibling.children[0];
  const expenseItemAmountInput =
    event.target.parentElement.previousElementSibling.children[1];
  // Hide edit button
  event.target.classList.add("hide"); // Add hide class to the edit button

  // Show save button
  event.target.nextElementSibling.classList.remove("hide"); // Remove hide class from the save button

  // Change input to editable
  expenseItemNameInput.disabled = false; // Remove disabled attribute from the expense name input
  expenseItemAmountInput.disabled = false; // Remove disabled attribute from the expense amount input
};

// Save changes

/**
 * Save changes function
 * @param {Event} event - The event that triggers the function
 *
 * This function is responsible for saving changes to an expense.
 * It performs the following actions:
 * 1. Hides the save button
 * 2. Shows the edit button
 * 3. Changes the input fields to not editable
 * 4. Updates the local storage with the new values
 */
const saveChanges = (event) => {
  // Hide the save button
  event.target.classList.add("hide"); // Add hide class to the save button

  // Show the edit button
  event.target.previousElementSibling.classList.remove("hide"); // Remove hide class from the edit button

  const expenseItemNameInput =
    event.target.parentElement.previousElementSibling.children[0];
  const expenseItemAmountInput =
    event.target.parentElement.previousElementSibling.children[1];

  // Update local storage
  const items = getItems(); // Get the items from local storage
  const id = event.target.dataset.id; // Get the id of the expense item

  // Update the items with the new values
  items.map((item) => {
    // Map over the items array
    if (item.id == id) {
      // If the item id matches the expense item id
      item.name = expenseItemNameInput.value; // Update the name with the new value
      item.amount = expenseItemAmountInput.value; // Update the amount with the new value
    }
    return item; // Return the updated item
  });

  setItems(items); // Update local storage with the new items

  expenseItemNameInput.disabled = true; // Disable the expense name input
  expenseItemAmountInput.disabled = true; // Disable the expense amount input

  updateSummary();
};

/**
 * This function is executed when the window loads.
 * It retrieves the items from local storage and appends them to the expenses list.
 * It also sets the budget input to the value from local storage and updates the summary.
 */
window.onload = () => {
  // Get the items from local storage
  const items = getItems();

  // Loop over each item and append a new expense to the expenses list
  items.forEach((item) => {
    // Create a new expense element
    createExpenseCards(item);
  });

  // Check if there is a budget amount in local storage
  const budgetAmount = localStorage.getItem("budget");

  // Set the budget input to the value from local storage
  if (budgetAmount) {
    budgetInput.value = budgetAmount;

    // Update the summary
    updateSummary();
  }
};
