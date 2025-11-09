# FocusX

A minimalist, distraction-free writing application designed for focus and clarity. FocusX helps you organize your thoughts, craft your stories, and find your flow with powerful AI-assisted tools, all within a serene and beautiful interface.

## Getting Started

This project is a modern frontend application built with React. It uses a build-less setup with ES modules and import maps, allowing you to run it directly in a compatible browser environment.

## Deployment to Vercel

This project is ready to be deployed to [Vercel](https://vercel.com/).

### Prerequisites

- A Vercel account.
- A Git repository (GitHub, GitLab, or Bitbucket) containing the project code.
- A Google Gemini API Key.

### Steps

1.  **Push to Git:** Make sure all your project files are committed and pushed to your Git repository.

2.  **Import Project in Vercel:**
    -   Log in to your Vercel dashboard.
    -   Click "Add New..." -> "Project".
    -   Import your Git repository.

3.  **Configure Project:**
    -   Vercel will likely detect this as a "Static Site". For "Framework Preset", you can select "Other" as there's no traditional build step.
    -   The "Root Directory" should be the root of your project.
    -   Leave the "Build and Output Settings" empty.

4.  **Add Environment Variables:**
    -   In the project configuration screen, navigate to the "Environment Variables" section.
    -   Add an environment variable with the key `API_KEY`.
    -   Paste your Google Gemini API key as the value.

    > **Important Note:** Vercel does not expose environment variables to the client-side of static sites by default. The application code expects `process.env.API_KEY` to be available in the browser. For a standard Vercel static deployment, this will not work. You may need to use a framework with a build step (like Vite or Next.js) that can inject these variables, or refactor the app to use Vercel Serverless Functions to handle API calls securely. The current setup assumes an environment that makes these variables available on the client.

5.  **Deploy:**
    -   Click the "Deploy" button.
    -   Vercel will deploy your site and provide you with a public URL. The `vercel.json` file included in this project ensures that all requests are correctly routed for a single-page application.

That's it! Your FocusX application should now be live, assuming your deployment environment handles the client-side environment variables.
