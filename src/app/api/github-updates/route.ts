import { NextRequest, NextResponse } from 'next/server';

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
}

interface GitHubRepo {
  name: string;
  description: string;
  updated_at: string;
  stargazers_count: number;
  html_url: string;
}

// Default repository info - in a real app, this would be configurable
const DEFAULT_REPO = {
  owner: 'your-org',
  repo: 'your-repo',
  // You can make this configurable via environment variables
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner') || process.env.GITHUB_REPO_OWNER || DEFAULT_REPO.owner;
    const repo = searchParams.get('repo') || process.env.GITHUB_REPO_NAME || DEFAULT_REPO.repo;
    
    if (!owner || !repo) {
      return NextResponse.json({ error: 'Repository owner and name are required' }, { status: 400 });
    }

    // Check if GitHub token is available
    const githubToken = process.env.GITHUB_TOKEN;
    
    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: githubToken ? {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      } : {}
    });

    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repository info: ${repoResponse.status}`);
    }

    const repoData: GitHubRepo = await repoResponse.json();

    // Fetch recent commits
    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
      headers: githubToken ? {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      } : {}
    });

    if (!commitsResponse.ok) {
      throw new Error(`Failed to fetch commits: ${commitsResponse.status}`);
    }

    const commitsData: GitHubCommit[] = await commitsResponse.json();

    // Fetch releases
    const releasesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=3`, {
      headers: githubToken ? {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      } : {}
    });

    const releasesData = releasesResponse.ok ? await releasesResponse.json() : [];

    return NextResponse.json({
      repository: {
        name: repoData.name,
        description: repoData.description,
        updated_at: repoData.updated_at,
        stargazers_count: repoData.stargazers_count,
        html_url: repoData.html_url,
        last_updated: new Date(repoData.updated_at).toISOString(),
        days_since_update: Math.floor((Date.now() - new Date(repoData.updated_at).getTime()) / (1000 * 60 * 60 * 24))
      },
      recent_commits: commitsData.map(commit => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: `${repoData.html_url}/commit/${commit.sha}`
      })),
      recent_releases: releasesData.map((release: any) => ({
        name: release.name,
        tag_name: release.tag_name,
        published_at: release.published_at,
        body: release.body,
        url: release.html_url
      })),
      checked_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking GitHub updates:', error);
    return NextResponse.json({ 
      error: 'Failed to check GitHub updates',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}