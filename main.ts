// Define interfaces for expected data structures
interface GitHubContent {
  name: string;
  type: 'file' | 'dir';
  path: string;
}
interface GitHubResponse {
  data: GitHubContent[];
  error?: string;
}
document.addEventListener('DOMContentLoaded', async () => {
  const folderView = document.getElementById('folder-view')!;
  try {
    const response = await new Promise<GitHubResponse>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: 'FETCH_REPO_CONTENTS',
          repoUrl: 'https://api.github.com/repos/owner/repo/contents/path',
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message)); // Use lastError.message to get the string message
          } else {
            resolve(response as GitHubResponse);
          }
        }
      );
    });
    if (response.error) {
      folderView.textContent = 'Failed to load folder contents.';
      console.error('Error fetching data:', response.error);
      return;
    }
    // Successfully received data; render it in the UI
    if (response.data) {
      folderView.innerHTML = ''; // Clear any existing content
      response.data.forEach((item) => {
        const listItem = document.createElement('div');
        listItem.textContent = `${item.type === 'dir' ? '📁' : '📄'} ${
          item.name
        }`;
        folderView.appendChild(listItem);
      });
    }
  } catch (error) {
    folderView.textContent = 'Error fetching folder contents.';
    console.error('Error:', error);
  }
});
