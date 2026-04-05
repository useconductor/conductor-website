// FILE: app/docs/integrations/database/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const pgConnString = `postgresql://username:password@hostname:5432/database_name?sslmode=require`;

const pgConnStringAnnotated = `postgresql://
  username       — the database role to authenticate as
  :password      — the role's password (URL-encode special chars)
  @hostname      — host or IP of the PostgreSQL server
  :5432          — default PostgreSQL port (omit if using default)
  /database_name — the database to connect to
  ?sslmode=      — SSL mode (see SSL section below)`;

const mysqlConnString = `mysql://username:password@hostname:3306/database_name`;

const sqliteConnString = `sqlite:///absolute/path/to/database.db
# or relative (resolved from Conductor working directory)
sqlite://./local.db`;

const conductorConfig = `{
  "plugins": {
    "database": {
      "connections": {
        "primary": {
          "url": "postgresql://app_user:s3cr3t@db.example.com:5432/production?sslmode=require"
        },
        "analytics": {
          "url": "postgresql://readonly:s3cr3t@analytics.example.com:5432/warehouse?sslmode=verify-full"
        },
        "local": {
          "url": "sqlite:///Users/me/project/dev.db"
        }
      }
    }
  }
}`;

const pgReadOnlyUser = `-- Create a read-only role
CREATE ROLE readonly_role NOLOGIN;

-- Grant CONNECT on the database
GRANT CONNECT ON DATABASE production TO readonly_role;

-- Grant USAGE on all schemas
GRANT USAGE ON SCHEMA public TO readonly_role;

-- Grant SELECT on all existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;

-- Auto-grant SELECT on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO readonly_role;

-- Create login user and assign role
CREATE USER conductor_reader WITH PASSWORD 'your-password';
GRANT readonly_role TO conductor_reader;`;

const pgSSLModes = [
  { mode: "disable", desc: "No SSL. Never use in production — credentials sent in plain text." },
  { mode: "allow", desc: "Try non-SSL first, fall back to SSL. Not recommended." },
  { mode: "prefer", desc: "Try SSL first, fall back to non-SSL. Default for many clients." },
  { mode: "require", desc: "SSL required, but server certificate is not verified." },
  { mode: "verify-ca", desc: "SSL required, server certificate verified against a trusted CA." },
  { mode: "verify-full", desc: "SSL + server hostname must match the certificate. Most secure." },
];

const pgSSLCerts = `{
  "plugins": {
    "database": {
      "connections": {
        "primary": {
          "url": "postgresql://user:pass@host:5432/db?sslmode=verify-full",
          "ssl": {
            "ca": "/path/to/ca.crt",
            "cert": "/path/to/client.crt",
            "key": "/path/to/client.key"
          }
        }
      }
    }
  }
}`;

const poolingConfig = `{
  "plugins": {
    "database": {
      "connections": {
        "primary": {
          "url": "postgresql://user:pass@host:5432/db",
          "pool": {
            "min": 2,
            "max": 10,
            "idleTimeoutMs": 30000,
            "connectionTimeoutMs": 5000
          }
        }
      }
    }
  }
}`;

const paramQuery = `// Conductor passes parameterized queries automatically.
// Use $1, $2 placeholders in PostgreSQL:
SELECT * FROM orders WHERE user_id = $1 AND status = $2

// MySQL uses ? placeholders:
SELECT * FROM orders WHERE user_id = ? AND status = ?`;

const transactionExample = `// db.transaction wraps multiple statements in a single transaction.
// If any statement fails, the entire transaction is rolled back.
{
  "tool": "db.transaction",
  "connection": "primary",
  "statements": [
    "UPDATE accounts SET balance = balance - 100 WHERE id = 1",
    "UPDATE accounts SET balance = balance + 100 WHERE id = 2",
    "INSERT INTO transfers (from_id, to_id, amount) VALUES (1, 2, 100)"
  ]
}`;

const tools = [
  { name: "db.query", desc: "Execute a SQL SELECT or DML statement on a named connection. Returns rows as JSON." },
  { name: "db.schema", desc: "Return full schema information: tables, columns, types, nullable, defaults." },
  { name: "db.tables", desc: "List all table names in the connected database and schema." },
  { name: "db.indexes", desc: "List indexes for a given table — name, columns, uniqueness, type." },
  { name: "db.explain", desc: "Run EXPLAIN ANALYZE on a query and return the execution plan." },
  { name: "db.transaction", desc: "Execute an array of statements atomically. Rolls back on any failure." },
];

const errors = [
  {
    code: "ECONNREFUSED",
    cause: "Nothing is listening on the specified host:port.",
    fix: "Verify the hostname and port. Check that the database server is running and reachable (firewall, VPC security groups).",
  },
  {
    code: "authentication failed",
    cause: "Wrong username, password, or pg_hba.conf does not allow the connection.",
    fix: "Test with psql using the same credentials. Check pg_hba.conf for the auth method (md5 vs scram-sha-256 vs trust).",
  },
  {
    code: "SSL required",
    cause: "The server requires SSL but sslmode=disable was used.",
    fix: "Add ?sslmode=require to the connection string.",
  },
  {
    code: "too many clients",
    cause: "max_connections limit on the PostgreSQL server has been reached.",
    fix: "Reduce pool.max in config. Consider using PgBouncer as a connection pooler in front of PostgreSQL.",
  },
  {
    code: "relation does not exist",
    cause: "The table or view name is wrong, or the search_path schema is incorrect.",
    fix: "Qualify the table with schema: schema.table_name. Check db.tables to confirm what exists.",
  },
  {
    code: "permission denied for table",
    cause: "The database role lacks SELECT/INSERT/UPDATE/DELETE on the table.",
    fix: "Grant the appropriate privilege. For read-only use, follow the read-only user setup in this guide.",
  },
  {
    code: "SSL SYSCALL error: EOF detected",
    cause: "SSL handshake failed — mismatched TLS version or certificate issue.",
    fix: "Verify CA cert path. Try sslmode=require instead of verify-full to isolate certificate vs. connection issue.",
  },
];

const authMethods = [
  { method: "trust", desc: "No password required. Only for local Unix socket connections in dev." },
  { method: "md5", desc: "MD5-hashed password. Common in older PostgreSQL installs. Less secure than scram." },
  { method: "scram-sha-256", desc: "Default since PostgreSQL 14. Strong challenge-response auth. Use this." },
  { method: "peer", desc: "OS username must match database role. Local Unix socket only." },
  { method: "cert", desc: "Client certificate authentication. Requires ssl.cert and ssl.key in config." },
];

export default function DatabaseIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Database</h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to PostgreSQL, MySQL, or SQLite. Covers connection strings, SSL,
          pooling, read-only users, multiple named connections, and all available tools.
        </p>
      </div>

      <div className="space-y-14">

        {/* PostgreSQL connection string */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">PostgreSQL connection string</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">format</span>
              <CopyButton text={pgConnString} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{pgConnString}</code></pre>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">field breakdown</span>
              <CopyButton text={pgConnStringAnnotated} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{pgConnStringAnnotated}</code></pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Special characters in the password must be percent-encoded. For example{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">p@ss#word</code>{" "}
            becomes{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">p%40ss%23word</code>.
          </p>
        </section>

        {/* MySQL */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">MySQL connection string</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">format</span>
              <CopyButton text={mysqlConnString} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{mysqlConnString}</code></pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Default port is 3306. Append{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">?ssl=true</code>{" "}
            to enable SSL. MySQL uses{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">?</code>{" "}
            placeholders rather than{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">$1</code>.
          </p>
        </section>

        {/* SQLite */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">SQLite file path</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">format</span>
              <CopyButton text={sqliteConnString} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{sqliteConnString}</code></pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            SQLite does not support pooling, concurrent writes, or network connections. It is best
            suited for local development and read-heavy workloads.
          </p>
        </section>

        {/* SSL */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">SSL / TLS configuration</h2>
          <p className="mb-3 text-sm text-[#666]">
            PostgreSQL exposes SSL behavior through the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">sslmode</code>{" "}
            query parameter. Use{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">verify-full</code>{" "}
            for production to prevent MITM attacks.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">sslmode</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {pgSSLModes.map((s) => (
                  <tr key={s.mode}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{s.mode}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{s.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json — ssl certs</span>
              <CopyButton text={pgSSLCerts} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{pgSSLCerts}</code></pre>
          </div>
        </section>

        {/* Read-only user */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Read-only PostgreSQL user</h2>
          <p className="mb-3 text-sm text-[#666]">
            For analysis workflows where writes should never happen, create a dedicated read-only
            user. The{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">ALTER DEFAULT PRIVILEGES</code>{" "}
            line ensures SELECT is granted on tables created in the future.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">psql — read-only user setup</span>
              <CopyButton text={pgReadOnlyUser} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{pgReadOnlyUser}</code></pre>
          </div>
        </section>

        {/* Multiple connections */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Multiple connections</h2>
          <p className="mb-3 text-sm text-[#666]">
            Name each connection under the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">connections</code>{" "}
            key. When invoking tools, specify the connection by name using the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">connection</code>{" "}
            parameter. The first connection listed is used by default when no name is given.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json — multiple connections</span>
              <CopyButton text={conductorConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfig}</code></pre>
          </div>
        </section>

        {/* Connection pooling */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Connection pooling</h2>
          <p className="mb-3 text-sm text-[#666]">
            Conductor maintains a connection pool per named connection. Tune{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">pool.max</code>{" "}
            to stay within your database's{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">max_connections</code>{" "}
            limit. A conservative default is 5–10 for most hobby plans; 20–50 for dedicated
            servers. If you use PgBouncer or RDS Proxy, you can safely increase this.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json — pooling</span>
              <CopyButton text={poolingConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{poolingConfig}</code></pre>
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Available tools</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Tool</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {tools.map((t) => (
                  <tr key={t.name}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{t.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Parameterized queries */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Parameterized queries</h2>
          <p className="mb-3 text-sm text-[#666]">
            Always use parameterized queries when values come from user input or external data.
            Conductor passes parameters separately from the query string, preventing SQL injection.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">parameterized query syntax</span>
              <CopyButton text={paramQuery} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{paramQuery}</code></pre>
          </div>
        </section>

        {/* Transactions */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Transaction handling</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">db.transaction example</span>
              <CopyButton text={transactionExample} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{transactionExample}</code></pre>
          </div>
        </section>

        {/* Auth methods */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">PostgreSQL auth methods</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Method</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {authMethods.map((a) => (
                  <tr key={a.method}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{a.method}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{a.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Common errors */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Common errors</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Error</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Cause</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {errors.map((e) => (
                  <tr key={e.code}>
                    <td className="px-4 py-3 font-mono text-xs text-[#888] align-top">{e.code}</td>
                    <td className="px-4 py-3 text-xs text-[#555] align-top">{e.cause}</td>
                    <td className="px-4 py-3 text-xs text-[#444] align-top">{e.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <div className="mt-14 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/integrations"
          className="inline-flex items-center gap-2 text-sm text-[#555] transition-colors hover:text-white"
        >
          All integrations
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
