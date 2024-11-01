// background.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'FETCH_REPO_CONTENTS') {
        fetchGitHubContents(message.repoUrl, sendResponse);
        return true; // Indicates that the response will be sent asynchronously
    }
});
// Function to fetch the contents of a GitHub repository
function fetchGitHubContents(repoUrl, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(repoUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error fetching repository data: ${response.statusText}`);
            }
            // Parse and return the JSON response
            const data = yield response.json();
            sendResponse({ data });
        }
        catch (error) {
            console.error('Error fetching data:', error);
            // Ensure to include 'data' key in the error response to satisfy the GitHubResponse interface
            sendResponse({
                error: error instanceof Error ? error.message : 'Unknown error',
                data: [],
            });
        }
    });
}
