document.addEventListener('DOMContentLoaded', () => {
    function getCardIdFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('id');
    }

    function loadCard(cardId) {
      const allCards = JSON.parse(localStorage.getItem('allCards')) || [];
      const cardStructure = allCards[cardId];

      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardStructure;
      let selectedName = tempDiv.querySelector('#selectedName').textContent;
      let selectedLanguage = tempDiv.querySelector('#selectedLanguage').textContent;

      let main = document.querySelector('.main');
      let title = `<div class="title">
      <p class="name">${selectedName}</p>
      <p class="language">${selectedLanguage}</p>
      </div>

      <div class="editor">
      <textarea class="code-editor"></textarea>
      <button id="runCode">Run Code</button>
      <div class="console-output"></div>
      </div>`;
      main.innerHTML = title;

      // Инициализация CodeMirror
      let mode;
      switch (selectedLanguage) {
        case 'JavaScript':
          mode = 'javascript';
          break;
        case 'Python':
          mode = 'python';
          break;
        case 'C++':
          mode = 'text/x-c++src';
          break;
        case 'C#':
          mode = 'text/x-csharp';
          break;
      }
      let editor = CodeMirror.fromTextArea(document.querySelector('.code-editor'), {
        lineNumbers: true,
        mode: mode,
        theme: 'material-darker',
      });

      // Установка высоты редактора
      editor.setSize(null, '400px'); // Установите нужную высоту

      // Загрузка кода из localStorage
      let savedCode = localStorage.getItem(`code-${cardId}`);
      if (savedCode) {
        editor.setValue(savedCode);
      }

      // Перехват console.log
      function overrideConsole(consoleOutput) {
        console.oldLog = console.log;
        console.log = function (message) {
          if (typeof message === 'object') {
            consoleOutput.innerHTML +=
              (JSON && JSON.stringify
                ? JSON.stringify(message)
                : message) + '<br />';
          } else {
            consoleOutput.innerHTML += message + '<br />';
          }
        };
      }

      async function runCode(language, code) {
        let apiUrl;

        switch (language) {
          case 'JavaScript':
            try {
              return { output: eval(code) };
            } catch (error) {
              return { error: error.toString() };
            }
          case 'Python':
            apiUrl = 'http://localhost:3000/run-python'; // Адрес вашего сервера
            break;
          case 'C++':
            apiUrl = 'http://localhost:3000/run-cpp'; // Адрес вашего сервера
            break;
          case 'C#':
            apiUrl = 'http://localhost:3000/run-csharp'; // Адрес вашего сервера
            break;
          default:
            return { error: 'Unsupported language' };
        }

        try {
          let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          let result = await response.text();
          return { output: result };
        } catch (error) {
          return { error: error.toString() };
        }
      }

      document.getElementById('runCode').addEventListener('click', async () => {
        let code = editor.getValue();
        let consoleOutput = document.querySelector('.console-output');
        consoleOutput.innerHTML = '';
        if (selectedLanguage == 'JavaScript') {
          overrideConsole(consoleOutput);
        }
        let result = await runCode(selectedLanguage, code);

        if (result.output) {
          consoleOutput.innerHTML = result.output.replace(/\n/g, '<br>');
        } else if (result.error) {
          consoleOutput.innerHTML = `<span style="color: red;">${result.error}</span>`;
        }
      });

      // Сохранение кода в localStorage при изменении
      editor.on('change', function (editor, change) {
        localStorage.setItem(`code-${cardId}`, editor.getValue());
      });

      // Сохранение кода в localStorage при загрузке
      localStorage.setItem(`code-${cardId}`, editor.getValue());
    }

    const cardId = getCardIdFromUrl();
    loadCard(cardId);
  });