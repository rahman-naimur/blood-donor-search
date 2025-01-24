const { google } = require('googleapis');
const sheets = google.sheets('v4');

const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/your-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function accessSpreadsheet() {
  const client = await auth.getClient();
  const sheetsApi = google.sheets({ version: 'v4', auth: client });

  const response = await sheetsApi.spreadsheets.values.get({
    spreadsheetId: 'your-spreadsheet-id',
    range: 'Sheet1!A1:D10',
  });

  console.log(response.data.values);
}

accessSpreadsheet();
