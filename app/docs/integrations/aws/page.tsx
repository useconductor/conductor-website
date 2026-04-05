// FILE: app/docs/integrations/aws/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const configExample = `{
  "plugins": {
    "aws": {
      "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
      "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      "region": "us-east-1",
      "profile": "default"
    }
  }
}`;

const iamPolicyS3 = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListAllMyBuckets",
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::*",
        "arn:aws:s3:::*/*"
      ]
    }
  ]
}`;

const iamPolicyEC2 = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstanceStatus",
        "ec2:DescribeRegions"
      ],
      "Resource": "*"
    }
  ]
}`;

const iamPolicyLambda = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:ListFunctions",
        "lambda:GetFunction",
        "lambda:InvokeFunction",
        "logs:FilterLogEvents",
        "logs:DescribeLogGroups"
      ],
      "Resource": "*"
    }
  ]
}`;

const iamPolicyRDS = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:DescribeDBClusters",
        "rds-data:ExecuteStatement",
        "rds-data:BatchExecuteStatement"
      ],
      "Resource": "*"
    }
  ]
}`;

const iamPolicyCloudWatch = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics",
        "logs:GetLogEvents",
        "logs:FilterLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      "Resource": "*"
    }
  ]
}`;

const createKeyCmd = `# In AWS CLI after creating an IAM user
aws iam create-access-key --user-name conductor-bot`;

const profileConfig = `# ~/.aws/credentials
[conductor]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# ~/.aws/config
[profile conductor]
region = us-east-1
output = json`;

const envVarsConfig = `# Environment variables (alternative to config file)
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
export AWS_DEFAULT_REGION=us-east-1`;

const errors = [
  {
    code: "NoCredentialsError",
    cause: "No credentials found anywhere in the credential chain.",
    fix: "Set accessKeyId/secretAccessKey in config, or configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.",
  },
  {
    code: "InvalidClientTokenId",
    cause: "The access key ID does not exist or is not active.",
    fix: "Verify the key in IAM → Users → Security credentials. Ensure the key is active, not deleted.",
  },
  {
    code: "AccessDenied",
    cause: "Credentials are valid but the IAM user lacks permission for the action.",
    fix: "Attach the required inline or managed policy to the IAM user or role. Check the specific action in the error message.",
  },
  {
    code: "Region mismatch",
    cause: "The configured region does not match where the resource exists.",
    fix: "Set the correct region in config or use AWS_DEFAULT_REGION. S3 buckets require the region where they were created.",
  },
  {
    code: "EndpointResolutionError",
    cause: "Service endpoint could not be resolved — often a typo in region or unsupported region for a service.",
    fix: "Check that the region string is valid (e.g., us-east-1, not us-east1). Verify the service is available in that region.",
  },
  {
    code: "RequestExpired",
    cause: "System clock is too far out of sync with AWS servers.",
    fix: "Sync your system clock. On Linux: sudo ntpdate -u pool.ntp.org. On macOS: system time sync settings.",
  },
];

const tools = [
  { name: "s3.list", desc: "List all S3 buckets or objects within a bucket." },
  { name: "s3.get", desc: "Download the contents of an S3 object." },
  { name: "s3.put", desc: "Upload content to an S3 object at a given key." },
  { name: "s3.delete", desc: "Delete an S3 object by bucket and key." },
  { name: "ec2.list", desc: "List EC2 instances with status and metadata." },
  { name: "ec2.start", desc: "Start a stopped EC2 instance by instance ID." },
  { name: "ec2.stop", desc: "Stop a running EC2 instance by instance ID." },
  { name: "ec2.describe", desc: "Get full details for a specific EC2 instance." },
  { name: "lambda.list", desc: "List all Lambda functions in the configured region." },
  { name: "lambda.invoke", desc: "Invoke a Lambda function synchronously or asynchronously." },
  { name: "lambda.get", desc: "Get configuration and metadata for a Lambda function." },
  { name: "lambda.get-logs", desc: "Fetch recent CloudWatch log events for a Lambda function." },
  { name: "rds.list", desc: "List all RDS instances and Aurora clusters." },
  { name: "rds.query", desc: "Execute a SQL query via RDS Data API (Aurora Serverless v2)." },
  { name: "cloudwatch.get-metrics", desc: "Retrieve CloudWatch metric statistics for a namespace/metric." },
  { name: "cloudwatch.logs", desc: "Fetch and filter CloudWatch log events from a log group." },
];

export default function AWSIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">AWS</h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to AWS for S3, EC2, Lambda, RDS, and CloudWatch access. Covers IAM
          setup, credential configuration, required policies, and all available tools.
        </p>
      </div>

      <div className="space-y-14">

        {/* IAM Users vs Roles */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">IAM users vs roles</h2>
          <div className="space-y-3 text-sm text-[#666]">
            <p>
              <span className="font-mono text-[#999]">IAM Users</span> — have long-lived access keys
              (access key ID + secret). Use these when running Conductor on your local machine or
              any environment where you cannot attach an IAM role directly.
            </p>
            <p>
              <span className="font-mono text-[#999]">IAM Roles</span> — provide temporary
              credentials via the instance metadata service. Use these when Conductor runs on an EC2
              instance, ECS task, or Lambda function. Roles are strongly preferred: no keys to rotate,
              no secrets to store.
            </p>
            <p>
              Never use root account credentials. Create a dedicated IAM user named{" "}
              <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor-bot</code>{" "}
              with only the permissions it needs.
            </p>
          </div>
        </section>

        {/* Creating Access Keys */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Creating access keys</h2>
          <ol className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-3"><span className="font-mono text-[#444]">1.</span>Go to <span className="font-mono text-[#888]">IAM → Users → conductor-bot → Security credentials</span></li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">2.</span>Click <span className="font-mono text-[#888]">Create access key</span> — choose "Application running outside AWS"</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">3.</span>Copy the access key ID and secret — the secret is only shown once</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">4.</span>Store the secret in a password manager or secrets manager immediately</li>
          </ol>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">aws cli — create key</span>
              <CopyButton text={createKeyCmd} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{createKeyCmd}</code></pre>
          </div>
        </section>

        {/* AWS CLI Profiles */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">AWS CLI profiles</h2>
          <p className="mb-3 text-sm text-[#666]">
            Credentials and region config live in{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.aws/credentials</code>{" "}
            and{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.aws/config</code>.
            You can name a profile and reference it in the Conductor config with the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">profile</code> field.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.aws/credentials and ~/.aws/config</span>
              <CopyButton text={profileConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{profileConfig}</code></pre>
          </div>
        </section>

        {/* Env vars */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Environment variables</h2>
          <p className="mb-3 text-sm text-[#666]">
            Environment variables take precedence over the config file. Useful in CI/CD or
            containerized environments where you cannot write files. Set{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">AWS_ACCESS_KEY_ID</code>,{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">AWS_SECRET_ACCESS_KEY</code>,
            and <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">AWS_DEFAULT_REGION</code>.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">shell environment</span>
              <CopyButton text={envVarsConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{envVarsConfig}</code></pre>
          </div>
        </section>

        {/* Conductor config */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
          <p className="mb-3 text-sm text-[#666]">
            Add the AWS plugin block to your Conductor config. If you use a named AWS profile, set
            the <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">profile</code> field
            and omit <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">accessKeyId</code>/{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">secretAccessKey</code>.
            When running on EC2 or ECS with an attached role, all credential fields can be omitted entirely.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json</span>
              <CopyButton text={configExample} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{configExample}</code></pre>
          </div>
        </section>

        {/* IAM Policies */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Required IAM policies</h2>
          <p className="mb-3 text-sm text-[#666]">
            Create an inline or managed policy for each service your use case requires. Attach all
            needed policies to the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor-bot</code>{" "}
            IAM user or role.
          </p>
          <div className="space-y-4">
            {[
              { label: "S3 policy", code: iamPolicyS3 },
              { label: "EC2 policy", code: iamPolicyEC2 },
              { label: "Lambda + CloudWatch Logs policy", code: iamPolicyLambda },
              { label: "RDS Data API policy", code: iamPolicyRDS },
              { label: "CloudWatch Metrics + Logs policy", code: iamPolicyCloudWatch },
            ].map(({ label, code }) => (
              <div key={label} className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">{label}</span>
                  <CopyButton text={code} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{code}</code></pre>
              </div>
            ))}
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

        {/* Rate limits */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits and retries</h2>
          <p className="mb-3 text-sm text-[#666]">
            AWS API limits vary by service and account tier. Conductor automatically retries
            throttled requests with exponential backoff on{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">ThrottlingException</code>{" "}
            and{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">RequestLimitExceeded</code>.
            Notable limits: S3 GET/PUT — 5,500/3,500 requests/second per prefix; Lambda — 10 concurrent
            invocations by default (soft limit, can be raised); EC2 Describe — 100 requests/second.
            For high-frequency workloads, request a limit increase via the Service Quotas console.
          </p>
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

        {/* Security */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Security best practices</h2>
          <ul className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Never use root account access keys. Root keys cannot be scoped to specific actions.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>When Conductor runs on EC2, attach an IAM role to the instance. Use instance metadata credentials rather than long-lived keys.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>When Conductor runs inside a Lambda function, the function execution role provides credentials automatically.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Rotate access keys every 90 days. Use IAM Access Analyzer to audit permissions.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Enable CloudTrail to log all API calls made by Conductor credentials.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Scope IAM policies to specific resources (bucket ARNs, function ARNs) wherever possible instead of using wildcards.</li>
          </ul>
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
