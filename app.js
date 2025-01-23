// Google Sheet Configuration
const SHEET_ID = "1vBNliHYqx7GzHyJfPbDjqrFjVIgl0sESmEkZMQORDxQ"; // Your Google Sheet ID
const API_KEY = "AIzaSyDzb9-RmVAWLYx9WEolocZcNm0ORvxSSl0"; // Your Google API Key
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

// Function to Fetch Donor Data Based on Blood Group
async function fetchDonors(bloodGroup) {
  const range = "Form responses 1"; // The name of the sheet/tab containing donor data
  const url = `${BASE_URL}/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values && data.values.length > 1) {
      const headers = data.values[0];
      const rows = data.values.slice(1);

      // Filter data based on blood group
      const filteredDonors = rows.filter(row => row[3] === bloodGroup); // Assuming column 4 is blood group
      displayDonors(filteredDonors, headers);
    } else {
      displayError("No data found or invalid sheet format.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    displayError("Failed to fetch data. Please check your API Key and Sheet ID.");
  }
}

// Function to Display Donor Data
function displayDonors(donors, headers) {
  const resultSection = document.getElementById("result");
  resultSection.innerHTML = "";

  if (donors.length === 0) {
    resultSection.innerHTML = "<p>No donors found for the given blood group.</p>";
    return;
  }

  // Create a table for the results
  const table = document.createElement("table");
  table.classList.add("donor-table");

  // Create table header
  const headerRow = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Add donor rows to the table
  donors.forEach(donor => {
    const row = document.createElement("tr");
    donor.forEach(data => {
      const cell = document.createElement("td");
      cell.textContent = data;
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  resultSection.appendChild(table);
}

// Function to Display an Error Message
function displayError(message) {
  const resultSection = document.getElementById("result");
  resultSection.innerHTML = `<p class="error">${message}</p>`;
}

// Add Event Listener to the Search Button
document.getElementById("search-btn").addEventListener("click", () => {
  const bloodGroupInput = document.getElementById("blood-group").value.trim();
  if (bloodGroupInput) {
    fetchDonors(bloodGroupInput);
  } else {
    displayError("Please enter a blood group.");
  }
});
