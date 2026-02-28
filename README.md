\# Product Discovery with AI Assist



A mini product discovery app with a backend API, React frontend, and Groq LLM integration for natural language product search.



\## Tech Stack

\- \*\*Backend:\*\* Node.js + Express

\- \*\*Frontend:\*\* React + Vite

\- \*\*LLM:\*\* Groq (llama3)



\## Getting Started



\### Prerequisites

\- Node.js installed

\- Groq API key from https://console.groq.com



\### 1. Clone the repo

git clone https://github.com/venkatasailakshmibonnada/product-discovery.git

cd product-discovery



\### 2. Backend Setup

cd backend

npm install



Create a `.env` file in the `backend` folder:

GROQ\_API\_KEY=your\_groq\_api\_key\_here



Start the backend:

node server.js



Backend runs on http://localhost:5000



\### 3. Frontend Setup

Open a new terminal:

cd frontend

npm install

npm run dev



Frontend runs on http://localhost:5173



\## API Endpoints



GET  /api/products  - List all products (supports ?category= filter)

POST /api/ask       - Natural language query → LLM → matched products



\### POST /api/ask Example

Request:

{ "query": "Budget laptops under $500" }



Response:

{ "productIds": \[1], "summary": "We found a budget laptop...", "products": \[...] }



\## AI Flow

1\. User types a natural language query in the frontend

2\. Frontend sends POST /api/ask to backend

3\. Backend builds a prompt with the query + product catalog context

4\. Groq LLM returns matching product IDs + a short summary

5\. Backend parses the response and returns structured JSON

6\. Frontend displays matched products and AI summary



\## Project Structure

product-discovery/

├── backend/

│   ├── server.js        # Express server + API routes

│   ├── products.json    # Mock product catalog

│   ├── .env             # API keys (not committed)

│   └── package.json

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   ├── ProductCard.jsx

│   │   │   ├── ProductList.jsx

│   │   │   └── AskBox.jsx

│   │   └── App.jsx

│   └── package.json

└── .gitignore



\## Error Handling

\- LLM failures return 502 with a safe error message

\- API key loaded from environment variables (never hardcoded)



\## Time Spent

~3 hours

