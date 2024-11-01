var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    const folderView = document.getElementById('folder-view');
    try {
        const response = yield new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: 'FETCH_REPO_CONTENTS',
                repoUrl: 'https://api.github.com/repos/owner/repo/contents/path',
            }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message)); // Use lastError.message to get the string message
                }
                else {
                    resolve(response);
                }
            });
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
                listItem.textContent = `${item.type === 'dir' ? '📁' : '📄'} ${item.name}`;
                folderView.appendChild(listItem);
            });
        }
    }
    catch (error) {
        folderView.textContent = 'Error fetching folder contents.';
        console.error('Error:', error);
    }
}));
