// FILE: app/docs/integrations/docker/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const conductorConfig = `{
  "plugins": {
    "docker": {
      "socketPath": "/var/run/docker.sock"
    }
  }
}`;

const conductorConfigWindows = `{
  "plugins": {
    "docker": {
      "socketPath": "//./pipe/docker_engine"
    }
  }
}`;

const conductorConfigRemote = `{
  "plugins": {
    "docker": {
      "host": "tcp://192.168.1.100:2376",
      "tlsCertPath": "/path/to/certs"
    }
  }
}`;

const linuxPermissions = `# Option 1: Add your user to the docker group (persistent)
sudo usermod -aG docker $USER
# Log out and back in, or run:
newgrp docker

# Option 2: Change socket permissions (not recommended for production)
sudo chmod 666 /var/run/docker.sock

# Verify
docker ps`;

const remoteDockerHost = `# Set DOCKER_HOST for the current session
export DOCKER_HOST=tcp://192.168.1.100:2376

# With TLS (recommended for remote hosts)
export DOCKER_HOST=tcp://192.168.1.100:2376
export DOCKER_TLS_VERIFY=1
export DOCKER_CERT_PATH=~/.docker/certs/my-remote-host`;

const dockerContextSetup = `# Create a Docker context for a remote host
docker context create remote-server \\
  --docker "host=tcp://192.168.1.100:2376,ca=/path/to/ca.pem,cert=/path/to/cert.pem,key=/path/to/key.pem"

# Use the context
docker context use remote-server

# Conductor picks up the active Docker context automatically
# Or specify explicitly in config with the "context" field:
{
  "plugins": {
    "docker": {
      "context": "remote-server"
    }
  }
}`;

const conductorInDockerCmd = `# Run Conductor inside Docker, mounting the host Docker socket
docker run -d \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -v ~/.conductor:/root/.conductor \\
  -p 3000:3000 \\
  useconductor/conductor:latest

# The mounted socket lets Conductor control the host's Docker daemon.
# Note: this grants significant privilege — treat it like root access.`;

const tools = [
  { name: "docker.container.list", desc: "List all containers (running and stopped) with status, ports, and image." },
  { name: "docker.container.start", desc: "Start a stopped container by container ID or name." },
  { name: "docker.container.stop", desc: "Stop a running container. Sends SIGTERM then SIGKILL after timeout." },
  { name: "docker.container.remove", desc: "Remove a container. Pass force: true to remove running containers." },
  { name: "docker.container.logs", desc: "Stream or fetch recent logs from a container. Supports tail and since filters." },
  { name: "docker.container.exec", desc: "Execute a command inside a running container. Returns stdout and stderr." },
  { name: "docker.image.list", desc: "List all locally pulled images with ID, tags, and size." },
  { name: "docker.image.pull", desc: "Pull an image from a registry by name and optional tag." },
  { name: "docker.image.remove", desc: "Remove a local image by ID or name. Pass force: true to remove in-use images." },
  { name: "docker.image.build", desc: "Build an image from a Dockerfile path. Streams build output." },
  { name: "docker.volume.list", desc: "List all Docker volumes with name, driver, and mount point." },
  { name: "docker.network.list", desc: "List all Docker networks with name, driver, and attached containers." },
  { name: "docker.compose.up", desc: "Start services defined in a docker-compose.yml file. Equivalent to docker compose up -d." },
  { name: "docker.compose.down", desc: "Stop and remove services from a Compose project. Optionally remove volumes." },
  { name: "docker.compose.ps", desc: "List status of services in a Compose project." },
];

const errors = [
  {
    code: "Cannot connect to Docker daemon",
    cause: "Docker Desktop is not running, or the socket path is wrong.",
    fix: "Start Docker Desktop (Mac/Windows) or start the Docker service (Linux: sudo systemctl start docker). Verify the socket path in config.",
  },
  {
    code: "permission denied on /var/run/docker.sock",
    cause: "Your user does not have permission to access the Docker socket on Linux.",
    fix: "Add your user to the docker group: sudo usermod -aG docker $USER. Log out and back in.",
  },
  {
    code: "container already started",
    cause: "Tried to start a container that is already running.",
    fix: "Check container state with docker.container.list before calling start.",
  },
  {
    code: "no such image",
    cause: "The image name or tag does not exist locally.",
    fix: "Pull the image first with docker.image.pull, or verify the exact name:tag.",
  },
  {
    code: "port already allocated",
    cause: "Another container or process is already using the host port.",
    fix: "Stop the conflicting container or change the host port mapping.",
  },
  {
    code: "network not found",
    cause: "The specified Docker network does not exist.",
    fix: "List networks with docker.network.list to find the correct name. Create the network if needed.",
  },
  {
    code: "No such container",
    cause: "Container ID or name does not exist.",
    fix: "Use docker.container.list to verify the container exists. IDs can be partial (first 12 chars).",
  },
];

const socketPaths = [
  { platform: "macOS (Docker Desktop)", path: "/var/run/docker.sock" },
  { platform: "Linux (Docker Engine)", path: "/var/run/docker.sock" },
  { platform: "Windows (Docker Desktop)", path: "//./pipe/docker_engine" },
  { platform: "Remote host (TCP)", path: "tcp://host:2376" },
  { platform: "Rootless Docker (Linux)", path: "/run/user/1000/docker.sock" },
];

export default function DockerIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Docker</h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to Docker for container, image, volume, network, and Compose management.
          Covers Docker Desktop, Linux socket permissions, remote hosts, TLS, and all available tools.
        </p>
      </div>

      <div className="space-y-14">

        {/* Docker Desktop vs Engine */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Docker Desktop vs Docker Engine</h2>
          <div className="space-y-3 text-sm text-[#666]">
            <p>
              <span className="font-mono text-[#999]">Docker Desktop</span> (Mac and Windows) — bundles
              the Docker Engine inside a Linux VM. The socket is exposed at{" "}
              <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">/var/run/docker.sock</code>{" "}
              on Mac and{" "}
              <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">npipe:////./pipe/docker_engine</code>{" "}
              on Windows. Must be started manually via the GUI or{" "}
              <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">open /Applications/Docker.app</code>.
            </p>
            <p>
              <span className="font-mono text-[#999]">Docker Engine</span> (Linux) — runs as a system
              daemon. Socket is at{" "}
              <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">/var/run/docker.sock</code>{" "}
              and is owned by root/docker group. Starts on boot with systemd.
            </p>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Platform</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Socket path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {socketPaths.map((s) => (
                  <tr key={s.platform}>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{s.platform}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{s.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Linux permissions */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Linux socket permissions</h2>
          <p className="mb-3 text-sm text-[#666]">
            On Linux, the Docker socket is owned by root and the docker group. By default, only root
            can access it. Add your user to the docker group to use Docker without sudo.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">linux — grant socket access</span>
              <CopyButton text={linuxPermissions} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{linuxPermissions}</code></pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Members of the docker group have root-equivalent access to the Docker daemon. Only add
            trusted users to this group.
          </p>
        </section>

        {/* Remote Docker host */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Remote Docker host</h2>
          <p className="mb-3 text-sm text-[#666]">
            Conductor can connect to a Docker daemon on a remote machine over TCP. Always use TLS
            when exposing Docker over TCP on a network — an unauthenticated Docker TCP port gives
            full root access to the host machine.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">DOCKER_HOST environment variable</span>
              <CopyButton text={remoteDockerHost} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{remoteDockerHost}</code></pre>
          </div>
        </section>

        {/* Docker context */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Docker context</h2>
          <p className="mb-3 text-sm text-[#666]">
            Docker contexts let you save and switch between multiple Docker endpoints. Conductor
            respects the active Docker context, or you can pin a specific context in the config.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">docker context setup</span>
              <CopyButton text={dockerContextSetup} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{dockerContextSetup}</code></pre>
          </div>
        </section>

        {/* Conductor config */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
          <div className="space-y-3">
            <div>
              <p className="mb-2 font-mono text-xs text-[#444]">macOS / Linux</p>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json</span>
                  <CopyButton text={conductorConfig} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfig}</code></pre>
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-[#444]">Windows</p>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json — windows</span>
                  <CopyButton text={conductorConfigWindows} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfigWindows}</code></pre>
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-[#444]">Remote host (TCP + TLS)</p>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json — remote</span>
                  <CopyButton text={conductorConfigRemote} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfigRemote}</code></pre>
              </div>
            </div>
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

        {/* Running Conductor in Docker */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Running Conductor inside Docker</h2>
          <p className="mb-3 text-sm text-[#666]">
            You can run Conductor itself as a Docker container. Mount the host Docker socket into
            the container so Conductor can manage the host's Docker daemon. This is sometimes called
            "Docker-in-Docker" but is actually Docker-outside-Docker — the container uses the host daemon.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">docker run — socket mount</span>
              <CopyButton text={conductorInDockerCmd} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorInDockerCmd}</code></pre>
          </div>
        </section>

        {/* Resource constraints */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Resource constraints</h2>
          <p className="mb-3 text-sm text-[#666]">
            The{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">docker.container.exec</code>{" "}
            tool runs commands inside existing containers and inherits that container's resource
            limits. The{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">docker.image.build</code>{" "}
            tool streams build output and may take significant time for large images. Conductor does
            not impose additional CPU or memory limits — those are set in Docker Desktop settings
            (Mac/Windows) or via cgroup limits on Linux. Set{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">--memory</code>{" "}
            and{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">--cpus</code>{" "}
            flags when creating containers if you need hard limits.
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
