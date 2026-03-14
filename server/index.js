import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataFilePath = path.join(__dirname, '..', 'settings.json');

// Initialize settings file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  const defaultSettings = {
    id: 1,
    companyName: 'Acme Corp',
    industry: 'Technology',
    email: 'admin@acmecorp.com',
    notifications: {
      emailReports: true,
      emissionAlerts: true,
      vendorUpdates: true
    }
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(defaultSettings, null, 2));
}

// Helper function to read settings
const readSettings = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings:', error);
    return null;
  }
};

// Helper function to write settings
const writeSettings = (settings) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing settings:', error);
    return false;
  }
};

// API Routes
app.get('/api/settings', (req, res) => {
  const settings = readSettings();
  if (settings) {
    res.json(settings);
  } else {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    const newSettings = req.body;
    newSettings.id = 1; // Keep the same ID

    if (writeSettings(newSettings)) {
      res.json({ message: 'Settings updated successfully' });
    } else {
      res.status(500).json({ error: 'Failed to save settings' });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});