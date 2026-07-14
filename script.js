const form = document.querySelector("#attendance-form");
const nameInput = document.querySelector("#player-name");
const message = document.querySelector("#form-message");

const lists = {
  coming: document.querySelector("#coming-list"),
  maybe: document.querySelector("#maybe-list"),
  "not-coming": document.querySelector("#not-coming-list")
};

const totals = {
  coming: document.querySelector("#coming-total"),
  maybe: document.querySelector("#maybe-total"),
  "not-coming": document.querySelector("#not-coming-total")
};

const confirmedCount = document.querySelector("#confirmed-count");

function loadResponses() {
  const saved = localStorage.getItem("h030ps-attendance");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Could not load saved attendance:", error);
    return [];
  }
}

function saveResponses(responses) {
  localStorage.setItem(
    "h030ps-attendance",
    JSON.stringify(responses)
  );
}

function renderSavedResponses() {
  const responses = loadResponses();

  responses.forEach((response) => {
    addPlayerToList(response.name, response.status);
  });

  updateTotals();
}

function addPlayerToList(name, status) {
  const list = lists[status];

  if (!list) {
    return;
  }

  const item = document.createElement("li");
  item.textContent = name;
  list.appendChild(item);
}

function updateTotals() {
  Object.keys(lists).forEach((status) => {
    totals[status].textContent = lists[status].children.length;
  });

  confirmedCount.textContent = lists.coming.children.length;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const selectedStatus = new FormData(form).get("status");

  if (!name || !selectedStatus) {
    message.textContent = "Please enter your name and select a response.";
    return;
  }

  const responses = loadResponses();

  const existingResponseIndex = responses.findIndex(
    (response) =>
      response.name.toLowerCase() === name.toLowerCase()
  );

  if (existingResponseIndex !== -1) {
    message.textContent =
      "This name already has a saved response in this browser.";
    return;
  }

  const response = {
    name,
    status: selectedStatus
  };

  responses.push(response);
  saveResponses(responses);
  addPlayerToList(name, selectedStatus);
  updateTotals();

  form.reset();
  message.textContent = `Thanks, ${name}. Your response was saved on this device.`;
});

document.querySelector("#current-year").textContent =
  new Date().getFullYear();

renderSavedResponses();
