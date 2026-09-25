# Product Admin Dashboard

A modern, responsive admin dashboard built with Next.js (App Router), React, Tailwind CSS, and Axios.

## Features Completed
- **Authentication**: Login page using the DummyJSON auth endpoint (`emilys` / `emilyspass`). Token is persisted via `localStorage`.
- **Product Listing**: Responsive grid displaying products.
- **Pagination**: Fully synced with the URL for seamless sharing and reloading.
- **Search & Filter**: Debounced search and category dropdown filters. (Note: Search and Filter are mutually exclusive to adhere to DummyJSON API limitations).
- **Product Details**: Dedicated page for viewing product information.
- **Shared Axios setup**: Intercepts requests to inject tokens and handles 401 unauthorized errors globally.

## Faking CRUD Operations
- **Optimistic UI**: Since the DummyJSON API does not actually save new products, edits, or deletions, I implemented optimistic UI updates. When a user submits the Add/Edit form or confirms a deletion, the app waits for the mock success response from the API, then immediately updates the local React state. This provides a realistic, fast user experience despite the API limitations.

## Setup Steps
1. Clone the repository.
2. Navigate to the project directory: `cd admin-dashboard`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open `http://localhost:3000` in your browser.

## Architectural Notes
- **App Router & Tailwind**: Used for modern routing and aesthetic, responsive styling.
- **Handling API Limitations**: DummyJSON cannot filter by category and search simultaneously. My approach was to clear the category parameter when searching, and vice versa. This keeps the UX predictable.
- **AI Tools**: AI tools were used to rapidly scaffold the Next.js foundation, API services, and basic components.
