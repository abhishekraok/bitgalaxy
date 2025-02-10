# Bit Galaxy 

[![Test](https://github.com/abhishekrao/bitgalaxy/actions/workflows/test.yml/badge.svg)](https://github.com/abhishekrao/bitgalaxy/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/abhishekrao/bitgalaxy/branch/main/graph/badge.svg)](https://codecov.io/gh/abhishekrao/bitgalaxy) 


# About

A platform for playing and editing AI generated games.

# Installation

```bash
git clone https://github.com/abhishekrao/bitgalaxy.git
cd bitgalaxy
pip install -r requirements.txt
```

Edit the `.env` file with your own values.

# Running the project

```bash
cd backend
uvicorn app.main:app --reload
```

```bash
cd frontend
npm install
npm run dev
```

# Testing

```bash
cd backend
pytest
```

```bash
cd frontend
npm test
```

Or just use the GitHub Actions workflow to run the tests.