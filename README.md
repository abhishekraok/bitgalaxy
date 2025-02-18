# Bit Galaxy 

## About

A platform for playing and editing AI generated games.

## Installation

```bash
git clone https://github.com/abhishekrao/bitgalaxy.git
cd bitgalaxy
pip install -r requirements.txt
```

To set the Claude API key
Create a backend/.env file and add the line
`ANTHROPIC_API_KEY=<your api key>`

## Running the project

```bash
cd backend
uvicorn app.main:app --reload
```

```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
cd backend
pytest
```

```bash
cd frontend
npm test
```

Or just use the GitHub Actions workflow to run the tests.
