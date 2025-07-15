# Plan: Display Top 3 Portfolio Companies

This document outlines the plan to add a new feature that displays the top 3 most recent portfolio companies for each selected VC firm in the main dashboard.

## 1. Data Integration

The core of this feature is integrating the new portfolio company data from the `VCSCORE_v2.csv` file.

### 1.1. File Placement

- **Action:** Move the `VCSCORE_v2.csv` file from the project root to the `/public` directory.
- **Reason:** Placing the file in the `public` directory makes it a static asset that can be easily fetched by the frontend using a simple `fetch('/VCSCORE_v2.csv')` call, without requiring any special handling or build configuration.

### 1.2. Data Fetching and Parsing (`src/hooks/useCSVData.ts`)

- **Action:** Create a new asynchronous function named `fetchPortfolioData`.
- **Details:**
    - This function will be responsible for fetching `/VCSCORE_v2.csv`.
    - It will parse the CSV text response, skipping the header row.
    - For each row, it will extract the VC Name (column 0) and the details of its three most recent investments. The relevant columns are:
        - Investment 1 Name: Column 7
        - Investment 1 Date: Column 8
        - Investment 2 Name: Column 13
        - Investment 2 Date: Column 14
        - Investment 3 Name: Column 19
        - Investment 3 Date: Column 20
    - The function will return a `Map<string, PortfolioCompany[]>` where the key is the VC name and the value is an array of up to three portfolio company objects.

### 1.3. Data Model Updates (`src/hooks/useCSVData.ts`)

- **Action:** Update the TypeScript interfaces to accommodate the new data.
- **Details:**
    - Create a new `PortfolioCompany` interface:
      ```typescript
      interface PortfolioCompany {
        name: string;
        announcementDate: string;
      }
      ```
    - Modify the existing `Company` interface to include an optional array of portfolio companies:
      ```typescript
      interface Company {
        id: string;
        name: string;
        score: number;
        logoUrl?: string;
        portfolio?: PortfolioCompany[]; // New property
      }
      ```

### 1.4. Data Merging (`src/hooks/useCSVData.ts`)

- **Action:** Modify the `useEffect` hook within `useCSVData`.
- **Details:**
    - After the `RAW_COMPANIES_DATA` is initialized, I will call the new `fetchPortfolioData` function.
    - I will then iterate through the `STATIC_COMPANIES_DATA` array. For each company, I will use its name to look up its portfolio from the map returned by `fetchPortfolioData`.
    - The retrieved portfolio array will be assigned to the `portfolio` property of the corresponding company object.

## 2. UI Implementation

With the data integrated, the next step is to display it in the UI.

### 2.1. Create `PortfolioDisplay.tsx` Component

- **Action:** Create a new file at `src/components/PortfolioDisplay.tsx`.
- **Purpose:** This component will be solely responsible for rendering the list of portfolio companies.
- **Props:** It will accept a single prop: `companies: PortfolioCompany[]`.
- **Styling:**
    - The root element will be a `<Card>` component, imported from `src/components/ui/card.tsx`, to ensure consistent container styling (background, border, padding, etc.).
    - It will include a title, such as "Recent Investments", styled consistently with other section headers in `ElementLight.tsx`.
    - It will map over the `companies` prop to render a list. Each list item will display the portfolio company's name and its announcement date.
    - All text and layout will use the existing Tailwind CSS classes from the project to match the established design system precisely.

### 2.2. Update `ElementLight.tsx`

- **Action:** Modify the main dashboard component to incorporate the new `PortfolioDisplay`.
- **Details:**
    - Import the newly created `PortfolioDisplay` component.
    - Locate the `ScoreDisplay` component in the JSX.
    - Immediately following the `ScoreDisplay` component, add a conditional rendering block.
    - This block will check if `selectedCompany` is not null and if `selectedCompany.portfolio` exists and has a length greater than 0.
    - If both conditions are true, it will render the `PortfolioDisplay` component, passing the portfolio data to it:
      ```jsx
      {selectedCompany && selectedCompany.portfolio && selectedCompany.portfolio.length > 0 && (
        <div className="mt-8">
          <PortfolioDisplay companies={selectedCompany.portfolio} />
        </div>
      )}
      ```
    - The `mt-8` class will ensure consistent vertical spacing between the score section and the new portfolio section.

This plan ensures a clean separation of concerns, maintains performance by loading data efficiently, and guarantees visual consistency by reusing existing styles and components.
