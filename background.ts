// background.ts

// Define types for message structure and GitHub content response
interface FetchRepoContentsMessage {
  type: 'FETCH_REPO_CONTENTS';
  repoUrl: string;
}

interface GitHubContent {
  name: string;
  type: 'file' | 'dir';
  path: string;
}

interface GitHubResponse {
  data: GitHubContent[];
  error?: string;
}

chrome.runtime.onMessage.addListener(
  (message: FetchRepoContentsMessage, sender, sendResponse) => {
    if (message.type === 'FETCH_REPO_CONTENTS') {
      fetchGitHubContents(message.repoUrl, sendResponse);
      return true; // Indicates that the response will be sent asynchronously
    }
  }
);

// Function to fetch the contents of a GitHub repository
async function fetchGitHubContents(
  repoUrl: string,
  sendResponse: (response: GitHubResponse) => void
) {
  try {
    const response = await fetch(repoUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching repository data: ${response.statusText}`);
    }

    // Parse and return the JSON response
    const data = await response.json();
    sendResponse({ data });
  } catch (error) {
    console.error('Error fetching data:', error);

    // Ensure to include 'data' key in the error response to satisfy the GitHubResponse interface
    sendResponse({
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    });
  }
}
