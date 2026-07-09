# Project Setting and Guidelines

## Project Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Commands
- `npm run dev` : Start development server
- `npm run build` : Build the project for production
- `npm run start` : Start the production server
- `npm run lint` : Run ESLint

## Development Rules & Guidelines

### React Server Components (RSC)
- **Use React Server Components by default.** All components in the `app/` directory are Server Components by default.
- **When to use `"use client"`:**
  - When using React hooks (`useState`, `useEffect`, `useContext`, `useRef`, etc.).
  - When handling user interactions (e.g., `onClick`, `onChange` event listeners).
  - When using browser-only APIs (e.g., `window`, `document`).
- **Optimization:** Keep Client Components as far down the component tree as possible (leaves of the tree) to maximize the performance benefits of Server Components.

### TypeScript
- Use TypeScript for all source code files (`.ts`, `.tsx`).
- Define explicit types or interfaces for component props and state.
- Avoid using `any`; use `unknown` if the type is truly unknown.

### Styling
- Use Tailwind CSS for styling.
- Utilize Tailwind's utility classes to build responsive and consistent designs.

### Project Structure
- `app/` - Next.js App Router (pages, layouts, API routes).
- `public/` - Static assets like images, fonts, etc.
