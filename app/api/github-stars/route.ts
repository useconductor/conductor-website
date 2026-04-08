import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GITHUB_REPOS = [
  'useconductor/conductor',
  'useconductor/conductor-website',
];

export async function GET() {
  try {
    const stars: Record<string, number> = {};
    
    await Promise.all(
      GITHUB_REPOS.map(async (repo) => {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: {
            'User-Agent': 'Conductor-Website',
          },
        });
        if (res.ok) {
          const data = await res.json();
          stars[repo] = data.stargazers_count || 0;
        }
      })
    );
    
    const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);
    
    return NextResponse.json({ total: totalStars, repos: stars });
  } catch {
    return NextResponse.json({ total: 0, error: 'Failed to fetch' });
  }
}