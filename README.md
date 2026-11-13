# Book Lending Tracker

A responsive book-lending application built with plain HTML, CSS, and JavaScript. No frameworks or external libraries are required.

## Project structure

```text
book-lending-tracker/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

## Features

- Add a book with its title, author, borrower, due date, and genre.
- Required-field validation with a custom message beside each invalid field.
- View all loans in a table and filter by status.
- Automatically identify overdue loans.
- Mark a book as returned or delete a record.
- Summary of total loans, overdue loans, and returned books.
- Save records in the browser using `localStorage`.
- Responsive layout for desktop and mobile.

## Run locally

1. Extract the ZIP file.
2. Open the `book-lending-tracker` folder.
3. Double-click `index.html` to open it in a browser.

You can also open the folder in Visual Studio Code and use the Live Server extension.

## Publish on GitHub

1. Sign in to GitHub and create a **public** repository named `book-lending-tracker`.
2. Open a terminal in this project folder.
3. Run these commands:

```bash
git init
git add .
git commit -m "Create book lending tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/book-lending-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Deploy on Cloudflare Pages

1. Sign in to the Cloudflare dashboard.
2. Open **Workers & Pages** and choose **Create application** / **Pages**.
3. Connect your GitHub account and select `book-lending-tracker`.
4. Choose **Deploy a site** / **Direct Upload** only if you are uploading the files manually; otherwise use the Git integration.
5. For this plain HTML/CSS/JS project, use no build command and leave the build output directory as `/` (the repository root).
6. Deploy. Cloudflare will provide a public URL.

## Important notes

- CSS is kept in `css/styles.css`; JavaScript is kept in `js/app.js`. Neither is embedded in the HTML.
- Data is stored in the browser that is being used. `localStorage` does not synchronize records between different devices or browsers.
- The GitHub repository and Cloudflare deployment must be created from your own accounts. This project package is ready to upload, but those accounts cannot be published on your behalf from this chat.
