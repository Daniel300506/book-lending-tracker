/* Book Lending Tracker - application library */
(() => {
  "use strict";

  const STORAGE_KEY = "bookLendingTrackerLoans";
  const form = document.getElementById("loan-form");
  const tableBody = document.getElementById("loans-table-body");
  const filter = document.getElementById("status-filter");
  const fields = ["title", "author", "borrower", "dueDate", "genre"];
  const inputs = Object.fromEntries(fields.map((name) => [
    name, form.elements.namedItem(name)
  ]));

  let loans = loadLoans();

  function loadLoans() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("Saved loan data could not be read.", error);
      return [];
    }
  }

  function saveLoans() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
  }

  function getLoanStatus(loan) {
    if (loan.returned) return "returned";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(`${loan.dueDate}T00:00:00`);
    return due < today ? "overdue" : "active";
  }

  function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric", month: "short", year: "numeric"
    }).format(date);
  }

  function showError(name, message) {
    const input = inputs[name];
    document.getElementById(`${name}-error`).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(name) {
    const value = inputs[name].value.trim();
    let message = "";

    if (!value) {
      const labels = {
        title: "Book title", author: "Author", borrower: "Borrower",
        dueDate: "Due date", genre: "Genre"
      };
      message = `${labels[name]} is required.`;
    } else if (name === "dueDate") {
      const chosenDate = new Date(`${value}T00:00:00`);
      if (Number.isNaN(chosenDate.getTime())) {
        message = "Please enter a valid due date.";
      }
    }

    showError(name, message);
    return message === "";
  }

  function validateForm() {
    return fields.map(validateField).every(Boolean);
  }

  function updateSummary() {
    const overdue = loans.filter((loan) => getLoanStatus(loan) === "overdue").length;
    const returned = loans.filter((loan) => loan.returned).length;
    document.getElementById("total-loans").textContent = loans.length;
    document.getElementById("overdue-loans").textContent = overdue;
    document.getElementById("returned-loans").textContent = returned;
  }

  function createCell(content, className) {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.append(content);
    return cell;
  }

  function renderLoans() {
    tableBody.replaceChildren();
    const selectedFilter = filter.value;
    const visibleLoans = loans.filter((loan) =>
      selectedFilter === "all" || getLoanStatus(loan) === selectedFilter
    );

    if (visibleLoans.length === 0) {
      const row = document.createElement("tr");
      row.className = "empty-row";
      const cell = document.createElement("td");
      cell.colSpan = 6;
      const icon = document.createElement("span");
      icon.className = "empty-icon";
      icon.textContent = "📖";
      const heading = document.createElement("strong");
      heading.textContent = selectedFilter === "all" ? "No books added yet" : "No matching books";
      const message = document.createElement("span");
      message.textContent = selectedFilter === "all"
        ? "Your book loans will appear here."
        : "Try selecting a different filter.";
      cell.append(icon, heading, message);
      row.append(cell);
      tableBody.append(row);
    } else {
      visibleLoans.forEach((loan) => {
        const row = document.createElement("tr");
        const bookCell = document.createElement("td");
        const title = document.createElement("span");
        title.className = "book-name";
        title.textContent = loan.title;
        const author = document.createElement("span");
        author.className = "book-author";
        author.textContent = `by ${loan.author}`;
        bookCell.append(title, author);
        row.append(bookCell);
        row.append(createCell(loan.borrower));
        row.append(createCell(formatDate(loan.dueDate)));
        row.append(createCell(loan.genre));

        const status = getLoanStatus(loan);
        const statusBadge = document.createElement("span");
        statusBadge.className = `status status-${status}`;
        statusBadge.textContent = status === "active" ? "On loan" :
          status === "overdue" ? "Overdue" : "Returned";
        row.append(createCell(statusBadge));

        const actionCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "action-group";
        if (!loan.returned) {
          const returnButton = document.createElement("button");
          returnButton.type = "button";
          returnButton.className = "action-button";
          returnButton.textContent = "Return";
          returnButton.setAttribute("aria-label", `Mark ${loan.title} as returned`);
          returnButton.addEventListener("click", () => markReturned(loan.id));
          actions.append(returnButton);
        }
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "action-button delete";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${loan.title}`);
        deleteButton.addEventListener("click", () => deleteLoan(loan.id));
        actions.append(deleteButton);
        actionCell.append(actions);
        row.append(actionCell);
        tableBody.append(row);
      });
    }
    updateSummary();
  }

  function markReturned(id) {
    const loan = loans.find((item) => item.id === id);
    if (!loan) return;
    loan.returned = true;
    saveLoans();
    renderLoans();
  }

  function deleteLoan(id) {
    loans = loans.filter((item) => item.id !== id);
    saveLoans();
    renderLoans();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const newLoan = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: inputs.title.value.trim(),
      author: inputs.author.value.trim(),
      borrower: inputs.borrower.value.trim(),
      dueDate: inputs.dueDate.value,
      genre: inputs.genre.value,
      returned: false
    };

    loans.unshift(newLoan);
    saveLoans();
    form.reset();
    fields.forEach((name) => showError(name, ""));
    renderLoans();
  });

  fields.forEach((name) => {
    inputs[name].addEventListener("input", () => {
      if (inputs[name].getAttribute("aria-invalid") === "true") validateField(name);
    });
    inputs[name].addEventListener("change", () => {
      if (inputs[name].getAttribute("aria-invalid") === "true") validateField(name);
    });
  });

  filter.addEventListener("change", renderLoans);
  renderLoans();
})();
