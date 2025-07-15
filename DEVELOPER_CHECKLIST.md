# Developer Checklist: Dynamic Company Management

This document outlines the sequential steps required to build the dynamic company management system. Follow this checklist to ensure all requirements from the plan are met.

## Phase 0: Project Setup & Dependencies

[ ] 1. **Install Backend Dependencies**: Open a terminal in the project root and run the following command to install the necessary packages for a Node.js/Express backend.

```bash
npm install express cors body-parser
```

[ ] 2. **Install Frontend Form & Validation Dependencies**: Install libraries for robust form handling and validation.

```bash
npm install react-hook-form zod @hookform/resolvers
```

[ ] 3. **Create Backend Server File**: In the project root, create a new file named `server.js`. This will be the entry point for your API.

[ ] 4. **Create Initial Data File**: In the `src/data` directory, create a new file named `companies.json`. Initialize it with an empty array `[]`. This will act as your database for the MVP.

## Phase 1: Backend Development (API - MVP) with Authorization

[ ] 1. **Implement the API Server**:
   - Copy the complete code from the server.js (MVP) document into the `server.js` file you created.
   - Review the code: Pay attention to the comments explaining the middleware, helper functions, and API endpoints.
   - **IMPORTANT**: Change the `API_SECRET_KEY` to a new, unique, and secret string. Remember the key you choose, as you will need it for the frontend.

[ ] 2. **Run the API Server**:
   - Open your terminal and run the server using Node.
   ```bash
   node server.js
   ```
   - You should see the message: `API Server is running on http://localhost:3001`.

[ ] 3. **Test API Endpoints**: Use a tool like Postman or curl.
   - Verify you can GET data from `http://localhost:3001/api/companies` without a key.
   - Verify that POST requests to the same URL fail with a 403 Forbidden error if you don't provide the `Authorization: Bearer <your-secret-key>` header.
   - Verify that POST requests succeed when you provide the correct header and a valid JSON body.

## Phase 2: Frontend Admin Interface

[ ] 1. **Create New Directory for Admin Components**:
   - Inside `src/components/`, create a new folder named `admin`.

[ ] 2. **Create AddCompanyForm.tsx Component**:
   - In `src/components/admin/`, create `AddCompanyForm.tsx`.
   - Use `react-hook-form` and `zod` to build the form with fields for `name`, `score`, `logoUrl`, and `portfolio` (textarea).
   - **Validation Schema (Zod)**: Define a schema that enforces all required fields and uses a transform to validate that the comma-separated portfolio string results in an array with `.min(3)` length.
   - **Submission Logic**: On submit, the form should send a POST request to `http://localhost:3001/api/companies`. Crucially, add the Authorization header:

```javascript
fetch('http://localhost:3001/api/companies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <your-secret-key>' // Use the same key as in server.js
  },
  body: JSON.stringify(data)
});
```

[ ] 3. **Create CompanyManagementPage.tsx**:
   - In `src/pages/`, create a new file `CompanyManagementPage.tsx`.
   - Render the `AddCompanyForm` component on this page.

[ ] 4. **Add a Route for the Admin Page**:
   - In `src/App.tsx`, add a new route (e.g., `/admin`) that renders the `CompanyManagementPage`. Add a link in the main navigation to access it.

## Phase 3: Integrate Dynamic Data into Core App

[ ] 1. **Create a New Data Hook useCompanies.ts**:
   - In `src/hooks/`, create `useCompanies.ts` to fetch data from your public `http://localhost:3001/api/companies` endpoint. Manage loading and error states.

[ ] 2. **Modify useCSVData.ts**:
   - Modify the `useProcessedData` function to fetch from your new `useCompanies` hook instead of the static array.
   - Continue to fetch portfolio data from `VCSCORE_v2.csv` and merge it with the company data from your API.
   - Ensure the `logoService` is still used for fallback logos.

[ ] 3. **Verify CompanySelector.tsx & VCPage.tsx**:
   - Run the app, add a new company via the admin form, and verify it appears correctly in the selector and that its detail page works.

## Phase 4: Enhancements & Full CRUD

[ ] 1. **Implement PUT and DELETE Endpoints**:
   - In `server.js`, add `PUT /api/companies/:id` and `DELETE /api/companies/:id` endpoints. Remember to protect both with the `authorize` middleware.

[ ] 2. **Create CompanyList.tsx Component**:
   - In `src/components/admin/`, create `CompanyList.tsx`.
   - Fetch and display all companies. Each row should have "Edit" and "Delete" buttons.

[ ] 3. **Implement Edit/Delete Functionality**:
   - The "Delete" and "Edit" buttons should trigger DELETE and PUT requests to the API.
   - Ensure these requests include the Authorization header, just like the POST request.

[ ] 4. **Add User Feedback**:
   - Implement loading indicators and success/error notifications for all data modification actions.

[ ] 5. **Upgrade Security (Future)**:
   - This is a placeholder for a future task. The current API key method is great for an internal MVP. A future enhancement would be to replace the hardcoded key with a proper authentication system (like Clerk, Auth0, or a database-backed user login) to provide individual user accounts and permissions.
