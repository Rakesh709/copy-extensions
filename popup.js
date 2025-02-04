document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('textInput');
    const addButton = document.getElementById('addButton');
    const textList = document.getElementById('textList');

    function loadTextItems() {
        chrome.storage.local.get({ texts: [] }, function (data) {
            textList.innerHTML = '';
            data.texts.forEach((text, index) => addTextItem(text, index));
        });
    }

    function addTextItem(text, index) {
        const li = document.createElement('li');
        li.className = 'text-item'; 
        
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn'; 
        copyButton.textContent = 'Copy';
        copyButton.onclick = function () {
            navigator.clipboard.writeText(text);
            copyButton.textContent = 'Copied';
            copyButton.classList.add('copied');
            setTimeout(() => {
                copyButton.textContent = 'Copy';
                copyButton.classList.remove('copied');
            }, 2000);
        };

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn'; 
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () {
            chrome.storage.local.get({ texts: [] }, function (data) {
                const newTexts = data.texts.filter((_, i) => i !== index);
                chrome.storage.local.set({ texts: newTexts }, loadTextItems);
            });
        };
        
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(removeButton);
        
        li.appendChild(textSpan);
        li.appendChild(buttonContainer);
        textList.appendChild(li);
    }

    addButton.onclick = function () {
        const text = textInput.value.trim();
        if (text) {
            chrome.storage.local.get({ texts: [] }, function (data) {
                const newTexts = [...data.texts, text];
                chrome.storage.local.set({ texts: newTexts }, loadTextItems);
            });
        }
        textInput.value = '';
    };
    
    loadTextItems();
});
