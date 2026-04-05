import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

// ─── Code strings ────────────────────────────────────────────────────────────

const enableApisCmd = `# Open the Cloud Console API Library for your project
# Replace PROJECT_ID with your actual project ID
open "https://console.cloud.google.com/apis/library?project=PROJECT_ID"

# APIs to enable (click "Enable" on each):
#   Gmail API         → https://console.cloud.google.com/apis/library/gmail.googleapis.com
#   Google Calendar   → https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
#   Google Drive      → https://console.cloud.google.com/apis/library/drive.googleapis.com
#   Google Sheets     → https://console.cloud.google.com/apis/library/sheets.googleapis.com
#   Google Docs       → https://console.cloud.google.com/apis/library/docs.googleapis.com
#   Cloud Resource    → https://console.cloud.google.com/apis/library/cloudresourcemanager.googleapis.com

# Or use the gcloud CLI to enable them all at once:
gcloud config set project PROJECT_ID
gcloud services enable gmail.googleapis.com
gcloud services enable calendar-json.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable docs.googleapis.com`;

const oauthConsentSetup = `# OAuth consent screen checklist
#
# 1. Go to: APIs & Services → OAuth consent screen
# 2. Choose user type:
#    - Internal  → only accounts in your Google Workspace org can use it
#                  (no verification required, no 100-user test cap)
#    - External  → any Google account can use it
#                  (requires verification if published; limit 100 test users while in testing)
#
# 3. Fill in required fields:
#    - App name:         "Conductor MCP"        (shown on consent screen)
#    - User support email:  your email
#    - Developer contact:   your email
#
# 4. Add scopes (click "Add or Remove Scopes"):
#    Paste each scope URI and click "Update":
#
#    https://www.googleapis.com/auth/gmail.send
#    https://www.googleapis.com/auth/gmail.readonly
#    https://www.googleapis.com/auth/gmail.modify
#    https://www.googleapis.com/auth/gmail.labels
#    https://www.googleapis.com/auth/calendar
#    https://www.googleapis.com/auth/calendar.events
#    https://www.googleapis.com/auth/drive
#    https://www.googleapis.com/auth/drive.file
#    https://www.googleapis.com/auth/drive.readonly
#    https://www.googleapis.com/auth/spreadsheets
#    https://www.googleapis.com/auth/spreadsheets.readonly
#
# 5. Test users (External only):
#    Add every Google account that will use Conductor here.
#    Users NOT on this list will see "Access blocked" until the app is published.
#
# 6. Save and continue.`;

const createOAuthCredentials = `# Creating OAuth 2.0 credentials
#
# 1. Go to: APIs & Services → Credentials
# 2. Click "+ Create Credentials" → "OAuth client ID"
# 3. Application type: Desktop app
#    ↑ IMPORTANT: Must be "Desktop app", not "Web application"
#      Web application requires a redirect URI server; Desktop app uses
#      the loopback address (127.0.0.1) which Conductor handles automatically.
# 4. Name: "Conductor MCP Desktop"
# 5. Click Create
# 6. Click "Download JSON" on the resulting dialog
#    (or download it later from the Credentials list → pencil icon → Download JSON)
#
# The downloaded file looks like this:
# {
#   "installed": {
#     "client_id": "123456789-abc.apps.googleusercontent.com",
#     "project_id": "my-project",
#     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#     "token_uri": "https://oauth2.googleapis.com/token",
#     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
#     "client_secret": "GOCSPX-...",
#     "redirect_uris": ["http://localhost"]
#   }
# }
#
# Save it at: ~/.conductor/google-credentials.json
# (Or any path — you'll reference it in your config)
mkdir -p ~/.conductor
mv ~/Downloads/client_secret_*.json ~/.conductor/google-credentials.json
chmod 600 ~/.conductor/google-credentials.json`;

const serviceAccountCreate = `# Creating a service account
#
# 1. Go to: IAM & Admin → Service Accounts
# 2. Click "+ Create Service Account"
# 3. Name: "conductor-mcp"
# 4. Description: "Conductor MCP server service account"
# 5. Click "Create and Continue"
# 6. Grant roles (optional at creation, add later if needed):
#    - For Drive:   "Storage Object Viewer" or custom role
#    - For Sheets:  "Viewer" or "Editor"
#    - For GCP APIs: appropriate roles per service
# 7. Click "Done"
#
# Download the key:
# 1. Click on the service account you just created
# 2. Go to "Keys" tab
# 3. Click "Add Key" → "Create new key"
# 4. Key type: JSON → Create
# 5. The JSON key file downloads automatically
#
# Save it securely:
mkdir -p ~/.conductor
mv ~/Downloads/my-project-*.json ~/.conductor/google-service-account.json
chmod 600 ~/.conductor/google-service-account.json
#
# The key file looks like:
# {
#   "type": "service_account",
#   "project_id": "my-project",
#   "private_key_id": "abc123",
#   "private_key": "-----BEGIN RSA PRIVATE KEY-----\\n...",
#   "client_email": "conductor-mcp@my-project.iam.gserviceaccount.com",
#   "client_id": "...",
#   "token_uri": "https://oauth2.googleapis.com/token"
# }`;

const domainWideDelegation = `# Granting domain-wide delegation (Google Workspace only)
#
# This lets the service account impersonate any user in your org.
# Required for: reading/sending email AS a user, accessing their calendar, etc.
#
# Step 1 — Enable delegation on the service account:
# IAM & Admin → Service Accounts → your account → "Edit" (pencil) →
# "Show advanced settings" → tick "Enable G Suite Domain-wide Delegation" → Save
#
# Step 2 — Note the OAuth2 client ID shown under "Domain-wide delegation"
# It looks like: 123456789012345678901
#
# Step 3 — Authorize in Google Workspace Admin Console:
# admin.google.com → Security → Access and data control →
# API controls → Manage Domain Wide Delegation → Add new
#
# Client ID: <the numeric ID from step 2>
# OAuth Scopes (comma-separated):
https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/gmail.modify,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets
#
# Step 4 — In your Conductor config, set the subject (user to impersonate):
# "google": {
#   "serviceAccountFile": "~/.conductor/google-service-account.json",
#   "subject": "user@yourdomain.com"
# }`;

const firstTimeAuth = `# Running the first-time OAuth flow
#
# After configuring credentials in ~/.conductor/config.json, run:
conductor auth google

# Conductor will:
# 1. Open your browser to Google's OAuth consent screen
# 2. You log in and grant the requested scopes
# 3. Google redirects to http://127.0.0.1:<random-port>/?code=...
# 4. Conductor captures the code and exchanges it for access + refresh tokens
# 5. Tokens are saved to ~/.conductor/tokens/google.json
#
# You should see:
# ✓ Google authorization complete
# ✓ Token saved to ~/.conductor/tokens/google.json
# ✓ Refresh token stored — you won't need to re-authorize
#
# If a browser doesn't open, Conductor prints the URL:
# Open this URL in your browser:
# https://accounts.google.com/o/oauth2/auth?client_id=...&scope=...
#
# After authorizing, paste the resulting code:
# conductor auth google --code 4/0AX...`;

const tokenStorage = `# Token file location
cat ~/.conductor/tokens/google.json

# Structure:
# {
#   "access_token": "ya29.a0A...",      ← short-lived (1 hour)
#   "refresh_token": "1//0g...",        ← long-lived, used to get new access tokens
#   "scope": "https://www.googleapis.com/auth/gmail.send ...",
#   "token_type": "Bearer",
#   "expiry_date": 1712345678901        ← milliseconds epoch
# }
#
# Conductor checks expiry_date before every API call.
# If within 5 minutes of expiry (or already expired), it automatically
# calls the token endpoint with the refresh_token to get a new access_token.
# The refresh_token itself does not expire unless:
#   - The user revokes access
#   - The OAuth app is in "Testing" mode and the refresh token is >7 days old
#   - The user changes their Google account password (in some configurations)
#   - The app exceeds 50 refresh tokens per user (oldest are invalidated)

# Revoke access (from Google's side):
open "https://myaccount.google.com/permissions"
# Find "Conductor MCP" and click "Remove Access"

# Re-authorize after revocation:
rm ~/.conductor/tokens/google.json
conductor auth google`;

const gmailConfig = `# ~/.conductor/config.json — Gmail plugin
{
  "plugins": {
    "gmail": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.labels"
      ],
      "defaultFrom": "me",
      "maxResults": 50,
      "historyDays": 30
    }
  }
}`;

const gmailTools = `# Available Gmail tools and example usage

# gmail.read — fetch a specific message by ID
# Returns: subject, from, to, date, body (plain text + HTML), headers, attachments list
# Example prompt: "Read email with ID 18c3f..."

# gmail.search — search messages with Gmail query syntax
# Supports full Gmail search operators: from:, to:, subject:, has:attachment,
#   is:unread, is:starred, after:2024/01/01, before:2024/12/31, label:inbox, etc.
# Example prompts:
#   "Find all emails from boss@company.com this week"
#   "Search for unread emails with attachments in my inbox"
#   "Find emails with subject containing 'invoice' from the last 30 days"

# gmail.send — compose and send an email
# Supports: to, cc, bcc, subject, body (plain or HTML), replyTo, attachments
# Example prompts:
#   "Send an email to alice@example.com about the project update"
#   "Reply to the latest email from Bob"
#   "Send a meeting invite email to the team"

# gmail.label — add/remove labels on messages or threads
# Supports: addLabelIds, removeLabelIds, using label names or IDs
# Example prompts:
#   "Label this email as 'important'"
#   "Remove the 'todo' label from this thread"
#   "Mark message 18c3f as read"

# gmail.archive — move messages out of inbox (add ARCHIVED, remove INBOX)
# Example prompts:
#   "Archive all read emails older than 7 days"
#   "Archive this thread"

# gmail.delete — permanently delete messages (move to Trash or delete from Trash)
# Example prompts:
#   "Delete the email with ID 18c3f"
#   "Empty trash"

# gmail.threads — list, read, or modify entire threads
# Returns all messages in a thread with full metadata
# Example prompts:
#   "Show me the full thread for this conversation"
#   "How many emails are in this thread?"`;

const calendarConfig = `# ~/.conductor/config.json — Google Calendar plugin
{
  "plugins": {
    "gcal": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ],
      "defaultCalendarId": "primary",
      "timezone": "America/New_York",
      "maxResults": 100,
      "lookAheadDays": 30
    }
  }
}`;

const calendarIdHowTo = `# Finding your Calendar ID
#
# Primary calendar: use the string "primary" — it always resolves to
#   the authenticated user's main calendar.
#
# Other calendars (shared, project, team):
# 1. Open Google Calendar at calendar.google.com
# 2. In the left sidebar, hover over the calendar name
# 3. Click the three-dot menu → "Settings and sharing"
# 4. Scroll down to "Integrate calendar"
# 5. Copy the "Calendar ID" — looks like one of:
#      primary calendar: you@gmail.com
#      other calendar:   abc123xyz@group.calendar.google.com
#      Google-managed:   en.usa#holiday@group.v.calendar.google.com
#
# For service accounts: the calendar must be shared with the service
# account email (e.g. conductor-mcp@project.iam.gserviceaccount.com)
# with at least "Make changes to events" permission.

# Multiple calendar config example:
{
  "plugins": {
    "gcal": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "calendars": [
        { "id": "primary", "name": "Personal" },
        { "id": "team@group.calendar.google.com", "name": "Team" },
        { "id": "en.usa#holiday@group.v.calendar.google.com", "name": "US Holidays" }
      ]
    }
  }
}`;

const calendarTools = `# Available Google Calendar tools

# gcal.list — list events in a date range
# Parameters: calendarId, timeMin, timeMax, maxResults, singleEvents, orderBy
# Example prompts:
#   "What's on my calendar this week?"
#   "List all events in the Team calendar for next month"
#   "Show me my schedule for tomorrow"

# gcal.create — create a new event
# Parameters: calendarId, summary, description, start, end, attendees,
#             location, recurrence, reminders, conferenceData (Meet link)
# Example prompts:
#   "Create a meeting called 'Sprint Review' on Friday at 2pm for 1 hour"
#   "Add a recurring standup every weekday at 9am"
#   "Schedule a call with alice@example.com for next Tuesday at 3pm, add a Meet link"

# gcal.update — update an existing event
# Parameters: calendarId, eventId, and any fields to change
# Example prompts:
#   "Move tomorrow's standup to 10am"
#   "Add bob@example.com to the Sprint Review meeting"
#   "Change the Sprint Review location to 'Conference Room B'"

# gcal.delete — delete an event
# Parameters: calendarId, eventId
# Example prompts:
#   "Cancel the 3pm meeting on Friday"
#   "Delete all events with 'draft' in the title"

# gcal.freebusy — query free/busy times for calendars or users
# Returns busy blocks; useful for finding meeting slots
# Example prompts:
#   "When is alice@example.com free tomorrow between 9am and 5pm?"
#   "Find a 1-hour slot for 3 people next week"
#   "Am I free on Thursday afternoon?"`;

const driveConfig = `# ~/.conductor/config.json — Google Drive plugin
{
  "plugins": {
    "drive": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/drive"
      ],
      "pageSize": 100,
      "includeItemsFromAllDrives": true,
      "supportsAllDrives": true,
      "corpora": "allDrives"
    }
  }
}

# For read-only access (safer for CI or restricted use):
{
  "plugins": {
    "drive": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "scopes": [
        "https://www.googleapis.com/auth/drive.readonly"
      ]
    }
  }
}

# For creating/modifying only files that Conductor created (narrowest scope):
{
  "plugins": {
    "drive": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "scopes": [
        "https://www.googleapis.com/auth/drive.file"
      ]
    }
  }
}`;

const driveFileId = `# Finding a file's ID in Google Drive
#
# Method 1 — From the URL:
# When you open a file in Google Drive, the URL looks like:
#   https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/view
#                                   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
#   File ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
#
# For Sheets/Docs/Slides the URL pattern is:
#   https://docs.google.com/spreadsheets/d/FILE_ID/edit
#   https://docs.google.com/document/d/FILE_ID/edit
#   https://docs.google.com/presentation/d/FILE_ID/edit
#
# Method 2 — Right-click → "Get link" → extract from the copied URL
#
# Method 3 — Use drive.list and search by name:
# "Find the file ID for the document named 'Q4 Report'"
#
# Shared Drives (Team Drives):
# The Drive ID is in the URL when you're inside a Shared Drive:
#   https://drive.google.com/drive/folders/DRIVE_ID
# Use this as the driveId parameter for Shared Drive operations.`;

const driveSharedDrives = `# Working with Shared Drives (formerly Team Drives)
#
# Shared Drives have different permission semantics than My Drive:
#   - Files belong to the drive, not a user
#   - Membership levels: Viewer, Commenter, Contributor, Content Manager, Manager
#   - Service accounts must be added as a member of the Shared Drive
#
# Granting service account access to a Shared Drive:
# 1. Open the Shared Drive in drive.google.com
# 2. Click the down-arrow next to the drive name → "Manage members"
# 3. Add your service account email: conductor-mcp@project.iam.gserviceaccount.com
# 4. Set appropriate role (Contributor for read+write, Content Manager for full access)
#
# Config for Shared Drive operations:
{
  "plugins": {
    "drive": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "supportsAllDrives": true,
      "includeItemsFromAllDrives": true,
      "driveId": "0APN1..."
    }
  }
}`;

const driveTools = `# Available Google Drive tools

# drive.list — list files and folders
# Supports: query (Drive query syntax), pageSize, driveId, corpora, orderBy
# Drive query examples:
#   name contains 'report'
#   mimeType = 'application/vnd.google-apps.spreadsheet'
#   modifiedTime > '2024-01-01T00:00:00'
#   'FOLDER_ID' in parents
#   trashed = false
# Example prompts:
#   "List all spreadsheets in my Drive"
#   "Show files in the 'Projects' folder"
#   "Find files modified in the last week"

# drive.read — read the content of a file
# Returns file content; auto-exports Google Docs/Sheets/Slides to text/csv/pdf
# Example prompts:
#   "Read the contents of the Q4 Report doc"
#   "Show me what's in file 1BxiMVs0..."
#   "Export the presentation as PDF"

# drive.upload — upload a new file or create a Google Doc/Sheet
# Supports: name, content, mimeType, parents (folder IDs), convert to Google format
# Example prompts:
#   "Upload this CSV as a new Google Sheet"
#   "Create a new Google Doc called 'Meeting Notes' in the Projects folder"
#   "Upload report.pdf to the Shared Drive"

# drive.share — share a file with users or make it public
# Supports: role (reader/writer/commenter/owner), type (user/group/domain/anyone)
# Example prompts:
#   "Share the Q4 Report with bob@example.com as editor"
#   "Make this file viewable by anyone with the link"
#   "Give the entire company domain read access to this folder"

# drive.delete — move to trash or permanently delete
# Example prompts:
#   "Delete the file named 'old-draft.docx'"
#   "Permanently delete everything in the trash"`;

const sheetsConfig = `# ~/.conductor/config.json — Google Sheets plugin
{
  "plugins": {
    "sheets": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/spreadsheets"
      ],
      "valueInputOption": "USER_ENTERED",
      "valueRenderOption": "FORMATTED_VALUE",
      "dateTimeRenderOption": "FORMATTED_STRING"
    }
  }
}`;

const sheetsSpreadsheetId = `# Finding the Spreadsheet ID
#
# Open the Google Sheet — the URL looks like:
#   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit#gid=0
#                                          ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
# Spreadsheet ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
# Sheet (tab) name: visible in the tab bar at the bottom (default: "Sheet1")
#
# A1 notation reference:
#   A1             → single cell, column A row 1
#   A1:D10         → range from A1 to D10
#   Sheet1!A1:D10  → range on a specific sheet tab
#   A:A            → entire column A
#   1:1            → entire row 1
#   Sheet2!B2:B    → column B from row 2 onwards on Sheet2
#
# Named ranges:
#   If you've defined named ranges in the sheet (Data → Named ranges),
#   you can use the name directly: "SalesData", "Q4Totals", etc.
#
# valueInputOption:
#   USER_ENTERED → Google parses the value as if typed by a user
#                  "=SUM(A1:A10)" becomes a formula; "Jan 1" becomes a date
#   RAW          → stored exactly as provided, no interpretation
#                  "=SUM(A1:A10)" is stored as the literal string`;

const sheetsTools = `# Available Google Sheets tools

# sheets.read — read values from a range
# Parameters: spreadsheetId, range (A1 notation or named range),
#             valueRenderOption, dateTimeRenderOption
# Example prompts:
#   "Read the data in Sheet1!A1:F100"
#   "Get all values in the 'SalesData' named range"
#   "Show me the headers in row 1"
#   "Read the entire first sheet"

# sheets.write — write values to a range (overwrites existing)
# Parameters: spreadsheetId, range, values (2D array), valueInputOption
# Example prompts:
#   "Write these numbers to cells B2:B10"
#   "Update cell C5 to 'Complete'"
#   "Write a formula =SUM(B2:B10) to cell B11"

# sheets.append — append rows after the last row with data
# Does not overwrite existing data; finds the first empty row at end of table
# Parameters: spreadsheetId, range (defines the table), values, valueInputOption
# Example prompts:
#   "Append a new row with today's date and the sales total"
#   "Add these 5 records to the end of the table"

# sheets.clear — clear values in a range (keeps formatting)
# Parameters: spreadsheetId, range
# Example prompts:
#   "Clear the data in B2:F50 but keep the headers"
#   "Wipe the entire Sheet2"`;

const serviceAccountConfig = `# ~/.conductor/config.json — using service account instead of OAuth
{
  "plugins": {
    "gmail": {
      "serviceAccountFile": "~/.conductor/google-service-account.json",
      "subject": "user@yourdomain.com",
      "scopes": [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly"
      ]
    },
    "gcal": {
      "serviceAccountFile": "~/.conductor/google-service-account.json",
      "subject": "user@yourdomain.com",
      "defaultCalendarId": "user@yourdomain.com",
      "scopes": [
        "https://www.googleapis.com/auth/calendar"
      ]
    },
    "drive": {
      "serviceAccountFile": "~/.conductor/google-service-account.json",
      "scopes": [
        "https://www.googleapis.com/auth/drive"
      ],
      "supportsAllDrives": true
    },
    "sheets": {
      "serviceAccountFile": "~/.conductor/google-service-account.json",
      "scopes": [
        "https://www.googleapis.com/auth/spreadsheets"
      ]
    }
  }
}`;

const fullConfig = `# ~/.conductor/config.json — all Google plugins (OAuth)
{
  "plugins": {
    "gmail": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.labels"
      ],
      "defaultFrom": "me",
      "maxResults": 50
    },
    "gcal": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ],
      "defaultCalendarId": "primary",
      "timezone": "America/New_York",
      "maxResults": 100
    },
    "drive": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/drive"
      ],
      "pageSize": 100,
      "supportsAllDrives": true,
      "includeItemsFromAllDrives": true
    },
    "sheets": {
      "credentialsFile": "~/.conductor/google-credentials.json",
      "tokenFile": "~/.conductor/tokens/google.json",
      "scopes": [
        "https://www.googleapis.com/auth/spreadsheets"
      ],
      "valueInputOption": "USER_ENTERED",
      "valueRenderOption": "FORMATTED_VALUE"
    }
  }
}`;

const shareServiceAccountDrive = `# Sharing Drive files/folders with a service account
#
# Service accounts are like their own Google users — they have an email:
#   conductor-mcp@my-project.iam.gserviceaccount.com
#
# They do NOT have their own "My Drive". You must explicitly share files
# or folders with the service account email, just like sharing with a person.
#
# To share a specific file:
# 1. Right-click the file in Google Drive
# 2. "Share" → enter the service account email
# 3. Set role: Viewer (read-only) or Editor (read + write)
# 4. Uncheck "Notify people" (the email bounces — no inbox)
# 5. Click "Share"
#
# To share an entire folder (all files inside inherit access):
# Same as above but done on the folder.
#
# For Shared Drives: add service account as member (Manager, Content Manager, or Contributor)
# For Sheets: share the specific spreadsheet with the service account email
# For Calendar: share the calendar with the service account email via calendar settings

# Verify access with gcloud:
gcloud auth activate-service-account --key-file=~/.conductor/google-service-account.json
gcloud auth list`;

// ─── Error reference data ────────────────────────────────────────────────────

const errors = [
  {
    code: "invalid_client",
    title: "invalid_client",
    causes: [
      "Wrong credentials file (web app JSON used instead of Desktop app)",
      "Credentials file is malformed or truncated",
      "client_id doesn't match the project",
    ],
    fix: `# This almost always means the credentials JSON file is wrong type.
# Verify the file contains "installed" key (not "web"):
cat ~/.conductor/google-credentials.json | python3 -m json.tool | grep -A2 '"installed"'

# If it shows "web" instead of "installed", you created a Web Application
# credential type. You need to create a new OAuth 2.0 Client ID with
# Application type: "Desktop app".
#
# Delete the existing credential in Cloud Console and recreate.
# Download the new JSON and replace ~/.conductor/google-credentials.json`,
  },
  {
    code: "redirect_uri_mismatch",
    title: "redirect_uri_mismatch",
    causes: [
      "OAuth credential type is 'Web application' instead of 'Desktop app'",
      "The redirect URI in the code doesn't match any registered URI",
    ],
    fix: `# Cause: you created a "Web application" OAuth credential.
# Web applications require an explicit redirect URI. Desktop apps use
# loopback (127.0.0.1) which doesn't need pre-registration.
#
# Fix: delete the web credential and create a new "Desktop app" credential.
# In Cloud Console: APIs & Services → Credentials → + Create Credentials
# → OAuth client ID → Application type: Desktop app`,
  },
  {
    code: "token_expired",
    title: "Token has been expired or revoked",
    causes: [
      "User manually revoked access at myaccount.google.com/permissions",
      "OAuth app is in Testing mode and the token is older than 7 days",
      "User changed their Google password",
      "50+ refresh tokens existed — oldest was auto-revoked",
    ],
    fix: `# Delete the token file and re-authorize:
rm ~/.conductor/tokens/google.json
conductor auth google

# If app is in Testing mode and tokens expire in 7 days:
# Publish the app (OAuth consent screen → "Publish App") or
# add the user as a test user in the consent screen config.
# Note: Publishing to External still requires verification for sensitive scopes.`,
  },
  {
    code: "insufficient_scope",
    title: "Request had insufficient authentication scopes",
    causes: [
      "A required scope wasn't included when the user authorized",
      "Scope added to config after initial authorization — token has old scope set",
    ],
    fix: `# The token was issued with a limited set of scopes.
# Adding scopes to config does NOT automatically re-request them.
# You must delete the token and re-authorize with the full scope set.

rm ~/.conductor/tokens/google.json
conductor auth google

# Verify the scopes in your config include all needed scopes, then re-auth.
# Check which scopes the current token was issued with:
cat ~/.conductor/tokens/google.json | python3 -m json.tool | grep scope`,
  },
  {
    code: "caller_no_permission",
    title: "The caller does not have permission",
    causes: [
      "Service account file not shared with the specific file/folder",
      "Service account lacks the correct IAM role for a GCP API",
      "Calendar not shared with the service account",
      "Trying to access a Shared Drive without being a member",
    ],
    fix: `# For Drive/Sheets: share the specific file or folder with the service account email.
# The email looks like: conductor-mcp@project-id.iam.gserviceaccount.com
# See the "Share files with service account" section above for step-by-step.

# For Calendar: share the calendar with the service account:
# Google Calendar → Settings → Settings for my calendars → Share with specific people
# Add: conductor-mcp@project-id.iam.gserviceaccount.com → Make changes to events

# For GCP APIs: add an IAM binding:
gcloud projects add-iam-policy-binding PROJECT_ID \\
  --member="serviceAccount:conductor-mcp@PROJECT_ID.iam.gserviceaccount.com" \\
  --role="roles/APPROPRIATE_ROLE"`,
  },
  {
    code: "daily_limit_unauthenticated",
    title: "Daily Limit for Unauthenticated Use Exceeded",
    causes: [
      "API call is being made without credentials (no auth header)",
      "Token is not being passed to the request",
      "Wrong API endpoint — hitting a different service",
    ],
    fix: `# This error means requests are going out unauthenticated.
# Usually caused by auth configuration not being loaded correctly.

# Verify token file exists and is readable:
ls -la ~/.conductor/tokens/google.json
cat ~/.conductor/tokens/google.json | python3 -m json.tool

# Verify credentials file:
ls -la ~/.conductor/google-credentials.json

# Re-run auth:
conductor auth google --verbose`,
  },
  {
    code: "api_not_enabled",
    title: "API has not been used in project / is not enabled",
    causes: [
      "The specific API (Gmail, Calendar, Drive, Sheets) not enabled in Cloud Console",
      "Wrong project selected — API enabled in a different project",
      "Newly enabled API — can take up to 5 minutes to propagate",
    ],
    fix: `# Enable the API in Cloud Console:
open "https://console.cloud.google.com/apis/library"

# Or via gcloud CLI (fastest):
gcloud services enable gmail.googleapis.com
gcloud services enable calendar-json.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable sheets.googleapis.com

# Verify which project you're working in:
gcloud config get-value project

# List enabled APIs:
gcloud services list --enabled | grep -E "gmail|calendar|drive|sheets"`,
  },
  {
    code: "calendar_403",
    title: "403 on Calendar — Not shared with service account",
    causes: [
      "Using a service account without domain-wide delegation for personal calendars",
      "Calendar ID is wrong (typo in email or calendar ID)",
      "Service account email not added as a calendar member",
    ],
    fix: `# Option A — Share the calendar explicitly:
# Google Calendar → [Calendar name] → Settings → Share with specific people
# Add: conductor-mcp@project-id.iam.gserviceaccount.com
# Permission: "Make changes to events" (or "See all event details" for read-only)

# Option B — Use domain-wide delegation (Workspace only):
# Follow the domain-wide delegation setup steps in this guide.
# Then set "subject" in your config to the user's email whose calendar to access.

# Option C — Use OAuth (user flow) instead of service account.
# Service accounts cannot access personal Google calendars without delegation.`,
  },
  {
    code: "gmail_send_as",
    title: "Gmail Send As errors / sending from wrong address",
    causes: [
      "Trying to send from an alias not configured in Gmail",
      "Service account impersonation not set up correctly",
      "'from' address doesn't match the authorized account",
    ],
    fix: `# To send from an alias, the alias must be configured in Gmail settings:
# Gmail → Settings → Accounts and Import → Send mail as → Add another email

# For OAuth: you can only send as addresses configured in that Gmail account.
# The "from" field must be either the primary email or a configured send-as alias.

# For service accounts with delegation:
# Set "subject" to the user whose Gmail you want to send from.
# The service account sends on behalf of that user.

# To send as "me" (default, uses the authenticated account's primary email):
{
  "plugins": {
    "gmail": {
      "defaultFrom": "me"
    }
  }
}`,
  },
  {
    code: "rate_limit_429",
    title: "429 Too Many Requests / Rate limit exceeded",
    causes: [
      "Sending too many requests per second (per-user rate limit)",
      "Exceeded daily quota for the API",
      "Running many parallel requests without throttling",
    ],
    fix: `# Conductor automatically retries with exponential backoff on 429 responses.
# Default: up to 5 retries, starting at 1 second, doubling each time.

# If you consistently hit limits, configure retry behavior:
{
  "plugins": {
    "gmail": {
      "retryConfig": {
        "maxRetries": 7,
        "initialDelayMs": 1000,
        "maxDelayMs": 64000
      }
    }
  }
}

# To request quota increases:
# Cloud Console → APIs & Services → [API name] → Quotas
# Click the pencil icon next to the quota you want to increase
# Increases for Gmail send quota often require a review by Google.

# Current limits (see quota table in this page for full details)
# Gmail: 250 quota units/user/second, 1 billion units/day
# Drive: 12,000 requests/minute/user
# Sheets: 300 read/write requests/minute/project`,
  },
  {
    code: "access_denied_consent",
    title: "access_denied on consent screen",
    causes: [
      "App is in Testing mode and the Google account is not a test user",
      "The account is in a Workspace org that blocks external OAuth apps",
      "The app requires verification for sensitive scopes",
    ],
    fix: `# Fix 1 — Add the user as a test user (most common cause):
# Cloud Console → APIs & Services → OAuth consent screen
# Scroll to "Test users" → "+ Add users"
# Add every Google account email that needs access.
# Click "Save"

# Fix 2 — If in a Google Workspace org blocking OAuth apps:
# Admin Console (admin.google.com) → Security → API controls
# Configure which OAuth apps are trusted for your domain.
# Or switch to Internal app type (only for Workspace).

# Fix 3 — Sensitive scope verification:
# Some scopes (gmail.send, drive, calendar) are marked "sensitive" or "restricted".
# While in Testing, these work only for listed test users.
# To allow any user: publish the app and complete Google's verification process.`,
  },
];

// ─── Page component ──────────────────────────────────────────────────────────

export default function GoogleIntegrationPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Google
        </h1>
        <p className="mt-3 text-[#666]">
          Complete setup guide for Gmail, Google Calendar, Google Drive, Google Sheets, and GCP
          integration with Conductor. Covers OAuth 2.0, service accounts, every scope, every
          tool, and every error you might encounter.
        </p>
      </div>

      <div className="space-y-14">

        {/* Overview */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Overview</h2>
          <p className="mb-4 text-sm text-[#666]">
            Conductor connects to Google services through two auth mechanisms: OAuth 2.0
            (for personal accounts and interactive use) and service accounts (for
            server-side, CI/CD, or Google Workspace automation). You configure credentials
            once; Conductor handles token refresh automatically.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Service</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">What Conductor can do</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Plugin key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["Gmail", "Read, search, send, label, archive, delete messages and threads", "gmail"],
                  ["Google Calendar", "List, create, update, delete events; query free/busy", "gcal"],
                  ["Google Drive", "List, read, upload, share, delete files; Shared Drive support", "drive"],
                  ["Google Sheets", "Read, write, append, clear ranges; formula support", "sheets"],
                  ["Google Docs", "Read document content, export as text/HTML/PDF", "docs"],
                  ["GCP", "Cloud Console API management via gcloud-compatible config", "gcp"],
                ].map(([service, desc, key]) => (
                  <tr key={service}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{service}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{desc}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-[#444]">{key}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Google Cloud Console setup */}
        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">Google Cloud Console setup</h2>
          <p className="mb-6 text-sm text-[#666]">
            Before Conductor can talk to any Google service, you need a Google Cloud project
            with the right APIs enabled and an OAuth 2.0 credential (or service account key).
            This section walks through every step.
          </p>

          <div className="space-y-6">

            {/* Step 1: Create project */}
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Step 1 — Create a Google Cloud project</h3>
              <p className="mb-3 text-sm text-[#555]">
                If you already have a project you want to use, skip this step. Otherwise:
              </p>
              <ol className="space-y-1 text-sm text-[#555]">
                <li className="flex gap-2"><span className="shrink-0 font-mono text-[#333]">1.</span>Go to <span className="font-mono text-[#777]">console.cloud.google.com</span></li>
                <li className="flex gap-2"><span className="shrink-0 font-mono text-[#333]">2.</span>Click the project dropdown in the top bar → "New Project"</li>
                <li className="flex gap-2"><span className="shrink-0 font-mono text-[#333]">3.</span>Enter a project name (e.g. "conductor-mcp") and click "Create"</li>
                <li className="flex gap-2"><span className="shrink-0 font-mono text-[#333]">4.</span>Wait for creation, then select the new project in the dropdown</li>
                <li className="flex gap-2"><span className="shrink-0 font-mono text-[#333]">5.</span>Note the Project ID (shown under the project name) — you'll use it in CLI commands</li>
              </ol>
            </div>

            {/* Step 2: Enable APIs */}
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Step 2 — Enable the required APIs</h3>
              <p className="mb-3 text-sm text-[#555]">
                Each Google service requires its API to be explicitly enabled in the project.
                APIs that are not enabled return a <span className="font-mono text-[#777]">serviceNotActivated</span> error.
              </p>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">enable APIs</span>
                  <CopyButton text={enableApisCmd} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{enableApisCmd}</code></pre>
              </div>
            </div>

            {/* Step 3: OAuth consent screen */}
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Step 3 — Configure the OAuth consent screen</h3>
              <p className="mb-3 text-sm text-[#555]">
                The OAuth consent screen is what users see when they authorize your app.
                Even for personal use (just you), you still need to configure it.
              </p>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">consent screen setup</span>
                  <CopyButton text={oauthConsentSetup} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{oauthConsentSetup}</code></pre>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                  <span className="mt-px shrink-0 font-mono text-[10px] text-[#333]">note</span>
                  <p className="text-xs text-[#555]">
                    If you chose <span className="font-mono text-[#666]">External</span> and your app is in{" "}
                    <span className="font-mono text-[#666]">Testing</span> mode, refresh tokens are
                    valid for only 7 days. You will need to re-authorize every week unless you publish the
                    app or switch to Internal (Workspace only).
                  </p>
                </div>
                <div className="flex items-start gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                  <span className="mt-px shrink-0 font-mono text-[10px] text-[#333]">tip</span>
                  <p className="text-xs text-[#555]">
                    For personal use, set the user type to <span className="font-mono text-[#666]">Internal</span> if
                    you have a Google Workspace account. For regular Gmail accounts, use{" "}
                    <span className="font-mono text-[#666]">External</span> and add yourself as a test user.
                    You don't need to publish or go through verification for personal use.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4: Create OAuth credentials */}
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Step 4 — Create OAuth 2.0 credentials (Desktop app)</h3>
              <p className="mb-3 text-sm text-[#555]">
                This generates the <span className="font-mono text-[#777]">client_id</span> and{" "}
                <span className="font-mono text-[#777]">client_secret</span> that Conductor uses to initiate
                the OAuth flow.
              </p>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">create credentials</span>
                  <CopyButton text={createOAuthCredentials} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{createOAuthCredentials}</code></pre>
              </div>
            </div>

          </div>
        </section>

        {/* OAuth 2.0 flow */}
        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">OAuth 2.0 flow</h2>
          <p className="mb-6 text-sm text-[#666]">
            Conductor implements the OAuth 2.0 Authorization Code flow with PKCE for Desktop apps.
            Here's exactly what happens at each stage.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">First-time authorization</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">first-time auth</span>
                  <CopyButton text={firstTimeAuth} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{firstTimeAuth}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Token storage and refresh</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">token storage</span>
                  <CopyButton text={tokenStorage} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{tokenStorage}</code></pre>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "access_token",
                  desc: "Short-lived credential included in every API request as a Bearer token. Expires in 1 hour.",
                },
                {
                  label: "refresh_token",
                  desc: "Long-lived token used to obtain new access tokens. Persists until revoked. Guard this carefully.",
                },
                {
                  label: "redirect_uri",
                  desc: "For Desktop apps: http://127.0.0.1 (loopback). Conductor opens a local port to capture the code.",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                  <p className="mb-1 font-mono text-[11px] font-semibold text-[#777]">{item.label}</p>
                  <p className="text-xs text-[#444]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gmail plugin */}
        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">Gmail plugin</h2>
          <p className="mb-6 text-sm text-[#666]">
            The Gmail plugin exposes read, search, send, label, archive, delete, and thread
            operations. You control exactly what&apos;s accessible through the scopes you
            configure.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Configuration</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
                  <CopyButton text={gmailConfig} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{gmailConfig}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-sm font-semibold text-[#888]">Gmail scopes</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
                <table className="w-full text-sm">
                  <thead className="bg-[#080808]">
                    <tr className="border-b border-[#1a1a1a]">
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Scope</th>
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Grants</th>
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Sensitivity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                    {[
                      ["gmail.send", "Send email on behalf of the user. Does not grant read access.", "Sensitive"],
                      ["gmail.readonly", "Read all messages and metadata. Cannot send or modify.", "Sensitive"],
                      ["gmail.modify", "Read and modify messages (label, archive, mark read/unread). Cannot delete permanently or send.", "Sensitive"],
                      ["gmail.labels", "Create, read, update, delete labels only. No message content.", "Sensitive"],
                      ["gmail.compose", "Create draft messages. Does not send or read existing messages.", "Sensitive"],
                      ["gmail (full)", "Full access to the mailbox including delete. Use only when necessary.", "Restricted"],
                    ].map(([scope, grants, sensitivity]) => (
                      <tr key={scope}>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-[#777]">...auth/{scope}</td>
                        <td className="px-4 py-2.5 text-xs text-[#555]">{grants}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#444]">{sensitivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Available tools</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">gmail tools + example prompts</span>
                  <CopyButton text={gmailTools} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{gmailTools}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Google Calendar plugin */}
        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">Google Calendar plugin</h2>
          <p className="mb-6 text-sm text-[#666]">
            Read and write Google Calendar events across multiple calendars. Supports
            recurring events, attendees, conference links, and free/busy queries.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Configuration</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
                  <CopyButton text={calendarConfig} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{calendarConfig}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Finding your Calendar ID and working with multiple calendars</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">calendar IDs</span>
                  <CopyButton text={calendarIdHowTo} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{calendarIdHowTo}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-sm font-semibold text-[#888]">Calendar scopes</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
                <table className="w-full text-sm">
                  <thead className="bg-[#080808]">
                    <tr className="border-b border-[#1a1a1a]">
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Scope</th>
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Grants</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                    {[
                      ["calendar.readonly", "Read-only access to all calendars and events the user can see."],
                      ["calendar.events", "Create, edit, and delete events on all calendars the user owns."],
                      ["calendar.events.readonly", "Read-only access to events (but not calendar metadata)."],
                      ["calendar (full)", "Full access: create/delete calendars, manage ACLs, manage events."],
                      ["calendar.freebusy", "Read-only query of free/busy information (no event details)."],
                      ["calendar.settings.readonly", "Read calendar settings (timezone, language, etc.)."],
                    ].map(([scope, grants]) => (
                      <tr key={scope}>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-[#777]">...auth/{scope}</td>
                        <td className="px-4 py-2.5 text-xs text-[#555]">{grants}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Available tools</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">gcal tools + example prompts</span>
                  <CopyButton text={calendarTools} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{calendarTools}</code></pre>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
              <span className="mt-px shrink-0 font-mono text-[10px] text-[#333]">timezone</span>
              <p className="text-xs text-[#555]">
                Conductor passes the configured <span className="font-mono text-[#666]">timezone</span> to the
                Calendar API for all event times. If not set, it defaults to UTC. Event times returned
                by the API are always in ISO 8601 format (e.g.{" "}
                <span className="font-mono text-[#666]">2024-09-15T14:00:00-04:00</span>). All-day events
                use date-only format (<span className="font-mono text-[#666]">2024-09-15</span>).
                Use standard IANA timezone names (<span className="font-mono text-[#666]">America/New_York</span>,{" "}
                <span className="font-mono text-[#666]">Europe/London</span>, <span className="font-mono text-[#666]">Asia/Tokyo</span>).
              </p>
            </div>
          </div>
        </section>

        {/* Google Drive plugin */}
        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">Google Drive plugin</h2>
          <p className="mb-6 text-sm text-[#666]">
            List, read, upload, share, and delete files. Supports both personal My Drive and
            Shared Drives (Team Drives). Auto-exports Google Docs/Sheets/Slides to text or CSV.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Configuration</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
                  <CopyButton text={driveConfig} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{driveConfig}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-sm font-semibold text-[#888]">Drive scopes</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
                <table className="w-full text-sm">
                  <thead className="bg-[#080808]">
                    <tr className="border-b border-[#1a1a1a]">
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Scope</th>
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Grants</th>
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Recommended for</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                    {[
                      ["drive.readonly", "Read metadata and file content. Cannot create or modify.", "Auditing, reading reports"],
                      ["drive.file", "Full access to only files created or opened by the app. Cannot access pre-existing files unless the user opens them via file picker.", "Least-privilege write access"],
                      ["drive.appdata", "Read/write a hidden app-specific folder. Not visible to users.", "Storing app data"],
                      ["drive.metadata.readonly", "Read metadata only (names, IDs, MIME types). No file content.", "File discovery only"],
                      ["drive.metadata", "Read and write metadata. Cannot read file content.", "Rename/organize files"],
                      ["drive (full)", "Full access to all files in My Drive and Shared Drives.", "Automation with broad scope"],
                    ].map(([scope, grants, rec]) => (
                      <tr key={scope}>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-[#777]">...auth/{scope}</td>
                        <td className="px-4 py-2.5 text-xs text-[#555]">{grants}</td>
                        <td className="px-4 py-2.5 text-xs text-[#444]">{rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">File IDs and how to find them</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">file IDs</span>
                  <CopyButton text={driveFileId} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{driveFileId}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Shared Drives (Team Drives)</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">shared drives setup</span>
                  <CopyButton text={driveSharedDrives} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{driveSharedDrives}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Available tools</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">drive tools + example prompts</span>
                  <CopyButton text={driveTools} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{driveTools}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Google Sheets plugin */}
        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">Google Sheets plugin</h2>
          <p className="mb-6 text-sm text-[#666]">
            Read and write spreadsheet data using A1 notation or named ranges.
            Full formula support via <span className="font-mono text-[#777]">USER_ENTERED</span> input option.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Configuration</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
                  <CopyButton text={sheetsConfig} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{sheetsConfig}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Spreadsheet ID, A1 notation, and value input options</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">sheets reference</span>
                  <CopyButton text={sheetsSpreadsheetId} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{sheetsSpreadsheetId}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Available tools</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">sheets tools + example prompts</span>
                  <CopyButton text={sheetsTools} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{sheetsTools}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Service accounts */}
        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">Service account setup</h2>
          <p className="mb-4 text-sm text-[#666]">
            Service accounts are for automated, server-side, or CI/CD use cases where there
            is no user present to complete an OAuth flow. They authenticate with a private
            key rather than going through a browser.
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <p className="mb-2 font-mono text-[11px] font-semibold text-[#666]">Use OAuth 2.0 when</p>
              <ul className="space-y-1 text-xs text-[#444]">
                <li>— You are a human running Conductor locally</li>
                <li>— You need to access your personal Gmail, Calendar, or Drive</li>
                <li>— You want browser-based consent (explicit user approval)</li>
                <li>— You don&apos;t have a Google Workspace account</li>
                <li>— Accessing resources owned by a specific user account</li>
              </ul>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <p className="mb-2 font-mono text-[11px] font-semibold text-[#666]">Use service accounts when</p>
              <ul className="space-y-1 text-xs text-[#444]">
                <li>— Running in CI/CD pipelines (GitHub Actions, etc.)</li>
                <li>— Accessing shared/team-owned Google Drive folders</li>
                <li>— Running Conductor as a background service</li>
                <li>— You have Google Workspace and can use domain-wide delegation</li>
                <li>— Multiple users share the same Conductor instance</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Creating a service account and downloading the key</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">service account setup</span>
                  <CopyButton text={serviceAccountCreate} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{serviceAccountCreate}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Sharing files with the service account</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">sharing with service account</span>
                  <CopyButton text={shareServiceAccountDrive} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{shareServiceAccountDrive}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Domain-wide delegation (Google Workspace)</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">domain-wide delegation</span>
                  <CopyButton text={domainWideDelegation} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{domainWideDelegation}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#888]">Service account config</h3>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json (service account)</span>
                  <CopyButton text={serviceAccountConfig} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{serviceAccountConfig}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Full config example */}
        <section>
          <h2 className="mb-2 font-mono text-xl font-semibold">Complete config example</h2>
          <p className="mb-4 text-sm text-[#666]">
            All four Google plugins configured in a single{" "}
            <span className="font-mono text-[#777]">~/.conductor/config.json</span> using OAuth.
            Replace path values with your actual file locations.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
              <CopyButton text={fullConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{fullConfig}</code></pre>
          </div>
        </section>

        {/* Scopes reference */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">All scopes reference</h2>
          <p className="mb-4 text-sm text-[#666]">
            Every Google API scope used by Conductor plugins. Sensitive scopes require adding
            users to the test user list while the OAuth app is unpublished. Restricted scopes
            require Google verification for production use by external users.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Scope URI</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Service</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Access level</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["...gmail.send", "Gmail", "Send email only", "Sensitive"],
                  ["...gmail.readonly", "Gmail", "Read all messages", "Sensitive"],
                  ["...gmail.modify", "Gmail", "Read + modify (no send/delete)", "Sensitive"],
                  ["...gmail.labels", "Gmail", "Labels CRUD only", "Sensitive"],
                  ["...gmail.compose", "Gmail", "Create drafts only", "Sensitive"],
                  ["...gmail", "Gmail", "Full mailbox access", "Restricted"],
                  ["...calendar.readonly", "Calendar", "Read all calendars + events", "Sensitive"],
                  ["...calendar.events", "Calendar", "Create/edit/delete events", "Sensitive"],
                  ["...calendar.events.readonly", "Calendar", "Read events only", "Sensitive"],
                  ["...calendar", "Calendar", "Full calendar access", "Sensitive"],
                  ["...calendar.freebusy", "Calendar", "Free/busy query only", "Non-sensitive"],
                  ["...calendar.settings.readonly", "Calendar", "Read settings only", "Non-sensitive"],
                  ["...drive.readonly", "Drive", "Read all files", "Sensitive"],
                  ["...drive.file", "Drive", "Files created by app only", "Non-sensitive"],
                  ["...drive.appdata", "Drive", "Hidden app folder only", "Non-sensitive"],
                  ["...drive.metadata", "Drive", "Read/write metadata", "Sensitive"],
                  ["...drive.metadata.readonly", "Drive", "Read metadata only", "Non-sensitive"],
                  ["...drive", "Drive", "Full Drive access", "Restricted"],
                  ["...spreadsheets.readonly", "Sheets", "Read spreadsheets", "Sensitive"],
                  ["...spreadsheets", "Sheets", "Read + write spreadsheets", "Sensitive"],
                  ["...documents.readonly", "Docs", "Read documents", "Sensitive"],
                  ["...documents", "Docs", "Read + write documents", "Sensitive"],
                ].map(([scope, service, access, cls]) => (
                  <tr key={scope}>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-[#666]">googleapis.com/auth/{scope.replace("...", "")}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-[#555]">{service}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{access}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-[#444]">{cls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quota and rate limits */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Quota and rate limits</h2>
          <p className="mb-4 text-sm text-[#666]">
            Google enforces per-user and per-project quotas. Conductor retries on 429
            automatically with exponential backoff, but for high-volume use you may need to
            request quota increases in Cloud Console.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">API</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Daily limit</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Per-minute / per-user</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-[#444]">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["Gmail", "1B quota units/day", "250 units/user/second", "Send: 500 messages/day (free), 2000 (Workspace). Each send = 100 units."],
                  ["Gmail (send)", "500 msg/day (free)", "—", "Workspace increases to 2,000/day. Bulk sending may trigger spam filters."],
                  ["Calendar", "1M requests/day", "~60 requests/user/second", "Free/busy queries are cheaper. Recurring event expansions count as separate requests."],
                  ["Drive", "No hard daily cap", "12,000 req/min/user", "Download bandwidth: 10 TB/day. Upload: no published limit. Large files count more."],
                  ["Drive (export)", "10 exports/file/day", "—", "Exporting Google Docs to PDF/DOCX. Limit applies per file."],
                  ["Sheets", "No hard daily cap", "300 read + 300 write req/min/project", "Single-cell writes are expensive. Batch updates (batchUpdate) use 1 request for N cells."],
                  ["Sheets (read)", "—", "300 req/min/project", "Use batchGet to read multiple ranges in one request."],
                ].map(([api, daily, perMin, notes]) => (
                  <tr key={api}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#777]">{api}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-[#555]">{daily}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-[#555]">{perMin}</td>
                    <td className="px-4 py-2.5 text-xs text-[#444]">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-start gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
            <span className="mt-px shrink-0 font-mono text-[10px] text-[#333]">tip</span>
            <p className="text-xs text-[#555]">
              To request a quota increase: Cloud Console → APIs &amp; Services → [API] → Quotas and System Limits.
              Click the pencil icon next to the quota you need increased. Provide a justification.
              Gmail send quota increases in particular require a review by Google and may take several days.
            </p>
          </div>
        </section>

        {/* Common errors */}
        <section>
          <h2 className="mb-5 font-mono text-xl font-semibold">Common errors and fixes</h2>
          <div className="space-y-4">
            {errors.map((error) => (
              <div key={error.code} className="overflow-hidden rounded-lg border border-[#1a1a1a]">
                <div className="border-b border-[#1a1a1a] bg-[#080808] px-5 py-4">
                  <h3 className="font-mono text-sm font-semibold text-white">{error.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {error.causes.map((c) => (
                      <span key={c} className="rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] text-[#444]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative bg-[#060606]">
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#666]">
                    <code>{error.fix}</code>
                  </pre>
                  <div className="absolute right-3 top-3">
                    <CopyButton text={error.fix} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security considerations */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Security considerations</h2>
          <p className="mb-4 text-sm text-[#666]">
            Google credentials give access to sensitive personal and organizational data.
            Follow these practices to minimize exposure.
          </p>
          <div className="space-y-3">
            {[
              {
                title: "Request minimal scopes",
                body: "Only add scopes for the operations you actually use. If you only need to read emails, use gmail.readonly not gmail (full access). If you only need to read sheets, use spreadsheets.readonly. Fewer scopes means a smaller blast radius if credentials are compromised.",
              },
              {
                title: "Protect credentials and token files",
                body: "The credentials JSON file contains your client_secret. The token file contains your refresh_token. Both allow full API access. Keep them at chmod 600. Never commit them to git. Add ~/.conductor/ to your .gitignore. Store them outside of any synced folder (Dropbox, iCloud).",
              },
              {
                title: "Service account key rotation",
                body: "Service account JSON keys do not expire by default. Create a rotation policy: delete and recreate keys periodically (quarterly or annually). When rotating, create the new key first, update the config, verify it works, then delete the old key. IAM & Admin → Service Accounts → Keys tab.",
              },
              {
                title: "Prefer drive.file scope over drive (full)",
                body: "The drive.file scope limits access to only files that Conductor creates or the user explicitly opens via picker. This is much safer than the full drive scope, which can read and modify every file in the user's Drive including sensitive documents.",
              },
              {
                title: "Service accounts cannot access personal resources without delegation",
                body: "A service account cannot read your personal Gmail or personal Google Calendar without domain-wide delegation. This is a feature, not a bug — it prevents accidental access to personal data in automated workflows. For personal data access, use OAuth.",
              },
              {
                title: "Audit which apps have OAuth access",
                body: "Periodically review connected apps at myaccount.google.com/permissions. Remove any old or unused OAuth grants. Each authorization creates a refresh token that remains valid until revoked, even if you stop using Conductor.",
              },
              {
                title: "Do not use your primary Google account for service accounts",
                body: "For CI/CD or server-side automation, create a dedicated Google Cloud project and service account. Do not reuse the project you use for personal development. This makes it easier to audit access, rotate credentials, and revoke without affecting personal workflows.",
              },
              {
                title: "Environment variables for CI/CD",
                body: "In CI pipelines, store the service account JSON as an environment variable or secret (e.g., GitHub Actions secrets → GOOGLE_SERVICE_ACCOUNT_JSON). Write it to a temp file at runtime rather than committing it to the repository.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <p className="mb-1.5 font-mono text-xs font-semibold text-[#777]">{item.title}</p>
                <p className="text-xs text-[#444]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Related</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { title: "Plugins overview", desc: "All available Conductor plugins and how to configure them.", href: "/docs/plugins" },
              { title: "Custom plugins", desc: "Build your own plugin to wrap any API, including other Google services.", href: "/docs/custom-plugins" },
              { title: "Security", desc: "Conductor security model, credential handling, and audit logging.", href: "/docs/security" },
              { title: "CI/CD integration", desc: "Using Conductor with GitHub Actions, GitLab CI, and other pipelines.", href: "/docs/ci-cd" },
              { title: "Troubleshooting", desc: "General diagnostic commands and common problems.", href: "/docs/troubleshooting" },
              { title: "All integrations", desc: "Setup guides for GitHub, Slack, Notion, AWS, and more.", href: "/docs/integrations" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start justify-between gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 transition-colors hover:border-[#2a2a2a]"
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[#555]">{item.desc}</p>
                </div>
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a2a2a] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
