const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Запуск Python кода
app.post('/run-python', (req, res) => {
  const code = req.body.code;
  const pythonProcess = spawn('python', ['-c', code]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.send(output);
    } else {
      res.status(500).send(output);
    }
  });
});

// Запуск C++ кода
app.post('/run-cpp', (req, res) => {
  const code = req.body.code;
  const cppProcess = spawn('g++', ['-x', 'c++', '-o', 'temp.out', '-'], { stdio: 'pipe' });

  cppProcess.stdin.write(code);
  cppProcess.stdin.end();

  let output = '';
  let errorOccurred = false; 

  cppProcess.on('error', (error) => {
    console.error('Ошибка компиляции C++:', error); // Логируем ошибку
    errorOccurred = true;
    res.status(500).send(error.message);
  });

  cppProcess.on('close', (code) => {
    if (!errorOccurred) {
      if (code === 0) {
        const runProcess = spawn('./temp.out');

        runProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
          output += data.toString();
        });

        runProcess.on('close', () => {
          res.send(output);
        });
      } else {
        res.status(500).send('Ошибка компиляции C++');
      }
    }
  });
});

// Запуск C# кода 
app.post('/run-csharp', (req, res) => {
  const code = req.body.code;
  const csharpProcess = spawn('csc', ['-out:temp.exe', '-'], { stdio: 'pipe' });

  csharpProcess.stdin.write(code);
  csharpProcess.stdin.end();

  let output = '';
  let errorOccurred = false;

  csharpProcess.on('error', (error) => {
    console.error('Ошибка компиляции C#:', error); // Логируем ошибку
    errorOccurred = true;
    res.status(500).send(error.message);
  });

  csharpProcess.on('close', (code) => {
    if (!errorOccurred) {
      if (code === 0) {
        const runProcess = spawn('./temp.exe');

        runProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
          output += data.toString();
        });

        runProcess.on('close', () => {
          res.send(output);
        });
      } else {
        res.status(500).send('Ошибка компиляции C#');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});