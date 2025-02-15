# Sigma Manga

<div align="center">
  <img src="https://www.whiteboardjournal.com/wp-content/uploads/2022/01/unnamed-9-2.jpg" alt="Image Description" style="width: auto; height: 200px;">
</div>

>#### ❝ When one more chapter before sleep turn into an entire season ❞

## Features
- Loading skeleton
- Debounced Search
- Responsive design for mobile and desktop
- Server-side pagination
- Pagination caching
- MyAnimeList seeder (Web scrap)
- Pytest for automated back-end testing

## Prerequisites
- Python v3.10+
- Node.js v18+ (Recommended LTS v20)

## How to Install
1. Clone the repository:
    ```sh
    git clone https://github.com/H-pun/sigma-manga.git
    ```
2. Navigate to the project directory:
    ```sh
    cd sigma-manga
    ```
3. Create a virtual environment for Python:
    ```sh
   python -m venv .venv
    ```
4. Activate the virtual environment:
    - On Windows:
        ```sh
        .venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```sh
        source .venv/bin/activate
        ```
5. Install the Python dependencies:
    ```sh
    pip install -r requirements-dev.txt
    ```
6. Install the Node.js dependencies:
    ```sh
    npm install
7. Apply database migrations:
    ```sh
    alembic upgrade head
    ```
    or

    ```sh
    npm run migrate
    ```
8. Seed the database with initial data from MyAnimeList:
    ```sh
    py -m api.seeder
    ```
    or

    ```sh
    npm run seed
    ```


## How to Run
1. Start the development server:

    - `npm run fastapi`: Starts the back-end FastAPI server.
    - `npm run dev`: Starts the front-end development server.

> [!NOTE] 
> Or you can start both servers at once using:
> - `npm run dev:all`: Starts both the front-end and back-end servers.

2. Open your browser and navigate to `http://localhost:3000`
