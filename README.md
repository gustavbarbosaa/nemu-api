# Teste Desenvolvedor Full Stack Nemu - API

API desenvolvida para leitura de dados de uma planilha do Google Sheets.  
Conecta diretamente à base de dados online utilizando uma Service Account com permissões de leitura.

---

## 🚧 Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- Google Sheets API

---

## 📁 Estrutura do Projeto

O projeto é simples, mas organizado por responsabilidades, respeitando princípios como o da responsabilidade única (SRP - Single Responsibility Principle).

```bash
├── src
│   ├── controllers
│   │   └── journey.controller.ts
│   ├── models
│   │   └── touchpoint.ts
│   └── services
│       ├── processData.service.ts
│       ├── sheets.service.ts
│       └── index.ts
├── .env
├── .env.sample
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── teste-nemu-5b2a622c5938.json
```

## 🚀 Como executar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/gustavbarbosaa/nemu-api.git
cd nemu-api
```
### 2. Criar o arquivo .env
```bash
KEY=teste-nemu-5b2a622c5938.json
SPREADSHEET_ID=ID_da_sua_planilha
RANGE=nome_da_aba
PORT=3000
```
#### 🧠 A chave KEY deve apontar para o caminho do arquivo .json da Service Account
#### 📤 Compartilhe a planilha com o e-mail da Service Account com permissão de leitura

### 3. Adicionar chave de autenticação
```bash
Coloque o arquivo .json da Service Account na raiz do projeto com o nome definido na variável KEY.
```
### 4. 🚀 Instalar dependências
```bash
npm install
```

### 5. 🚀 Iniciar o servidor em modo desenvolvimento
```bash
npm run start
```

##### O servidor será iniciado em http://localhost:3000

### 6. Testar o endpoint
```bash
- GET /journeys — retorna os dados agrupados por sessionId.
```
