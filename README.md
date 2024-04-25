# Question Box

## Description

An in-memory companies' survey application.

![question box project hero](https://github.com/jordanlepera/question-box/blob/master/public/hero.png)

### Users

- **admin**:
  - Email: john.doe@test.com
  - Password: password
- **user**:
  - Email: john.doe2@test.com
  - Password: password2

## Features

- Sign up
- Sign in
- Sign out
- Quiz answering
- Admin dashboard
- CRUD on quiz (create, read, update, delete)
- Quiz results

## Tools

- TypeScript
- Next.js 14 (front-end framework)
- Tailwind CSS (CSS processor)
- Shadcn-UI (components generation)
- Aceternity-UI (amazing components library)
- Zustand (state management)
- Zod (data validations)

## Installation

1. Install pnpm:

```
npm install -g pnpm
```

2 - install dependencies

```
pnpm install
```

3 - development

```
pnpm dev
```

4 - build and production

```
pnpm build
pnpm start
```

## Project architecture

```
.
└── question-box/
    ├── public
    ├── src/
    │   ├── app/
    │   │   ├── dashboard - /dashboard route
    │   │   ├── quiz - /quiz route
    │   │   ├── signin - /signin route
    │   │   ├── signup - /signup route
    │   │   ├── favicon.ico
    │   │   ├── global.css - tailwind global css file
    │   │   ├── layout.tsx - Root layout
    │   │   └── page.tsx - / route
    │   ├── components/
    │   │   ├── Dashboard
    │   │   ├── Logo
    │   │   ├── Quiz
    │   │   ├── QuizList
    │   │   ├── QuizResults
    │   │   ├── SignIn
    │   │   ├── SignUp
    │   │   └── ui - shadcn-ui generated components & aceternity-ui components
    │   ├── lib/
    │   │   ├── store.ts - zustand store
    │   │   └── utils.ts - shadcn-ui utils
    │   └── mock/
    │       └── data.ts - types & mock for initial data
    ├── .eslint.json
    ├── .gitignore
    ├── .prettierignore
    ├── .prettierrc
    ├── components.json - shadcn-ui config file
    ├── package.json
    ├── postcss.config.mjs - postcss config file
    ├── README.md
    ├── tailwind.config.ts - taillwindcss config file
    └── tsconfig.json - typescript config file
```

## Author

Jordane LE PERA
