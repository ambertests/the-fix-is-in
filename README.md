# fixture-demo

Demo project for a talk on Playwright fixtures. This is a Node.js project using TypeScript and Playwright for end-to-end testing.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in UI mode:

```bash
npm run test:ui
```

Run tests in headed mode (see browser):

```bash
npm run test:headed
```

Run tests in debug mode:

```bash
npm run test:debug
```

### View Test Report

After running tests, view the HTML report:

```bash
npm run report
```

## Project Structure

```
fixture-demo/
├── tests/                # Test files
│   └── example.spec.ts   # Example test
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Node.js project configuration
```

## Technology Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Typed superset of JavaScript
- **Playwright** - End-to-end testing framework
- **ESM** - ES Module system

## Learn More

- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Playwright Documentation](https://playwright.dev)
- [Playwright Test](https://playwright.dev/docs/test-intro)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
