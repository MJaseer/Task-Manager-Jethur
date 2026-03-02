# Project Management Application

This documentation provides the initialization requirements and setup instructions for the Angular 20.3 Task Management system. The project utilizes a zoneless change detection architecture and integrates Tailwind CSS v4 alongside PrimeNG 19+.

---

## Technical Stack

* **Framework:** Angular 20.3.x (Zoneless Mode)
* **UI Suite:** PrimeNG 21.x
* **Styling:** Tailwind CSS v4
* **State Management:** Angular Signals & `rxResource`
* **Rich Text:** Quill.js (via PrimeNG Editor)

---

## Prerequisites

Ensure the following environments are installed on the local machine:

1. **Node.js:** v22.0.0 or higher (LTS recommended)
2. **Package Manager:** npm v10.x or higher
3. **Angular CLI:** v20.x

---

## Project Initialization

### 1. Installation of Dependencies

Execute the following command to install the necessary packages defined in `package.json`:

```bash
npm install

```

### 2. Tailind CSS v4 Configuration

Tailwind CSS v4 is integrated using the `@tailwindcss/postcss` plugin. The main entry point `src/styles.scss` should contain the following imports to ensure proper layering with PrimeNG:

```css
@import "tailwindcss";

@layer primeng, tailwind-utilities;

@layer primeng {
    @import "primeng/resources/themes/aura-light-blue/theme.css";
    @import "primeng/resources/primeng.min.css";
}

```

### 3. Application Configuration

The application is configured for zoneless reactivity. The `app.config.ts` must include the following providers to support the project architecture:

* `provideZonelessChangeDetection()`: Removes the dependency on Zone.js for improved performance.
* `provideHttpClient()`: Enables backend and mock data services.
* `providePrimeNG()`: Configures the global theme and UI settings.
* `provideRouter(routes, withComponentInputBinding())`: Enables automatic mapping of route parameters to signal inputs.

---

## Core Features Implementation

### Recursive Comment System

The application implements a multi-level nested comment architecture. This is handled via a recursive `CommentThreadComponent` which utilizes Signal-based inputs to maintain state reactivity across deep nesting levels.

### Signal-Based State Management

Global state is managed within the `TaskService` using the `rxResource` API for asynchronous data fetching and `signal` for local CRUD operations. The service includes a recursive helper function to update specific nested replies without triggering unnecessary global re-renders.

### Rich Text Integration

The task description field utilizes the PrimeNG Editor. In the task list management view, data patching is handled via a micro-task queue to ensure the third-party editor instance is correctly initialized before data binding.

---

## Development Operations

### Start Development Server

```bash
ng serve

```

The application will be accessible at `http://localhost:4200/`.

### Production Build

```bash
ng build --configuration production

```

---

## Data Structure

The application expects a `Task` model with the following interface structure:

| Property | Type | Description |
| --- | --- | --- |
| `id` | string | Unique task identifier |
| `title` | string | Task headline |
| `description` | string | HTML content from Editor |
| `status` | TaskStatus | Todo, In Progress, Done |
| `dueDate` | string | ISO Date string |
| `comments` | Comment[] | Recursive array of comment objects |

Would you like me to generate the full `package.json` file specifically optimized for these version requirements?