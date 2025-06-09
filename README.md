# Fetch Frontend Take-Home Assessment

This project is a modern Angular application built to fulfill the requirements of the Fetch frontend take-home exercise. It provides a user-friendly interface to search for and find a perfect dog companion.

## Features

-   **User Authentication:** Secure login using a name and email. The user's session is gracefully handled with an HttpOnly authentication cookie.
-   **Session Persistence:** The application verifies the user's session on startup, so a user remains logged in even after reloading the page.
-   **Protected Routes:** The main search functionality is protected and can only be accessed by authenticated users.
-   **Reactive Dog Search:** The search page is built using a fully reactive architecture with RxJS, providing a fast and responsive user experience.
-   **Advanced Filtering:** Users can filter the dog list by:
    -   One or more breeds
    -   A minimum and maximum age
    -   One or more ZIP codes (comma-separated)
-   **Sorting:** Search results are sorted by breed by default and can be toggled between ascending and descending order.
-   **Pagination:** An efficient pagination system handles the thousands of available dogs.
-   **Favorites System:** Users can click the heart icon on any dog card to add or remove it from a personal favorites list.
-   **Generate a Match:** After selecting at least one favorite dog, users can click the "Generate Match" button. The application will use the API to find a single best match from the list of favorites and display it.

## Technical Architecture

-   **Angular 20:** Built with the latest version of the Angular framework.
-   **Standalone Components:** Modern, tree-shakable standalone components for a more modular architecture.
-   **Server-Side Rendering (SSR):** Provides fast initial page loads and improved SEO.
-   **Zoneless Change Detection:** Utilizes Angular's modern, high-performance zoneless change detection strategy.
-   **Reactive Programming with RxJS:** The entire application state and data flow are managed reactively with RxJS Observables, ensuring a predictable and maintainable codebase.
-   **Angular Material:** A suite of high-quality UI components from Google's Material Design system is used for the user interface.

## Getting Started

Follow these instructions to get the application running on your local machine.

### Prerequisites

You will need to have the following software installed:

-   [Node.js](https://nodejs.org/) (which includes `npm`)

### Installation & Running the App

1.  **Navigate to the project directory:**
    Open your terminal and `cd` into the `fetch-assesment` folder.

    ```bash
    cd fetch-assesment
    ```

2.  **Install dependencies:**
    Run the following command to install all the necessary packages for the project.

    ```bash
    npm install
    ```

3.  **Run the application:**
    Start the Angular development server using the following command. This command will build the application, start a local server, and automatically watch for any file changes.

    ```bash
    ng serve
    ```

4.  **Open in your browser:**
    Once the server is running, open your web browser and navigate to:

    `http://localhost:4200/`

    The application uses a proxy configuration (`proxy.conf.json`) to handle CORS issues when communicating with the Fetch API, so no browser extensions are needed.

## How to Use the Application

1.  **Login:**
    You will be greeted by a login screen. Enter any name and email address and click "Login" to authenticate with the service.

2.  **Search for Dogs:**
    After logging in, you will be redirected to the main search page.
    -   **Filtering:** Use the filter controls at the top to narrow your search by breed, age, or ZIP codes. The results will update automatically as you change the filters.
    -   **Sorting:** Click the "Sort by Breed" button to toggle between `A-Z` and `Z-A` sorting.
    -   **Pagination:** Use the paginator controls at the bottom of the list to navigate through the search results.

3.  **Select Favorites:**
    Click the heart icon on any dog's card to add it to your list of favorites. The heart will fill in to indicate it has been selected. Clicking it again will remove the dog from your favorites.

4.  **Generate a Match:**
    Once you have selected one or more favorite dogs, the "Generate Match" button will become enabled. Click it to have the service choose a single perfect match for you from your list. The matched dog will be displayed in a special card.

5.  **Logout:**
    Click the "Logout" button in the top-right corner of the header to end your session and return to the login screen.
