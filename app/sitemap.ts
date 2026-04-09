import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://conductor.sh';
  
  const staticPages = [
    '',
    '/login',
    '/dashboard',
    '/docs',
    '/docs/quickstart',
    '/docs/install',
    '/docs/cli',
    '/docs/security',
    '/docs/webhooks',
    '/docs/mcp-server',
    '/docs/plugins',
    '/docs/cloud',
    '/docs/faq',
    '/marketplace',
    '/install',
    '/privacy',
    '/terms',
  ];

  const docsIntegrations = [
    'chatgpt', 'claude-code', 'claude-desktop', 'cursor', 'cline',
    'windsurf', 'continue', 'aider', 'siri', 'alexa',
    'google-assistant', 'copilot', 'copilot-web', 'perplexity',
    'notebooklm', 'mobile-ai', 'slack', 'discord', 'github',
    'notion', 'linear', 'jira', 'stripe', 'vercel', 'gmail',
    'database', 'docker', 'aws', 'google',
  ];

  const docsPlugins = [
    'file-system', 'shell', 'git', 'web-fetch', 'database',
    'calculator', 'notes', 'weather', 'keychain', 'webhooks',
    'cron', 'github', 'slack', 'gmail', 'aws', 'gcp',
  ];

  const pages = [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...docsIntegrations.map((name) => ({
      url: `${baseUrl}/docs/integrations/${name}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...docsPlugins.map((name) => ({
      url: `${baseUrl}/docs/plugins/${name}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return pages;
}