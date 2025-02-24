<div align="center">
<h1 align="center">ACEE Exam Submission System</h1>

English / [简体中文](./README_CN.md)

</div>

## Overview

The ACEE Exam Submission System is a modern web application built using Vue 3, TypeScript, and Vite. It provides a streamlined interface for exam submission, group management, and review of exam results. The application leverages state-of-the-art UI libraries and modern development practices to ensure a smooth experience for both developers and end users.

## Prerequisites

Before building and running the project, ensure you have the following installed:

- [Node.js (v14 or later)](https://nodejs.org)
- [pnpm](https://www.pnpm.io/)

## Installation

1. **Clone the Repository**
   Clone the project repository to your local machine:

   ```bash
   git clone https://github.com/ZJUKongroo/Examer.WebUI
   cd Examer.WebUI
   ```
2. **Install Dependencies**
   Install the project dependencies using npm or Yarn:

   ```bash
   pnpm install
   ```

## Running the Application

### Development Mode

To start the application in development mode with hot module replacement:

```bash
pnpm dev
```

This command starts a local development server, and you can access the application in your browser at the URL provided by the terminal (typically http://localhost:3000).

### Production Build

To build the application for production deployment:

```bash
pnpm build
```

This command bundles the application into static files that can be deployed on any web server.

### Previewing the Production Build

After building, you can preview the production build locally to verify that everything works as expected:

```bash
pnpm preview
```

This will start a server to serve the built files, allowing you to test the production bundle.

## Usage

- **Navigation & Routing:** The application uses Vue Router for navigation across various pages (e.g., LicenseView, GroupView, ReviewView, CandidateView). Each page is designed to handle specific aspects such as license information, candidate management, exam group assignments, and review of exam submissions.
- **State Management:** State is managed using Pinia. Stores are used to manage the global state such as exam commits, user details, and configuration settings across the application.
- **HTTP Requests:** Axios is used for handling HTTP requests. Requests are routed via Vite’s proxy configuration in development to seamlessly interact with backend API endpoints.
- **UI Components:**
  The project integrates UI components from Vuetify for a responsive and consistent design. Animations powered by Anime.js provide smooth transitions during user interactions.

## Build Process & Deployment

- **Build Process:** The application is built using Vite, which provides fast development startup and an efficient production bundling. The build process includes handling of TypeScript, Vue Single File Components, and static assets.
- **Deployment:**
  The production build outputs static files that can be deployed on any standard web server or hosting service. Make sure to set the correct environment variables when deploying to production.
