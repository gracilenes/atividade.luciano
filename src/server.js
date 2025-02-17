const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const usersFilePath = path.join(__dirname, '/database/users.json');

// Função para ler os dados do arquivo JSON
const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
};

// Função para escrever os dados no arquivo JSON
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

// Criar o servidor HTTP
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(parsedUrl);
  

  // Definir cabeçalho de resposta
  res.setHeader('Content-Type', 'application/json');

  // Roteamento das requisições
  if (parsedUrl.pathname === '/api/users' && req.method === 'GET') {
    // Rota GET: Listar usuários
    const users = readUsersFromFile();
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } else if (parsedUrl.pathname === '/api/users' && req.method === 'POST') {
    // Rota POST: Adicionar usuário
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const userData = JSON.parse(body);

        // Validação dos dados de entrada
        if (!userData.name || !userData.email) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Nome e email são obrigatórios' }));
          return;
        }

        const users = readUsersFromFile();
        const newUser = {
          id: Date.now(), // Usando timestamp como ID único
          name: userData.name,
          email: userData.email
        };

        users.push(newUser);
        writeUsersToFile(users);

        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'Usuário adicionado com sucesso', user: newUser }));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Dados inválidos' }));
      }
    });
  } else if (parsedUrl.pathname.startsWith('/api/users/') && req.method === 'PUT') {
    const userId = parsedUrl.pathname.split('/')[3];
    let body = '';
  
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
        try {
          const updatedData = JSON.parse(body);
    
          if (!updatedData.name && !updatedData.email) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Nome ou email são obrigatórios para atualizar' }));
            return;
          }
    
          const users = readUsersFromFile();
          const userIndex = users.findIndex(user => user.id === parseInt(userId));
    
          if (userIndex === -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Usuário não encontrado' }));
            return;
          }
    
          users[userIndex] = { ...users[userIndex], ...updatedData };
          writeUsersToFile(users);
    
          res.statusCode = 200;
          res.end(JSON.stringify({ message: 'Usuário atualizado com sucesso', user: users[userIndex] }));
        } catch (error) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Dados inválidos' }));
        }
    }); 
  } else if (parsedUrl.pathname.startsWith('/api/users/') && req.method === 'DELETE') {
    const userId = parsedUrl.pathname.split('/')[3];
  
    const users = readUsersFromFile();
    const userIndex = users.findIndex(user => user.id === parseInt(userId));
  
    if (userIndex === -1) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Usuário não encontrado' }));
      return;
    }
  
    users.splice(userIndex, 1);
    writeUsersToFile(users);
  
    res.statusCode = 204;
    res.end();
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

// Iniciar o servidor na porta 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});