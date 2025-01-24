// Google Sheet Configuration
const SHEET_ID = "1vBNliHYqx7GzHyJfPbDjqrFjVIgl0sESmEkZMQORDxQ";
const API_KEY = "e42b970a683d2d707958ef06cbd6a55522cc6807";
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

// Fetch Data from Google Sheet
async function fetchDonors() {
  const bloodGroup = document.getElementById("blood-group").value.trim();
  if (!bloodGroup) {
    displayError("Please enter a blood group.");
    return;
  }

  const range = "Form responses 1"; // The name of your Google Sheet tab
  const url = `${BASE_URL}/${range}?key=${API_KEY}`;
  console.log("Fetching from URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.values && data.values.length > 1) {
      const headers = data.values[0];
      const rows = data.values.slice(1);

      const filteredDonors = rows.filter(row => row[3] === bloodGroup); // Filter donors by blood group
      displayDonors(filteredDonors, headers);
    } else {
      displayError("No data found in the sheet or invalid sheet format.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    displayError("Failed to fetch data. Check your API key and sheet settings.");
  }
}

// Display Donors in the HTML Table
function displayDonors(donors, headers) {
  const resultSection = document.getElementById("result");
  resultSection.innerHTML = "";

  if (donors.length === 0) {
    resultSection.innerHTML = "<p>No donors found for the given blood group.</p>";
    return;
  }

  const table = document.createElement("table");
  table.classList.add("donor-table");

  const headerRow = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  donors.forEach(donor => {
    const row = document.createElement("tr");
    donor.forEach(data => {
      const td = document.createElement("td");
      td.textContent = data;
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  resultSection.appendChild(table);
}

// Display Error Messages
function displayError(message) {
  const resultSection = document.getElementById("result");
  resultSection.innerHTML = `<p class="error">${message}</p>`;
}

// Event Listener for Search Button
document.getElementById("search-btn").addEventListener("click", fetchDonors);
