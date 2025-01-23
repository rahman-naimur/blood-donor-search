// Replace with your Google Sheets ID
const SHEET_ID = "your-google-sheet-id";
const API_KEY = "your-google-api-key";

// Function to fetch donor data
async function fetchDonors() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Form responses 1?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values; // Returns all rows
}

// Function to search donors
async function searchDonors() {
    const bloodGroup = document.getElementById("bloodGroupInput").value.trim();
    if (!bloodGroup) {
        alert("Please enter a blood group.");
        return;
    }

    const donors = await fetchDonors();
    const tableBody = document.getElementById("donorTableBody");
    tableBody.innerHTML = ""; // Clear previous results

    // Filter and prioritize donors
    const filteredDonors = donors.slice(1).filter(row => row[3] === bloodGroup);
    filteredDonors.sort((a, b) => {
        if (a[8] === "Eligible for Donate" && b[8] !== "Eligible for Donate") return -1;
        if (b[8] === "Eligible for Donate" && a[8] !== "Eligible for Donate") return 1;
        return 0;
    });

    // Show donors in the table
    if (filteredDonors.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7'>No donors found.</td></tr>";
    } else {
        filteredDonors.forEach(donor => {
            const row = document.createElement("tr");
            donor.forEach(data => {
                const cell = document.createElement("td");
                cell.textContent = data;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }
}
