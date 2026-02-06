const { google } = require('googleapis');

function createSheetsAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const projectId = process.env.GOOGLE_PROJECT_ID; // optional but nice

  if (!clientEmail || !privateKey) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY env vars');
  }

  // Build credentials object as if it came from the JSON file
  const credentials = {
    type: 'service_account',
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'), // handle \n in env
    project_id: projectId,
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

module.exports = { createSheetsAuth };