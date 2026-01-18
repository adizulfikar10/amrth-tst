# Employee Management System

A 2-step role-based wizard form and Employee List Page built with React Router v7.

## Features

- **Role-based Wizard**: Admin (Basic Info) & Ops (Details) steps.
- **Employee List**: Pagination and merged data from two separate API sources.
- **Async Autocomplete**: `name_like` query for departments and locations.
- **File Upload**: Image preview with Base64 conversion.
- **Auto-save**: Drafts saved to `localStorage` every 2 seconds.
- **Bulk Submit**: Simulation of sequential POSTs.
- **Responsive**: Mobile-first design (360px - 1440px).
- **Tech Stack**: TypeScript, React Router v7, Vite, Vanilla CSS.

## Setup

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:
    This will run the React Router app and two instances of JSON Server concurrently.

    ```bash
    npm run dev
    ```

    - **App**: http://localhost:5173
    - **Basic Info API (Admin)**: http://localhost:4001
    - **Details API (Ops)**: http://localhost:4002

## Environment Variables

The application uses the following environment variables to connect to the backend APIs.

| Variable | Description | Default (Local) |
| :--- | :--- | :--- |
| `BASIC_INFO_API_URL` | URL for the Basic Info API | `http://localhost:4001` |
| `DETAILS_API_URL` | URL for the Details/Location API | `http://localhost:4002` |

### Vercel / Docker Configuration
*   **Docker**: The `docker-compose.yml` is pre-configured to point these variables to the internal container hostnames (`http://json-server-step1:4001`, etc.).
*   **Vercel**: Ensure these environment variables are set in your Vercel project settings if you are deploying the JSON servers separately or using a different backend. The application is configured to read these from `process.env` on the server and `import.meta.env` on the client.

## Testing

Run unit and integration tests using Vitest:

```bash
npm test
```

## Docker Setup (Optional)

You can run the entire stack (App + 2 Mock Servers) using Docker Compose:

```bash
docker-compose up --build
```

This will expose the app on port **3000** (mapped from container) and the APIs on **4001** and **4002**.

## Architecture Notes

*   **Split API**: The project simulates a microservices architecture where "Basic Info" and "Employee Details" live on separate servers. The frontend merges this data for the Employee List view.
*   **Wizard State**: Uses URL query parameters for role management and `localStorage` for draft persistence, ensuring data isn't lost on refresh.
