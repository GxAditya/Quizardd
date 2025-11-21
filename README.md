# Quizardd

A modern quiz/test generator application that uses Pollinations.AI to create educational questions on any subject.

## Features

- Generate up to 10 questions on any subject or combination of subjects
- Support for mixed-subject tests (e.g., "Math, Science, and History")
- Customizable number of questions
- Multiple-choice format with explanations
- Modern, responsive UI with beautiful animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- shadcn-ui components
- TailwindCSS for styling
- React Router for navigation
- React Query for data fetching

### Backend
- Node.js with Express
- Pollinations.AI for text generation and question creation
- TypeScript for type safety

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Pollinations.AI usage does not require a key for low-volume testing; register at auth.pollinations.ai for higher limits and bearer tokens

### Installation

1. Clone the repository
```bash
git clone https://github.com/GxAditya/GenTest.git
cd GenTest
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

4. Set up environment variables (optional)
   - For anonymous testing you do not need tokens — Pollinations will accept referrer-based requests.
   - To use a Bearer token for higher rate limits sign up at `auth.pollinations.ai` and add it to backend `.env` as `POLLINATIONS_TOKEN`.

Root `.env` file (optional):
```
// No token required for anonymous requests
```

Backend `.env` file (optional):
```
PORT=3000
POLLINATIONS_TOKEN=your_token_here
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend application
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a subject or multiple subjects separated by commas or "and" (e.g., "Math, Science, and History")
2. Use the slider to select the number of questions (1-10)
3. Click "Generate Test" to create your quiz
4. Review the generated questions and use them for your educational needs

## Project Structure

- `/src` - Frontend React application
- `/backend` - Express backend server
- `/public` - Static assets

## License

MIT

## Acknowledgements

- Pollinations.AI for powering the question generation
- shadcn/ui for the beautiful component library
- The open-source community for all the amazing tools that made this project possible
