# Employee Management System

A 2-step role-based wizard form and Employee List Page built with Remix JS (React Router v7).

## Features

- **Role-based Wizard**: Admin & Ops steps.
- **Employee List**: Pagination and merged data.
- **Async Autocomplete**: `name_like` query.
- **File Upload**: Image preview with Base64 conversion.
- **Auto-save**: Drafts saved every 2 seconds.
- **Bulk Submit**: Simulation of sequential POSTs.
- **Responsive**: 360px - 1440px.
- **Tech Stack**: TypeScript, Remix (React Router v7), Vanilla CSS.

## Setup

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:
    This will run the Remix app and two instances of JSON Server concurrently.
    ```bash
    npm run dev
    ```

    - App: http://localhost:5173 (default)
    - Admin API: http://localhost:3001
    - Ops API: http://localhost:3002

## Testing

```bash
npm test
```

## Docker Setup (Optional)

```bash
docker-compose up
```

## Deployment

[Public Link Placeholder]
