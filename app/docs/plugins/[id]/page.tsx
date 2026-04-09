import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type Credential = {
  name: string;
  label: string;
  scopes?: string;
  url?: string;
  required: boolean;
};

type Tool = {
  name: string;
  desc: string;
  inputs: string;
  approval: boolean;
};

type Example = {
  prompt: string;
  tool: string;
};

type PluginDoc = {
  name: string;
  category: string;
  description: string;
  longDescription: string;
  zeroConfig: boolean | "partial";
  zeroConfigNote?: string;
  credentials: Credential[];
  tools: Tool[];
  examples: Example[];
  install?: string;
  setup?: string;
};

const PLUGINS: Record<string, PluginDoc> = {
  "file-system": {
    name: "File System",
    category: "Utilities",
    description: "Read, write, search, and manage files and directories.",
    longDescription:
      "The File System plugin gives your AI full access to the local filesystem. Read files, write content, search with grep patterns, list directories, and manage file metadata. Runs in a sandbox restricted to the working directory.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately. Restricted to working directory for safety.",
    credentials: [],
    tools: [
      { name: "fs_read", desc: "Read file contents", inputs: "path", approval: false },
      { name: "fs_write", desc: "Write content to a file", inputs: "path, content", approval: true },
      { name: "fs_exists", desc: "Check if file or directory exists", inputs: "path", approval: false },
      { name: "fs_mkdir", desc: "Create a directory", inputs: "path", approval: true },
      { name: "fs_remove", desc: "Remove a file or directory", inputs: "path", approval: true },
      { name: "fs_list", desc: "List directory contents", inputs: "path, filter?", approval: false },
      { name: "fs_search", desc: "Search files by name pattern", inputs: "directory, pattern", approval: false },
      { name: "fs_grep", desc: "Search file contents", inputs: "pattern, path, extensions?", approval: false },
      { name: "fs_stat", desc: "Get file metadata", inputs: "path", approval: false },
    ],
    examples: [
      { prompt: "Show me the contents of README.md", tool: "fs_read" },
      { prompt: "Create a new file called notes.txt", tool: "fs_write" },
      { prompt: "Find all TypeScript files in src/", tool: "fs_search" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: "Zero-config. Sandboxed to working directory by default.",
  },
  git: {
    name: "Git",
    category: "Developer",
    description: "Full git operations: commit, push, branch, status, and more.",
    longDescription:
      "Execute git commands directly from your AI. Commit changes, create and switch branches, push to remotes, view history, and manage remotes. All standard git operations are supported.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately if git is installed and repo is initialized.",
    credentials: [],
    tools: [
      { name: "git_status", desc: "Show working tree status", inputs: "repo?", approval: false },
      { name: "git_add", desc: "Stage files for commit", inputs: "paths, repo?", approval: true },
      { name: "git_commit", desc: "Commit staged changes", inputs: "message, repo?", approval: true },
      { name: "git_push", desc: "Push commits to remote", inputs: "remote?, branch?, repo?", approval: true },
      { name: "git_pull", desc: "Pull changes from remote", inputs: "remote?, branch?, repo?", approval: true },
      { name: "git_branch", desc: "List, create, or delete branches", inputs: "action, name?, repo?", approval: false },
      { name: "git_checkout", desc: "Switch branches or restore files", inputs: "branch|path, repo?", approval: true },
      { name: "git_log", desc: "Show commit history", inputs: "repo?, limit?", approval: false },
      { name: "git_diff", desc: "Show changes between commits", inputs: "from?, to?, repo?", approval: false },
      { name: "git_remote", desc: "Manage remote repositories", inputs: "action, name?, url?, repo?", approval: false },
    ],
    examples: [
      { prompt: "What's the status of my repo?", tool: "git_status" },
      { prompt: "Commit my changes with a message", tool: "git_commit" },
      { prompt: "Show me the last 5 commits", tool: "git_log" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: "Zero-config. Requires git CLI installed and initialized repository.",
  },
  "web-fetch": {
    name: "Web Fetch",
    category: "Utilities",
    description: "Fetch URLs, parse HTML, extract data from web pages.",
    longDescription:
      "Fetch any public URL and extract structured data. Parse HTML for content, follow redirects, and handle JSON APIs. Essential for web scraping and API integration.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately. Rate limited to prevent abuse.",
    credentials: [],
    tools: [
      { name: "web_fetch", desc: "Fetch a URL and return content", inputs: "url, parser?", approval: false },
      { name: "web_parse", desc: "Parse HTML and extract elements", inputs: "html, selector", approval: false },
      { name: "web_json", desc: "Fetch and parse JSON from API", inputs: "url", approval: false },
    ],
    examples: [
      { prompt: "What's on example.com?", tool: "web_fetch" },
      { prompt: "Get the JSON from this API endpoint", tool: "web_json" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: "Zero-config. Rate limited to 100 requests/minute.",
  },
  database: {
    name: "Database",
    category: "Developer",
    description: "Query SQLite, PostgreSQL, MySQL, and MongoDB databases.",
    longDescription:
      "Connect to databases and run queries. Supports SQLite (local files), PostgreSQL, MySQL, and MongoDB. Use for data exploration, migrations, and building AI-powered database tools.",
    zeroConfig: "partial",
    zeroConfigNote: "SQLite works without config. Other databases require connection string.",
    credentials: [
      { name: "DATABASE_URL", label: "Connection URL", url: "Postgres/MySQL/Mongo connection string", required: false },
    ],
    tools: [
      { name: "db_query", desc: "Run a SQL query", inputs: "query, database?", approval: true },
      { name: "db_tables", desc: "List tables in database", inputs: "database?", approval: false },
      { name: "db_schema", desc: "Get table schema", inputs: "table, database?", approval: false },
      { name: "db_execute", desc: "Execute a statement", inputs: "statement, database?", approval: true },
    ],
    examples: [
      { prompt: "What tables are in my database?", tool: "db_tables" },
      { prompt: "Run this SQL query", tool: "db_query" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: `conductor config set plugins.database.url "postgresql://user:pass@host/db"
# Or for SQLite (no config needed):
conductor config set plugins.database.type "sqlite"`,
  },
  notes: {
    name: "Notes",
    category: "Productivity",
    description: "Create and manage markdown notes with search.",
    longDescription:
      "A personal note-taking system backed by markdown files. Create, read, search, and organize notes. Notes are stored in ~/.conductor/notes/ by default.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately. Stores notes in ~/.conductor/notes/",
    credentials: [],
    tools: [
      { name: "notes_create", desc: "Create a new note", inputs: "title, content", approval: false },
      { name: "notes_read", desc: "Read a note by title", inputs: "title", approval: false },
      { name: "notes_list", desc: "List all notes", inputs: "filter?", approval: false },
      { name: "notes_search", desc: "Search notes by content", inputs: "query", approval: false },
      { name: "notes_delete", desc: "Delete a note", inputs: "title", approval: true },
      { name: "notes_update", desc: "Update an existing note", inputs: "title, content", approval: true },
    ],
    examples: [
      { prompt: "Create a note called 'meeting-notes' with today's notes", tool: "notes_create" },
      { prompt: "Find all notes about AI", tool: "notes_search" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: "Zero-config. Notes stored in ~/.conductor/notes/",
  },
  keychain: {
    name: "Keychain",
    category: "Utilities",
    description: "Securely store and retrieve credentials from OS keychain.",
    longDescription:
      "Store API keys, tokens, and secrets securely in the operating system's keychain (macOS Keychain, Windows Credential Manager, or Linux libsecret). Essential for plugin credentials.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately. Uses OS-native secure storage.",
    credentials: [],
    tools: [
      { name: "keychain_get", desc: "Retrieve a secret", inputs: "service, account", approval: false },
      { name: "keychain_set", desc: "Store a secret", inputs: "service, account, password", approval: true },
      { name: "keychain_delete", desc: "Delete a secret", inputs: "service, account", approval: true },
      { name: "keychain_list", desc: "List stored credentials", inputs: "service?", approval: false },
    ],
    examples: [
      { prompt: "Get my GitHub token", tool: "keychain_get" },
      { prompt: "Store a new API key", tool: "keychain_set" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: "Zero-config. Uses system keychain. Run with appropriate permissions.",
  },
  webhooks: {
    name: "Webhooks",
    category: "Developer",
    description: "Send webhooks and handle incoming webhook events.",
    longDescription:
      "Send HTTP POST requests to any URL (webhooks) and optionally handle incoming webhooks. Use for integrations with Slack, Zapier, GitHub Actions, and more.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately. Outgoing webhooks always available.",
    credentials: [],
    tools: [
      { name: "webhook_send", desc: "Send a webhook POST request", inputs: "url, payload, headers?", approval: true },
      { name: "webhook_list", desc: "List registered incoming webhooks", inputs: "", approval: false },
      { name: "webhook_register", desc: "Register an incoming webhook handler", inputs: "path, handler", approval: false },
    ],
    examples: [
      { prompt: "Send a webhook to Slack with this message", tool: "webhook_send" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: "Zero-config for outgoing webhooks. Incoming webhooks require server running.",
  },
  cron: {
    name: "Cron",
    category: "Developer",
    description: "Schedule and manage recurring tasks.",
    longDescription:
      "Schedule AI-powered tasks to run on a cron schedule. Perfect for daily standups, weekly reports, automated backups, and periodic data syncs.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately. Runs within the Conductor server process.",
    credentials: [],
    tools: [
      { name: "cron_list", desc: "List all scheduled tasks", inputs: "", approval: false },
      { name: "cron_add", desc: "Schedule a new task", inputs: "schedule, command, name?", approval: true },
      { name: "cron_remove", desc: "Remove a scheduled task", inputs: "name", approval: true },
      { name: "cron_enable", desc: "Enable a scheduled task", inputs: "name", approval: false },
      { name: "cron_disable", desc: "Disable a scheduled task", inputs: "name", approval: false },
    ],
    examples: [
      { prompt: "Schedule a daily report at 9am", tool: "cron_add" },
      { prompt: "Show my scheduled tasks", tool: "cron_list" },
    ],
    install: "Built-in — no installation needed. Works immediately.",
    setup: "Zero-config. Cron expressions follow standard format: * * * * *",
  },
  aws: {
    name: "AWS",
    category: "Cloud",
    description: "EC2, S3, Lambda, and other AWS services.",
    longDescription:
      "Manage AWS resources directly from your AI. List EC2 instances, manage S3 buckets, invoke Lambda functions, and more. Requires AWS credentials.",
    zeroConfig: false,
    credentials: [
      { name: "AWS_ACCESS_KEY_ID", label: "Access Key ID", url: "https://console.aws.amazon.com/iam", required: true },
      { name: "AWS_SECRET_ACCESS_KEY", label: "Secret Access Key", url: "https://console.aws.amazon.com/iam", required: true },
      { name: "AWS_REGION", label: "Default Region", url: "e.g., us-east-1", required: false },
    ],
    tools: [
      { name: "aws_ec2_list", desc: "List EC2 instances", inputs: "region?", approval: false },
      { name: "aws_ec2_start", desc: "Start an EC2 instance", inputs: "instanceId, region?", approval: true },
      { name: "aws_ec2_stop", desc: "Stop an EC2 instance", inputs: "instanceId, region?", approval: true },
      { name: "aws_s3_list", desc: "List S3 buckets", inputs: "region?", approval: false },
      { name: "aws_s3_read", desc: "Read an object from S3", inputs: "bucket, key, region?", approval: false },
      { name: "aws_s3_write", desc: "Write an object to S3", inputs: "bucket, key, content, region?", approval: true },
      { name: "aws_lambda_list", desc: "List Lambda functions", inputs: "region?", approval: false },
      { name: "aws_lambda_invoke", desc: "Invoke a Lambda function", inputs: "functionName, payload?, region?", approval: true },
    ],
    examples: [
      { prompt: "List my EC2 instances", tool: "aws_ec2_list" },
      { prompt: "Read file from S3 bucket", tool: "aws_s3_read" },
    ],
    install: "Built-in — no installation needed. Enable with conductor plugins enable aws",
    setup: `conductor plugins setup aws`,
  },
  gcp: {
    name: "GCP",
    category: "Cloud",
    description: "Compute Engine, Cloud Storage, Cloud Functions.",
    longDescription:
      "Manage Google Cloud Platform resources. List Compute Engine VMs, manage Cloud Storage buckets, and invoke Cloud Functions. Requires GCP service account credentials.",
    zeroConfig: false,
    credentials: [
      { name: "GCP_PROJECT_ID", label: "Project ID", url: "https://console.cloud.google.com", required: true },
      { name: "GCP_SERVICE_ACCOUNT", label: "Service Account JSON", url: "https://console.cloud.google.com/iam-admin/service-accounts", required: true },
    ],
    tools: [
      { name: "gcp_compute_list", desc: "List Compute Engine instances", inputs: "project?, zone?", approval: false },
      { name: "gcp_compute_start", desc: "Start a Compute Engine instance", inputs: "instance, project?, zone?", approval: true },
      { name: "gcp_compute_stop", desc: "Stop a Compute Engine instance", inputs: "instance, project?, zone?", approval: true },
      { name: "gcp_storage_list", desc: "List Cloud Storage buckets", inputs: "project?", approval: false },
      { name: "gcp_storage_read", desc: "Read an object from Cloud Storage", inputs: "bucket, object", approval: false },
      { name: "gcp_storage_write", desc: "Write an object to Cloud Storage", inputs: "bucket, object, content", approval: true },
      { name: "gcp_functions_list", desc: "List Cloud Functions", inputs: "project?, region?", approval: false },
      { name: "gcp_functions_invoke", desc: "Invoke a Cloud Function", inputs: "name, payload?, project?, region?", approval: true },
    ],
    examples: [
      { prompt: "List my GCP VMs", tool: "gcp_compute_list" },
      { prompt: "Read file from Cloud Storage", tool: "gcp_storage_read" },
    ],
    install: "Built-in — no installation needed. Enable with conductor plugins enable gcp",
    setup: `conductor plugins setup gcp`,
  },
  github: {
    name: "GitHub",
    category: "Developer",
    description: "Issues, PRs, code search, releases, forks, notifications.",
    longDescription:
      "The GitHub plugin gives your AI full access to GitHub — read repos, open issues, create pull requests, search code, and manage releases. Public data works without authentication; private repos and write operations require a personal access token.",
    zeroConfig: "partial",
    zeroConfigNote:
      "Public repository and user data works without authentication. Private repos and write operations (create issue, open PR) require a GitHub token.",
    credentials: [
      {
        name: "GITHUB_TOKEN",
        label: "Personal Access Token",
        scopes: "repo, workflow, read:org",
        url: "https://github.com/settings/tokens/new",
        required: false,
      },
    ],
    tools: [
      { name: "github_user", desc: "Get a user's profile", inputs: "username", approval: false },
      { name: "github_repo", desc: "Get repository details and metadata", inputs: "owner, repo", approval: false },
      { name: "github_repos", desc: "List a user's repositories", inputs: "username, sort?, per_page?", approval: false },
      { name: "github_issues", desc: "List issues with optional filters", inputs: "owner, repo, state?, label?, assignee?", approval: false },
      { name: "github_issue", desc: "Get a single issue by number", inputs: "owner, repo, number", approval: false },
      { name: "github_create_issue", desc: "Create a new issue", inputs: "owner, repo, title, body?, labels?", approval: true },
      { name: "github_close_issue", desc: "Close an issue", inputs: "owner, repo, number", approval: true },
      { name: "github_prs", desc: "List pull requests", inputs: "owner, repo, state?, base?", approval: false },
      { name: "github_pr", desc: "Get a single pull request", inputs: "owner, repo, number", approval: false },
      { name: "github_create_pr", desc: "Open a pull request", inputs: "owner, repo, title, head, base, body?", approval: true },
      { name: "github_file", desc: "Get file contents at a path", inputs: "owner, repo, path, ref?", approval: false },
      { name: "github_search_code", desc: "Search code on GitHub", inputs: "query, language?, repo?", approval: false },
      { name: "github_search_repos", desc: "Search repositories", inputs: "query, sort?, language?", approval: false },
      { name: "github_releases", desc: "List releases for a repo", inputs: "owner, repo, per_page?", approval: false },
      { name: "github_create_release", desc: "Create a new release", inputs: "owner, repo, tag, name, body?", approval: true },
      { name: "github_notifications", desc: "List unread notifications", inputs: "all?", approval: false },
      { name: "github_fork", desc: "Fork a repository", inputs: "owner, repo, org?", approval: true },
      { name: "github_star", desc: "Star a repository", inputs: "owner, repo", approval: true },
      { name: "github_commits", desc: "List commits on a branch", inputs: "owner, repo, sha?, path?", approval: false },
      { name: "github_compare", desc: "Compare two commits or branches", inputs: "owner, repo, base, head", approval: false },
    ],
    examples: [
      { prompt: "What are the open issues in my repo?", tool: "github_issues" },
      { prompt: "Create a bug report for the login page", tool: "github_create_issue" },
      { prompt: "Search for React hooks examples on GitHub", tool: "github_search_code" },
      { prompt: "What's in the latest release of Next.js?", tool: "github_releases" },
    ],
    setup: `# 1. Go to github.com/settings/tokens/new
# 2. Create a classic token with: repo, workflow, read:org scopes
# 3. Run setup:
conductor plugins setup github`,
  },
  slack: {
    name: "Slack",
    category: "Communication",
    description: "Send messages, read channels, manage threads and reactions.",
    longDescription:
      "The Slack plugin connects your AI to your Slack workspace. Send messages to channels or users, read recent messages, manage threads, and add reactions — all from a natural language prompt.",
    zeroConfig: false,
    credentials: [
      {
        name: "SLACK_BOT_TOKEN",
        label: "Bot Token",
        scopes: "channels:read, channels:history, chat:write, users:read",
        url: "https://api.slack.com/apps",
        required: true,
      },
    ],
    tools: [
      { name: "slack_send", desc: "Send a message to a channel or user", inputs: "channel, text, thread_ts?", approval: true },
      { name: "slack_read", desc: "Read recent messages from a channel", inputs: "channel, limit?", approval: false },
      { name: "slack_channels", desc: "List public channels in the workspace", inputs: "limit?, cursor?", approval: false },
      { name: "slack_users", desc: "List workspace members", inputs: "limit?", approval: false },
      { name: "slack_thread", desc: "Read a thread by message timestamp", inputs: "channel, thread_ts", approval: false },
      { name: "slack_react", desc: "Add a reaction emoji to a message", inputs: "channel, timestamp, emoji", approval: true },
    ],
    examples: [
      { prompt: "Send a message to #general: deployment complete", tool: "slack_send" },
      { prompt: "What were the last 10 messages in #engineering?", tool: "slack_read" },
      { prompt: "List all channels in the workspace", tool: "slack_channels" },
    ],
    install: "Built-in — enable with conductor plugins enable slack",
    setup: `# 1. Go to api.slack.com/apps and create a new app
# 2. Add OAuth scopes: channels:read, channels:history, chat:write, users:read
# 3. Install the app to your workspace and copy the Bot Token
conductor plugins setup slack`,
  },
  gmail: {
    name: "Gmail",
    category: "Communication",
    description: "Read, send, search, label, and archive emails.",
    longDescription:
      "Full Gmail access via the Google API. Read your inbox, send emails, search by query, manage labels, and archive messages. Uses OAuth 2.0 — your credentials never leave your machine.",
    zeroConfig: false,
    credentials: [
      {
        name: "GOOGLE_CLIENT_ID",
        label: "Google OAuth Client ID",
        url: "https://console.cloud.google.com/apis/credentials",
        required: true,
      },
      {
        name: "GOOGLE_CLIENT_SECRET",
        label: "Google OAuth Client Secret",
        url: "https://console.cloud.google.com/apis/credentials",
        required: true,
      },
    ],
    tools: [
      { name: "gmail_list", desc: "List messages in inbox or by query", inputs: "query?, maxResults?", approval: false },
      { name: "gmail_read", desc: "Read a message by ID", inputs: "id", approval: false },
      { name: "gmail_send", desc: "Send an email", inputs: "to, subject, body, cc?", approval: true },
      { name: "gmail_reply", desc: "Reply to a thread", inputs: "threadId, body", approval: true },
      { name: "gmail_archive", desc: "Archive a message", inputs: "id", approval: true },
      { name: "gmail_label", desc: "Apply or remove a label", inputs: "id, label, action", approval: true },
      { name: "gmail_search", desc: "Search messages with Gmail query syntax", inputs: "query, maxResults?", approval: false },
    ],
    examples: [
      { prompt: "Show my unread emails from today", tool: "gmail_list" },
      { prompt: "Send an email to john@example.com about the meeting", tool: "gmail_send" },
      { prompt: "Find emails from my bank in the last 30 days", tool: "gmail_search" },
    ],
    install: "Built-in — enable with conductor plugins enable gmail",
    setup: `# 1. Enable Gmail API at console.cloud.google.com
# 2. Create OAuth 2.0 credentials (Desktop app type)
# 3. Run setup — it will open a browser for OAuth consent:
conductor plugins setup gmail`,
  },
  notion: {
    name: "Notion",
    category: "Productivity",
    description: "Pages, databases, blocks, and full-text search.",
    longDescription:
      "Read and write Notion pages and databases. Create new pages, append content blocks, query database rows with filters, and search your entire workspace.",
    zeroConfig: false,
    credentials: [
      {
        name: "NOTION_TOKEN",
        label: "Internal Integration Token",
        url: "https://www.notion.so/my-integrations",
        required: true,
      },
    ],
    tools: [
      { name: "notion_search", desc: "Search pages and databases", inputs: "query, filter?", approval: false },
      { name: "notion_page", desc: "Get a page and its content", inputs: "page_id", approval: false },
      { name: "notion_create_page", desc: "Create a new page", inputs: "parent_id, title, content?", approval: true },
      { name: "notion_append", desc: "Append blocks to a page", inputs: "page_id, blocks", approval: true },
      { name: "notion_database_query", desc: "Query a database with filters", inputs: "database_id, filter?, sorts?", approval: false },
      { name: "notion_database_entry", desc: "Create a database row", inputs: "database_id, properties", approval: true },
      { name: "notion_update_page", desc: "Update page properties", inputs: "page_id, properties", approval: true },
      { name: "notion_databases", desc: "List databases you have access to", inputs: "", approval: false },
    ],
    examples: [
      { prompt: "Search my Notion for meeting notes from last week", tool: "notion_search" },
      { prompt: "Create a new page called Project Kickoff", tool: "notion_create_page" },
      { prompt: "Add a task to my Tasks database", tool: "notion_database_entry" },
    ],
    setup: `# 1. Go to notion.so/my-integrations and create a new integration
# 2. Copy the Internal Integration Token
# 3. Share your pages/databases with the integration
conductor plugins setup notion`,
  },
  gcal: {
    name: "Google Calendar",
    category: "Productivity",
    description: "Events, calendars, availability, and scheduling.",
    longDescription:
      "Read and create Google Calendar events. Check availability, list upcoming meetings, create events with attendees, and find free slots across multiple calendars.",
    zeroConfig: false,
    credentials: [
      { name: "GOOGLE_CLIENT_ID", label: "Google OAuth Client ID", url: "https://console.cloud.google.com/apis/credentials", required: true },
      { name: "GOOGLE_CLIENT_SECRET", label: "Google OAuth Client Secret", url: "https://console.cloud.google.com/apis/credentials", required: true },
    ],
    tools: [
      { name: "gcal_events", desc: "List upcoming events", inputs: "calendarId?, maxResults?, timeMin?", approval: false },
      { name: "gcal_event", desc: "Get a single event by ID", inputs: "calendarId, eventId", approval: false },
      { name: "gcal_create", desc: "Create a calendar event", inputs: "summary, start, end, attendees?, location?", approval: true },
      { name: "gcal_delete", desc: "Delete an event", inputs: "calendarId, eventId", approval: true },
      { name: "gcal_calendars", desc: "List all calendars", inputs: "", approval: false },
      { name: "gcal_freebusy", desc: "Check availability for a time range", inputs: "emails, timeMin, timeMax", approval: false },
    ],
    examples: [
      { prompt: "What meetings do I have tomorrow?", tool: "gcal_events" },
      { prompt: "Schedule a 1:1 with Sarah next Tuesday at 2pm", tool: "gcal_create" },
      { prompt: "Is John free on Thursday afternoon?", tool: "gcal_freebusy" },
    ],
    setup: `# 1. Enable Google Calendar API at console.cloud.google.com
# 2. Create OAuth 2.0 credentials
conductor plugins setup gcal`,
  },
  gdrive: {
    name: "Google Drive",
    category: "Productivity",
    description: "Files, folders, permissions, sharing, and search.",
    longDescription:
      "Browse and manage your Google Drive. List files, read document content, upload files, create folders, and manage sharing permissions.",
    zeroConfig: false,
    credentials: [
      { name: "GOOGLE_CLIENT_ID", label: "Google OAuth Client ID", url: "https://console.cloud.google.com/apis/credentials", required: true },
      { name: "GOOGLE_CLIENT_SECRET", label: "Google OAuth Client Secret", url: "https://console.cloud.google.com/apis/credentials", required: true },
    ],
    tools: [
      { name: "gdrive_list", desc: "List files in a folder", inputs: "folderId?, query?, pageSize?", approval: false },
      { name: "gdrive_read", desc: "Read a file's content", inputs: "fileId", approval: false },
      { name: "gdrive_search", desc: "Search files by name or content", inputs: "query", approval: false },
      { name: "gdrive_upload", desc: "Upload a file", inputs: "name, content, mimeType, folderId?", approval: true },
      { name: "gdrive_create_folder", desc: "Create a folder", inputs: "name, parentId?", approval: true },
      { name: "gdrive_share", desc: "Share a file with a user", inputs: "fileId, email, role", approval: true },
    ],
    examples: [
      { prompt: "List files in my Drive root folder", tool: "gdrive_list" },
      { prompt: "Find the Q4 budget spreadsheet", tool: "gdrive_search" },
    ],
    setup: `conductor plugins setup gdrive`,
  },
  vercel: {
    name: "Vercel",
    category: "Developer",
    description: "Deployments, domains, env vars, and project management.",
    longDescription:
      "Manage your Vercel projects from your AI. List and inspect deployments, check build logs, manage environment variables, and configure domains.",
    zeroConfig: false,
    credentials: [
      { name: "VERCEL_TOKEN", label: "Vercel API Token", url: "https://vercel.com/account/tokens", required: true },
    ],
    tools: [
      { name: "vercel_projects", desc: "List your Vercel projects", inputs: "limit?", approval: false },
      { name: "vercel_deployments", desc: "List deployments for a project", inputs: "projectId, limit?", approval: false },
      { name: "vercel_deployment", desc: "Get deployment details and status", inputs: "deploymentId", approval: false },
      { name: "vercel_logs", desc: "Get build logs for a deployment", inputs: "deploymentId", approval: false },
      { name: "vercel_env", desc: "List environment variables", inputs: "projectId", approval: false },
      { name: "vercel_env_set", desc: "Set an environment variable", inputs: "projectId, key, value, target", approval: true },
      { name: "vercel_domains", desc: "List domains for a project", inputs: "projectId", approval: false },
    ],
    examples: [
      { prompt: "What's the status of my latest deployment?", tool: "vercel_deployments" },
      { prompt: "Show me the build logs for the failed deployment", tool: "vercel_logs" },
      { prompt: "Set the API_URL env var for production", tool: "vercel_env_set" },
    ],
    setup: `# 1. Go to vercel.com/account/tokens and create a token
conductor plugins setup vercel`,
  },
  homekit: {
    name: "HomeKit",
    category: "Smart Home",
    description: "Control HomeKit devices, scenes, and automations.",
    longDescription:
      "Control your Apple HomeKit devices directly from your AI. Turn lights on and off, adjust thermostats, lock doors, trigger scenes, and check device states.",
    zeroConfig: false,
    credentials: [
      { name: "HOMEKIT_PIN", label: "HomeKit Bridge PIN", required: true },
    ],
    tools: [
      { name: "homekit_devices", desc: "List all HomeKit devices and their state", inputs: "", approval: false },
      { name: "homekit_set", desc: "Set a characteristic on a device", inputs: "device, characteristic, value", approval: true },
      { name: "homekit_scenes", desc: "List available scenes", inputs: "", approval: false },
      { name: "homekit_activate", desc: "Activate a scene", inputs: "scene", approval: true },
      { name: "homekit_rooms", desc: "List rooms and their devices", inputs: "", approval: false },
      { name: "homekit_status", desc: "Get the current state of a device", inputs: "device", approval: false },
    ],
    examples: [
      { prompt: "Turn off all the lights in the living room", tool: "homekit_set" },
      { prompt: "What is the temperature on the thermostat?", tool: "homekit_status" },
      { prompt: "Activate the Good Morning scene", tool: "homekit_activate" },
    ],
    setup: `conductor plugins setup homekit`,
  },
  weather: {
    name: "Weather",
    category: "System",
    description: "Current conditions and forecasts via Open-Meteo. No API key required.",
    longDescription:
      "Get real-time weather data for any city or coordinates using the Open-Meteo API. No API key is needed — this plugin is completely zero-config.",
    zeroConfig: true,
    zeroConfigNote: "Uses the Open-Meteo public API. No authentication required.",
    credentials: [],
    tools: [
      { name: "weather_current", desc: "Get current weather conditions", inputs: "location (city name or lat,lon)", approval: false },
      { name: "weather_forecast", desc: "Get a 7-day weather forecast", inputs: "location, days?", approval: false },
      { name: "weather_hourly", desc: "Get hourly forecast for today", inputs: "location", approval: false },
    ],
    examples: [
      { prompt: "What's the weather in San Francisco?", tool: "weather_current" },
      { prompt: "Will it rain in London this week?", tool: "weather_forecast" },
    ],
    setup: "No setup required. This plugin works immediately after install.",
  },
  n8n: {
    name: "n8n",
    category: "Developer",
    description: "Trigger workflows, list executions, and manage n8n automations.",
    longDescription:
      "Integrate with your self-hosted n8n instance. Trigger webhook workflows, list recent executions, and get workflow status directly from your AI.",
    zeroConfig: false,
    credentials: [
      { name: "N8N_URL", label: "n8n Instance URL", required: true },
      { name: "N8N_API_KEY", label: "n8n API Key", url: "http://your-n8n/settings/api", required: true },
    ],
    tools: [
      { name: "n8n_workflows", desc: "List all workflows", inputs: "active?", approval: false },
      { name: "n8n_workflow", desc: "Get workflow details", inputs: "id", approval: false },
      { name: "n8n_trigger", desc: "Trigger a workflow via webhook", inputs: "webhookPath, data?", approval: true },
      { name: "n8n_executions", desc: "List recent executions", inputs: "workflowId?, limit?", approval: false },
      { name: "n8n_execution", desc: "Get execution details and output", inputs: "id", approval: false },
    ],
    examples: [
      { prompt: "Trigger my daily report workflow", tool: "n8n_trigger" },
      { prompt: "Show the last 5 executions of the data sync workflow", tool: "n8n_executions" },
    ],
    setup: `conductor plugins setup n8n`,
  },
  spotify: {
    name: "Spotify",
    category: "Media",
    description: "Playback control, playlists, search, and library management.",
    longDescription:
      "Control Spotify from your AI. Play tracks, manage queues, search for music, browse playlists, and control active devices using the Spotify Web API.",
    zeroConfig: false,
    credentials: [
      { name: "SPOTIFY_CLIENT_ID", label: "Spotify Client ID", url: "https://developer.spotify.com/dashboard", required: true },
      { name: "SPOTIFY_CLIENT_SECRET", label: "Spotify Client Secret", url: "https://developer.spotify.com/dashboard", required: true },
    ],
    tools: [
      { name: "spotify_play", desc: "Play a track, album, or playlist", inputs: "uri?, context_uri?", approval: true },
      { name: "spotify_pause", desc: "Pause playback", inputs: "", approval: true },
      { name: "spotify_next", desc: "Skip to the next track", inputs: "", approval: true },
      { name: "spotify_search", desc: "Search Spotify catalog", inputs: "query, type (track|album|artist|playlist)", approval: false },
      { name: "spotify_current", desc: "Get the currently playing track", inputs: "", approval: false },
      { name: "spotify_playlists", desc: "List your playlists", inputs: "", approval: false },
      { name: "spotify_devices", desc: "List available playback devices", inputs: "", approval: false },
    ],
    examples: [
      { prompt: "Play some lo-fi hip hop", tool: "spotify_search" },
      { prompt: "What's currently playing?", tool: "spotify_current" },
      { prompt: "Skip this track", tool: "spotify_next" },
    ],
    setup: `# 1. Go to developer.spotify.com/dashboard and create an app
# 2. Add http://localhost:8888/callback as a redirect URI
conductor plugins setup spotify`,
  },
  x: {
    name: "X (Twitter)",
    category: "Social",
    description: "Post tweets, search, read timeline, and send DMs.",
    longDescription:
      "Post to X, search public tweets, read your timeline, and send direct messages using the X API v2.",
    zeroConfig: false,
    credentials: [
      { name: "X_API_KEY", label: "API Key", url: "https://developer.twitter.com/en/portal", required: true },
      { name: "X_API_SECRET", label: "API Key Secret", url: "https://developer.twitter.com/en/portal", required: true },
      { name: "X_ACCESS_TOKEN", label: "Access Token", url: "https://developer.twitter.com/en/portal", required: true },
      { name: "X_ACCESS_SECRET", label: "Access Token Secret", url: "https://developer.twitter.com/en/portal", required: true },
    ],
    tools: [
      { name: "x_tweet", desc: "Post a tweet", inputs: "text, reply_to?", approval: true },
      { name: "x_search", desc: "Search recent tweets", inputs: "query, max_results?", approval: false },
      { name: "x_timeline", desc: "Get your home timeline", inputs: "max_results?", approval: false },
      { name: "x_user", desc: "Get a user's profile", inputs: "username", approval: false },
      { name: "x_dm", desc: "Send a direct message", inputs: "user_id, text", approval: true },
    ],
    examples: [
      { prompt: "What's trending on X about AI today?", tool: "x_search" },
      { prompt: "Post a tweet: Just shipped v2.0!", tool: "x_tweet" },
    ],
    setup: `conductor plugins setup x`,
  },
  "github-actions": {
    name: "GitHub Actions",
    category: "Developer",
    description: "Trigger workflows, view runs, download artifacts.",
    longDescription:
      "Manage GitHub Actions from your AI. Trigger workflow dispatches, monitor run status, download artifacts, and inspect job logs.",
    zeroConfig: false,
    credentials: [
      { name: "GITHUB_TOKEN", label: "Personal Access Token", scopes: "repo, workflow", url: "https://github.com/settings/tokens", required: true },
    ],
    tools: [
      { name: "gha_runs", desc: "List workflow runs for a repo", inputs: "owner, repo, workflow_id?, status?", approval: false },
      { name: "gha_run", desc: "Get a single workflow run", inputs: "owner, repo, run_id", approval: false },
      { name: "gha_trigger", desc: "Trigger a workflow dispatch event", inputs: "owner, repo, workflow_id, ref, inputs?", approval: true },
      { name: "gha_logs", desc: "Download logs for a run", inputs: "owner, repo, run_id", approval: false },
      { name: "gha_artifacts", desc: "List artifacts for a run", inputs: "owner, repo, run_id", approval: false },
      { name: "gha_cancel", desc: "Cancel a running workflow", inputs: "owner, repo, run_id", approval: true },
    ],
    examples: [
      { prompt: "What's the status of the latest CI run?", tool: "gha_runs" },
      { prompt: "Trigger the deploy-production workflow", tool: "gha_trigger" },
      { prompt: "Show the logs from the failed job", tool: "gha_logs" },
    ],
    setup: `conductor plugins setup github-actions`,
  },
  linear: {
    name: "Linear",
    category: "Developer",
    description: "Issues, cycles, projects, and team management.",
    longDescription:
      "Full Linear integration — create and update issues, manage cycles and projects, assign work, and track progress across your engineering team.",
    zeroConfig: false,
    credentials: [
      { name: "LINEAR_API_KEY", label: "Linear API Key", url: "https://linear.app/settings/api", required: true },
    ],
    tools: [
      { name: "linear_issues", desc: "List issues with filters", inputs: "team?, state?, assignee?, label?", approval: false },
      { name: "linear_issue", desc: "Get a single issue by ID", inputs: "id", approval: false },
      { name: "linear_create_issue", desc: "Create a new issue", inputs: "title, teamId, description?, priority?, assignee?", approval: true },
      { name: "linear_update_issue", desc: "Update issue fields", inputs: "id, state?, assignee?, priority?", approval: true },
      { name: "linear_cycles", desc: "List cycles for a team", inputs: "teamId", approval: false },
      { name: "linear_projects", desc: "List projects", inputs: "teamId?", approval: false },
      { name: "linear_teams", desc: "List teams in the organization", inputs: "", approval: false },
      { name: "linear_members", desc: "List organization members", inputs: "", approval: false },
      { name: "linear_comment", desc: "Add a comment to an issue", inputs: "issueId, body", approval: true },
    ],
    examples: [
      { prompt: "What are my assigned issues in the current cycle?", tool: "linear_issues" },
      { prompt: "Create a bug report for the auth flow", tool: "linear_create_issue" },
      { prompt: "Move issue ENG-123 to In Progress", tool: "linear_update_issue" },
    ],
    setup: `# 1. Go to linear.app/settings/api
# 2. Create a Personal API Key
conductor plugins setup linear`,
  },
  jira: {
    name: "Jira",
    category: "Developer",
    description: "Issues, transitions, sprints, and project management.",
    longDescription:
      "Connect your AI to Jira Cloud or Server. Create and update issues, transition workflows, manage sprints, and query projects using JQL.",
    zeroConfig: false,
    credentials: [
      { name: "JIRA_URL", label: "Jira Instance URL", required: true },
      { name: "JIRA_EMAIL", label: "Account Email", required: true },
      { name: "JIRA_API_TOKEN", label: "API Token", url: "https://id.atlassian.com/manage-profile/security/api-tokens", required: true },
    ],
    tools: [
      { name: "jira_issues", desc: "Search issues with JQL", inputs: "jql, maxResults?", approval: false },
      { name: "jira_issue", desc: "Get a single issue by key", inputs: "key", approval: false },
      { name: "jira_create_issue", desc: "Create a new issue", inputs: "projectKey, summary, issueType, description?", approval: true },
      { name: "jira_transition", desc: "Transition an issue to a new status", inputs: "key, transition", approval: true },
      { name: "jira_assign", desc: "Assign an issue to a user", inputs: "key, accountId", approval: true },
      { name: "jira_comment", desc: "Add a comment to an issue", inputs: "key, body", approval: true },
      { name: "jira_projects", desc: "List accessible projects", inputs: "", approval: false },
      { name: "jira_sprints", desc: "List sprints for a board", inputs: "boardId, state?", approval: false },
    ],
    examples: [
      { prompt: "What's assigned to me in the current sprint?", tool: "jira_issues" },
      { prompt: "Create a bug for the login page crash", tool: "jira_create_issue" },
      { prompt: "Move PROJ-42 to Done", tool: "jira_transition" },
    ],
    setup: `# 1. Go to id.atlassian.com/manage-profile/security/api-tokens
# 2. Create an API token
conductor plugins setup jira`,
  },
  stripe: {
    name: "Stripe",
    category: "Finance",
    description: "Payments, customers, subscriptions, and refunds.",
    longDescription:
      "Query your Stripe account from your AI. Look up customers, view payment intents, manage subscriptions, issue refunds, and check balance.",
    zeroConfig: false,
    credentials: [
      { name: "STRIPE_SECRET_KEY", label: "Stripe Secret Key", url: "https://dashboard.stripe.com/apikeys", required: true },
    ],
    tools: [
      { name: "stripe_customers", desc: "List or search customers", inputs: "email?, limit?", approval: false },
      { name: "stripe_customer", desc: "Get a customer by ID", inputs: "id", approval: false },
      { name: "stripe_payments", desc: "List recent payment intents", inputs: "limit?, customer?", approval: false },
      { name: "stripe_payment", desc: "Get a single payment intent", inputs: "id", approval: false },
      { name: "stripe_subscriptions", desc: "List subscriptions", inputs: "customer?, status?", approval: false },
      { name: "stripe_subscription", desc: "Get subscription details", inputs: "id", approval: false },
      { name: "stripe_refund", desc: "Issue a refund", inputs: "charge, amount?, reason?", approval: true },
      { name: "stripe_balance", desc: "Get account balance", inputs: "", approval: false },
      { name: "stripe_invoice", desc: "Get an invoice by ID", inputs: "id", approval: false },
    ],
    examples: [
      { prompt: "Look up the customer with email sarah@example.com", tool: "stripe_customers" },
      { prompt: "Issue a full refund for charge ch_123", tool: "stripe_refund" },
      { prompt: "What's the current account balance?", tool: "stripe_balance" },
    ],
    setup: `# Use your Stripe test key during setup, switch to live key for production.
conductor plugins setup stripe`,
  },
  discord: {
    name: "Discord",
    category: "Communication",
    description: "Send messages, read channels, and manage roles.",
    longDescription:
      "Connect your AI to a Discord server via a bot token. Send messages to channels, read recent message history, manage roles, and list server members.",
    zeroConfig: false,
    credentials: [
      { name: "DISCORD_TOKEN", label: "Bot Token", url: "https://discord.com/developers/applications", required: true },
    ],
    tools: [
      { name: "discord_send", desc: "Send a message to a channel", inputs: "channelId, content", approval: true },
      { name: "discord_read", desc: "Read recent messages from a channel", inputs: "channelId, limit?", approval: false },
      { name: "discord_channels", desc: "List channels in a guild", inputs: "guildId", approval: false },
      { name: "discord_members", desc: "List server members", inputs: "guildId, limit?", approval: false },
      { name: "discord_roles", desc: "List roles in a guild", inputs: "guildId", approval: false },
    ],
    examples: [
      { prompt: "Send an announcement to #releases", tool: "discord_send" },
      { prompt: "What were the last 20 messages in #general?", tool: "discord_read" },
    ],
    setup: `# 1. Create a bot at discord.com/developers/applications
# 2. Invite the bot to your server with Send Messages and Read Message History scopes
conductor plugins setup discord`,
  },
  airtable: {
    name: "Airtable",
    category: "Productivity",
    description: "Read and write Airtable records, tables, and views.",
    longDescription:
      "Query and manage Airtable bases from your AI. List records with filters, create new rows, update existing records, and manage table structure.",
    zeroConfig: false,
    credentials: [
      { name: "AIRTABLE_TOKEN", label: "Personal Access Token", url: "https://airtable.com/create/tokens", required: true },
    ],
    tools: [
      { name: "airtable_records", desc: "List records in a table", inputs: "baseId, tableId, filterFormula?, sort?, maxRecords?", approval: false },
      { name: "airtable_record", desc: "Get a single record by ID", inputs: "baseId, tableId, recordId", approval: false },
      { name: "airtable_create", desc: "Create a new record", inputs: "baseId, tableId, fields", approval: true },
      { name: "airtable_update", desc: "Update a record's fields", inputs: "baseId, tableId, recordId, fields", approval: true },
      { name: "airtable_delete", desc: "Delete a record", inputs: "baseId, tableId, recordId", approval: true },
      { name: "airtable_bases", desc: "List accessible bases", inputs: "", approval: false },
    ],
    examples: [
      { prompt: "Show all open tasks in my project tracker", tool: "airtable_records" },
      { prompt: "Add a new customer record to CRM base", tool: "airtable_create" },
    ],
    setup: `# 1. Go to airtable.com/create/tokens
# 2. Create a token with data:records:read and data:records:write scopes
conductor plugins setup airtable`,
  },
  figma: {
    name: "Figma",
    category: "Developer",
    description: "Files, frames, components, comments, and exports.",
    longDescription:
      "Access your Figma files from your AI. Browse files, inspect frames and components, read comments, and export assets.",
    zeroConfig: false,
    credentials: [
      { name: "FIGMA_TOKEN", label: "Personal Access Token", url: "https://www.figma.com/settings", required: true },
    ],
    tools: [
      { name: "figma_files", desc: "List files in a project", inputs: "projectId", approval: false },
      { name: "figma_file", desc: "Get file structure and frames", inputs: "fileKey", approval: false },
      { name: "figma_components", desc: "List components in a file", inputs: "fileKey", approval: false },
      { name: "figma_comments", desc: "Get comments on a file", inputs: "fileKey", approval: false },
      { name: "figma_export", desc: "Export a node as an image", inputs: "fileKey, nodeId, format?", approval: false },
    ],
    examples: [
      { prompt: "List all frames in my design file", tool: "figma_file" },
      { prompt: "Show the comments on the homepage design", tool: "figma_comments" },
    ],
    setup: `# 1. Go to figma.com/settings and create a Personal Access Token
conductor plugins setup figma`,
  },
  shopify: {
    name: "Shopify",
    category: "Finance",
    description: "Products, orders, customers, and inventory management.",
    longDescription:
      "Manage your Shopify store from your AI. Browse products, check order status, look up customers, and update inventory.",
    zeroConfig: false,
    credentials: [
      { name: "SHOPIFY_STORE", label: "Store domain (e.g. mystore.myshopify.com)", required: true },
      { name: "SHOPIFY_TOKEN", label: "Admin API Access Token", url: "https://help.shopify.com/en/manual/apps/custom-apps", required: true },
    ],
    tools: [
      { name: "shopify_products", desc: "List products", inputs: "limit?, status?", approval: false },
      { name: "shopify_product", desc: "Get product details", inputs: "id", approval: false },
      { name: "shopify_orders", desc: "List orders with filters", inputs: "status?, limit?, email?", approval: false },
      { name: "shopify_order", desc: "Get a single order", inputs: "id", approval: false },
      { name: "shopify_customers", desc: "Search customers", inputs: "query?, limit?", approval: false },
      { name: "shopify_inventory", desc: "Check inventory levels", inputs: "productId", approval: false },
      { name: "shopify_update_inventory", desc: "Adjust inventory level", inputs: "inventoryItemId, locationId, available", approval: true },
    ],
    examples: [
      { prompt: "Show me all unfulfilled orders from today", tool: "shopify_orders" },
      { prompt: "What's the inventory level for product ID 123?", tool: "shopify_inventory" },
    ],
    setup: `conductor plugins setup shopify`,
  },
  twilio: {
    name: "Twilio",
    category: "Communication",
    description: "Send SMS, make calls, and check message logs.",
    longDescription:
      "Use your AI to send SMS messages and make calls via Twilio. Great for alerts, notifications, and automated communication workflows.",
    zeroConfig: false,
    credentials: [
      { name: "TWILIO_ACCOUNT_SID", label: "Account SID", url: "https://console.twilio.com", required: true },
      { name: "TWILIO_AUTH_TOKEN", label: "Auth Token", url: "https://console.twilio.com", required: true },
      { name: "TWILIO_FROM", label: "From Phone Number", required: true },
    ],
    tools: [
      { name: "twilio_sms", desc: "Send an SMS message", inputs: "to, body", approval: true },
      { name: "twilio_call", desc: "Initiate a phone call", inputs: "to, url", approval: true },
      { name: "twilio_messages", desc: "List recent messages", inputs: "to?, from?, limit?", approval: false },
      { name: "twilio_message", desc: "Get a message by SID", inputs: "sid", approval: false },
    ],
    examples: [
      { prompt: "Send an SMS to +1 555-0100: Your order is ready", tool: "twilio_sms" },
      { prompt: "Show me the last 10 messages sent from my number", tool: "twilio_messages" },
    ],
    setup: `conductor plugins setup twilio`,
  },
  docker: {
    name: "Docker",
    category: "Developer",
    description: "Containers, images, volumes, networks, and compose.",
    longDescription:
      "Manage your local Docker environment from your AI. List and inspect containers, pull images, manage volumes, and run compose operations.",
    zeroConfig: true,
    zeroConfigNote: "Requires Docker Desktop or Docker Engine running locally. No credentials needed.",
    credentials: [],
    tools: [
      { name: "docker_containers", desc: "List containers (running and stopped)", inputs: "all?", approval: false },
      { name: "docker_container", desc: "Inspect a container", inputs: "id", approval: false },
      { name: "docker_logs", desc: "Get container logs", inputs: "id, tail?", approval: false },
      { name: "docker_stop", desc: "Stop a running container", inputs: "id", approval: true },
      { name: "docker_start", desc: "Start a stopped container", inputs: "id", approval: true },
      { name: "docker_images", desc: "List local images", inputs: "", approval: false },
      { name: "docker_pull", desc: "Pull an image from a registry", inputs: "image", approval: true },
      { name: "docker_volumes", desc: "List volumes", inputs: "", approval: false },
    ],
    examples: [
      { prompt: "Show me all running containers", tool: "docker_containers" },
      { prompt: "Get the last 50 lines of logs from the web container", tool: "docker_logs" },
      { prompt: "Pull the latest postgres image", tool: "docker_pull" },
    ],
    setup: "No setup required. Docker must be running on your machine.",
  },
  shell: {
    name: "Shell",
    category: "Developer",
    description: "Safe shell command execution via a whitelist allowlist.",
    longDescription:
      "Run shell commands from your AI. The shell plugin uses a whitelist-based allowlist — only approved commands can be executed. No eval() or exec() with arbitrary strings.",
    zeroConfig: true,
    zeroConfigNote: "Works immediately. Allowed commands: ls, cat, git, npm, yarn, pnpm, node, python, echo, pwd, which, env, ps, df, du, find, grep, curl, ping.",
    credentials: [],
    tools: [
      { name: "shell_exec", desc: "Execute a whitelisted shell command", inputs: "command, args?, cwd?", approval: false },
      { name: "shell_background", desc: "Run a command in the background", inputs: "command, args?", approval: true },
      { name: "shell_kill", desc: "Kill a background process by PID", inputs: "pid", approval: true },
      { name: "shell_list", desc: "List allowed commands", inputs: "", approval: false },
    ],
    examples: [
      { prompt: "Run npm test in the current directory", tool: "shell_exec" },
      { prompt: "Start the dev server in the background", tool: "shell_background" },
    ],
    setup: "No setup required. Customize the allowed commands list in your config:",
  },
  calculator: {
    name: "Calculator",
    category: "Utilities",
    description: "Math expressions, unit conversions, and percentage calculations.",
    longDescription:
      "Evaluate mathematical expressions, convert between units, and calculate percentages. Powered by mathjs — supports complex expressions, matrices, and functions.",
    zeroConfig: true,
    zeroConfigNote: "Fully zero-config. No dependencies, no network access.",
    credentials: [],
    tools: [
      { name: "calculator_eval", desc: "Evaluate a math expression", inputs: "expression", approval: false },
      { name: "calculator_convert", desc: "Convert between units", inputs: "value, from, to", approval: false },
      { name: "calculator_percentage", desc: "Calculate percentage of a value", inputs: "value, percent", approval: false },
    ],
    examples: [
      { prompt: "What is 15% of 347?", tool: "calculator_percentage" },
      { prompt: "Convert 100 miles to kilometers", tool: "calculator_convert" },
      { prompt: "Solve: (sqrt(144) + 5^2) / 3", tool: "calculator_eval" },
    ],
    setup: "No setup required.",
  },
  todoist: {
    name: "Todoist",
    category: "Productivity",
    description: "Tasks, projects, labels, and filters.",
    longDescription:
      "Manage your Todoist tasks from your AI. Create tasks, complete them, organize by project, and browse your inbox.",
    zeroConfig: false,
    credentials: [
      { name: "TODOIST_TOKEN", label: "API Token", url: "https://todoist.com/app/settings/integrations", required: true },
    ],
    tools: [
      { name: "todoist_tasks", desc: "List tasks with optional filters", inputs: "projectId?, filter?, label?", approval: false },
      { name: "todoist_task", desc: "Get a single task", inputs: "id", approval: false },
      { name: "todoist_create", desc: "Create a new task", inputs: "content, projectId?, dueDate?, priority?", approval: true },
      { name: "todoist_complete", desc: "Mark a task as complete", inputs: "id", approval: true },
      { name: "todoist_projects", desc: "List all projects", inputs: "", approval: false },
    ],
    examples: [
      { prompt: "Show my tasks due today", tool: "todoist_tasks" },
      { prompt: "Add a task: Review PR #42 — due Friday", tool: "todoist_create" },
    ],
    setup: `conductor plugins setup todoist`,
  },
};

export function generateStaticParams() {
  return [
    "github",
    "slack",
    "gmail",
    "notion",
    "gcal",
    "gdrive",
    "vercel",
    "homekit",
    "weather",
    "n8n",
    "spotify",
    "x",
    "github-actions",
    "linear",
    "jira",
    "stripe",
    "discord",
    "airtable",
    "figma",
    "shopify",
    "twilio",
    "docker",
    "shell",
    "calculator",
    "todoist",
  ].map((id) => ({ id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PluginDetailPage({ params }: Props) {
  const { id } = await params;
  const plugin = PLUGINS[id];

  if (!plugin) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/docs/plugins"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3a3a3a] transition-colors hover:text-[#666]"
          >
            <ArrowLeft className="h-3 w-3" />
            Plugins
          </Link>
          <span className="font-mono text-[10px] text-[#222]">/</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3a3a3a]">
            {plugin.category}
          </span>
        </div>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          {plugin.name}
        </h1>
        <p className="mt-3 text-[#666]">{plugin.description}</p>
        <div className="mt-4 flex items-center gap-3">
          {plugin.zeroConfig === true ? (
            <span className="rounded-md border border-[#1a3a1a] bg-[#0a1a0a] px-3 py-1 font-mono text-xs text-[#446644]">
              zero-config
            </span>
          ) : plugin.zeroConfig === "partial" ? (
            <span className="rounded-md border border-[#2a2a0a] bg-[#1a1a0a] px-3 py-1 font-mono text-xs text-[#666633]">
              partial auth
            </span>
          ) : (
            <span className="rounded-md border border-[#1a1a1a] bg-[#080808] px-3 py-1 font-mono text-xs text-[#444]">
              requires credentials
            </span>
          )}
          <span className="rounded-md border border-[#1a1a1a] bg-[#080808] px-3 py-1 font-mono text-xs text-[#444]">
            {plugin.tools.length} tools
          </span>
        </div>
        {(plugin.zeroConfigNote) && (
          <p className="mt-3 text-xs text-[#444]">{plugin.zeroConfigNote}</p>
        )}
      </div>

      <div className="space-y-12">
        {/* Long description */}
        <section>
          <p className="text-sm leading-relaxed text-[#666]">{plugin.longDescription}</p>
        </section>

        {/* Credentials */}
        {plugin.credentials.length > 0 && (
          <section>
            <h2 className="mb-4 font-mono text-xl font-semibold">Credentials</h2>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                    <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Name</th>
                    <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Label</th>
                    {plugin.credentials.some((c) => c.scopes) && (
                      <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Scopes</th>
                    )}
                    <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Required</th>
                  </tr>
                </thead>
                <tbody>
                  {plugin.credentials.map((cred, i) => (
                    <tr key={cred.name} className={i < plugin.credentials.length - 1 ? "border-b border-[#111]" : ""}>
                      <td className="px-4 py-3">
                        <code className="font-mono text-white">{cred.name}</code>
                      </td>
                      <td className="px-4 py-3 text-[#555]">
                        {cred.url ? (
                          <a
                            href={cred.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white underline-offset-2 hover:underline"
                          >
                            {cred.label}
                          </a>
                        ) : (
                          cred.label
                        )}
                      </td>
                      {plugin.credentials.some((c) => c.scopes) && (
                        <td className="px-4 py-3 font-mono text-[11px] text-[#444]">
                          {cred.scopes ?? "—"}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        {cred.required ? (
                          <span className="font-mono text-[11px] text-white">required</span>
                        ) : (
                          <span className="font-mono text-[11px] text-[#444]">optional</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Setup */}
        {plugin.setup && (
          <section>
            <h2 className="mb-4 font-mono text-xl font-semibold">Setup</h2>
            <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
                <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
                <CopyButton text={plugin.setup} />
              </div>
              <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
                <code>{plugin.setup}</code>
              </pre>
            </div>
          </section>
        )}

        {/* Install */}
        {plugin.install && (
          <section>
            <h2 className="mb-4 font-mono text-xl font-semibold">Install</h2>
            <p className="text-sm text-[#666]">{plugin.install}</p>
          </section>
        )}

        {/* Tools */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Tools</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Tool</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Description</th>
                  <th className="hidden px-4 py-2.5 text-left font-mono font-medium text-[#333] sm:table-cell">Inputs</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Approval</th>
                </tr>
              </thead>
              <tbody>
                {plugin.tools.map((tool, i) => (
                  <tr
                    key={tool.name}
                    className={i < plugin.tools.length - 1 ? "border-b border-[#111]" : ""}
                  >
                    <td className="px-4 py-3">
                      <code className="font-mono text-white">{tool.name}</code>
                    </td>
                    <td className="px-4 py-3 text-[#555]">{tool.desc}</td>
                    <td className="hidden px-4 py-3 font-mono text-[11px] text-[#444] sm:table-cell">
                      {tool.inputs || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {tool.approval ? (
                        <span className="rounded bg-[#1a1010] px-2 py-0.5 font-mono text-[10px] text-[#664444]">
                          required
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-[#2a2a2a]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#444]">
            Tools marked <span className="rounded bg-[#1a1010] px-1.5 py-0.5 font-mono text-[10px] text-[#664444]">required</span> will
            prompt the user for approval before execution. These are typically write, delete, or send operations.
          </p>
        </section>

        {/* Examples */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Example Prompts</h2>
          <div className="space-y-3">
            {plugin.examples.map((ex) => (
              <div
                key={ex.tool}
                className="flex items-center justify-between gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4"
              >
                <p className="text-sm text-[#888]">&ldquo;{ex.prompt}&rdquo;</p>
                <code className="shrink-0 rounded bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#555]">
                  {ex.tool}
                </code>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer nav */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/plugins"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Plugins
        </Link>
      </div>
    </div>
  );
}
