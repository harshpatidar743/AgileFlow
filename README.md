# AgileFlow

AgileFlow is a lightweight Agile Project Management web application built for small teams. It provides a full-stack solution with a Spring Boot backend and a React + TypeScript frontend. The app supports managing projects, user stories, tasks, and automated reminder notifications for due tasks.

## Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Backend API](#backend-api)
- [Application Flows](#application-flows)
- [AI-Assisted Development](#ai-assisted-development)
- [Design Decisions & Trade-offs](#design-decisions--trade-offs)
- [Database Schema & Relationships](#database-schema--relationships)
- [Asynchronous Reminder Workflow](#asynchronous-reminder-workflow)
- [Configuration](#configuration)
- [What I Would Improve or Build Next](#what-i-would-improve-or-build-next)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Features

- Project management with create/edit/delete operations
- User story management scoped to projects
- Task management with status, priority, due date, and reminders
- Automated notification scheduler for tasks due within 24 hours
- Unread notification count and mark-as-read functionality
- Dashboard overview with links into filtered views
- Single-page navigation using React Router
- Filtered views for project-specific stories and story-specific tasks
- Clean Material UI design with responsive layout

## Live Demo

**Application:** https://agile-flow-topaz.vercel.app

**API Documentation:** https://agileflow-jl7c.onrender.com/swagger-ui/index.html

## Architecture

The app is split into two main modules:

1. **Backend** (`backend/`)
   - Spring Boot application exposing REST APIs
   - Controller → Service → Repository layered architecture
   - JPA entities backed by SQLite
   - Scheduled reminder job for due tasks
   - OpenAPI / Swagger documentation enabled

2. **Frontend** (`frontend/`)
   - React + TypeScript application built with Vite
   - Material UI components and layout
   - Axios-based API client for backend communication
   - Client-side routing for pages and filtered views

```text
┌─────────────────────────────┐
│       React Frontend        │
│  React + TypeScript + MUI   │
└──────────────┬──────────────┘
               | HTTP / REST API (Axios)
               ▼
┌─────────────────────────────┐
│      Spring Boot Backend    │
│  Controller → Service →     │
│  Repository / JPA           │
└──────────────┬──────────────┘
               │ JPA / Hibernate
               ▼
┌─────────────────────────────┐
│          SQLite             │
│       agile_pm.db           │
└─────────────────────────────┘

      ┌──────────────────────────┐
      │ TaskReminderScheduler    │
      │ (every minute check)     │
      └──────────────┬───────────┘
                     │
                     ▼
               TaskRepository
                     │
                     ▼
           NotificationRepository
                     │
                     ▼
                   SQLite
                     │
                     ▼
               Notification API
                     │
                     ▼
               React Frontend
```

Request flow:

React UI → Axios → REST Controller → Service → Repository → SQLite

Controllers return DTOs such as `ProjectDto`, `TaskDto`, and `NotificationDto` so the API layer can expose a stable response model to the frontend.

## Tech Stack

- Backend:
  - Java 21
  - Spring Boot 3.4.2
  - Spring Web
  - Spring Data JPA
  - Spring Boot Validation
  - SQLite via `sqlite-jdbc`
  - Hibernate SQLite dialect
  - SpringDoc OpenAPI
  - Lombok

- Frontend:
  - React 18.3.1
  - TypeScript 5.6.2
  - Vite 6.0.7
  - Material UI 6.4.1
  - Axios 1.7.9
  - React Router DOM 6.28.1
  - Notistack notifications
  - Day.js for date handling
  - Lucide React icons

## Project Structure

```text
backend/
  src/main/java/com/agileflow/agilepm/
    config/
      CorsConfig.java
      OpenApiConfig.java
    controller/
      DashboardController.java
      NotificationController.java
      ProjectController.java
      TaskController.java
      UserStoryController.java
    dto/
      DashboardStatsDto.java
      NotificationDto.java
      ProjectDto.java
      TaskDto.java
      UserStoryDto.java
    entity/
      Notification.java
      Project.java
      Task.java
      UserStory.java
    enums/
      Priority.java
      Status.java
    exception/
      GlobalExceptionHandler.java
      ResourceNotFoundException.java
    repository/
      NotificationRepository.java
      ProjectRepository.java
      TaskRepository.java
      UserStoryRepository.java
    scheduler/
      TaskReminderScheduler.java
    service/
      DashboardService.java
      NotificationService.java
      ...
  src/main/resources/application.properties
  pom.xml

frontend/
  src/
    api/
      apiClient.ts
      services.ts
    components/
      Navbar.tsx
      Sidebar.tsx
      ProjectDialog.tsx
      UserStoryDialog.tsx
      TaskDialog.tsx
      ConfirmDialog.tsx
      PriorityChip.tsx
      StatusChip.tsx
    pages/
      DashboardPage.tsx
      ProjectsPage.tsx
      UserStoriesPage.tsx
      TasksPage.tsx
      NotificationsPage.tsx
    types/index.ts
    utils/dateTime.ts
  package.json
  tsconfig.json
  vite.config.ts
```

## Setup Instructions

### Prerequisites

- Java 21 SDK
- Maven 3.9+ or compatible
- Node.js 20+ and npm
- Git (optional)

### Backend Setup

1. Open a terminal in the repository root:
   ```bash
   cd backend
   ```
2. Build the backend application:
   ```bash
   mvn clean package
   ```
3. Run the backend service:
   ```bash
   mvn spring-boot:run
   ```

The backend listens on `http://localhost:8080` by default. In deployment environments like Render, the backend will bind to the `PORT` environment variable using `server.port=${PORT:8080}`.

### Backend Docker (optional)

The backend also includes a Dockerfile at `backend/Dockerfile` so it can be containerized for deployment.

```bash
cd backend
docker build -t agileflow-backend .
```

### Frontend Setup

1. Open a separate terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend dev server usually opens at `http://localhost:5173`.

The frontend uses an environment variable for the API base URL: `VITE_API_URL`. Locally it falls back to `http://localhost:8080/api`, and in production it can point to the deployed backend API.

## Running the Application

1. Start the backend first.
2. Start the frontend.
3. Open the frontend URL in your browser.

If the backend and frontend are running on different ports, the backend CORS policy is already configured to allow requests from the frontend.

For deployment or production preview, configure the frontend environment variable:

```bash
export VITE_API_URL=https://agileflow-jl7c.onrender.com/api
```

Then rebuild the frontend before deploying.

## Backend API

### Notifications

- `GET /api/notifications` — list all notifications
- `GET /api/notifications/unread-count` — unread notification count
- `PATCH /api/notifications/{id}/read` — mark a single notification as read
- `PATCH /api/notifications/read-all` — mark all notifications as read
- `DELETE /api/notifications/{id}` — delete a notification

### Dashboard

- `GET /api/dashboard/stats` — retrieve counts and metric summaries

### Projects

- `GET /api/projects` — list all projects
- `POST /api/projects` — create a project
- `PUT /api/projects/{id}` — update a project
- `DELETE /api/projects/{id}` — delete a project

### User Stories

- `GET /api/user-stories` — list all user stories
- `POST /api/user-stories` — create a user story
- `PUT /api/user-stories/{id}` — update a user story
- `DELETE /api/user-stories/{id}` — delete a user story

### Tasks

- `GET /api/tasks` — list all tasks
- `POST /api/tasks` — create a task
- `PUT /api/tasks/{id}` — update a task
- `PATCH /api/tasks/{id}/status` — change a task status
- `DELETE /api/tasks/{id}` — delete a task

## Application Flows

- **Dashboard cards** navigate into filtered lists:
  - `Total Projects` → `/projects`
  - `User Stories` → `/user-stories`
  - `Total Tasks` → `/tasks`
  - `Completed Tasks` → `/tasks?status=COMPLETED`
  - `Urgent Tasks` → `/tasks?priority=URGENT`
  - `Unread Alerts` → `/notifications`
- **Project cards** are clickable and navigate to `/user-stories?projectId=<projectId>`.
- **User story cards** are clickable and navigate to `/tasks?userStoryId=<storyId>`.
- **Notifications** can be marked as read individually or marked all as read.

## AI-Assisted Development

Given the limited development timeframe for the assignment, AI-assisted tools were used selectively to accelerate routine development tasks and support the implementation process.

- **Google Antigravity:** (Gemini 3.6 Flash) Assisted with boilerplate generation, UI refinement, repetitive implementation tasks, and development troubleshooting.
- **ChatGPT:** Used for requirement clarification, implementation review, debugging guidance, and documentation refinement.
- AI assistance helped suggest standard project structure, naming conventions, and common edge cases.
- AI-generated suggestions were reviewed and adjusted as needed to remain aligned with the assignment requirements and the actual implementation.

## Design Decisions & Trade-offs

### React + TypeScript
React was chosen for the frontend because it supports component-based UI and client-side routing for the dashboard, project, story, task, and notification pages.
TypeScript provides compile-time type safety for API responses and frontend models, which improves maintainability for this small full-stack project.

Trade-off:
- Adds type definitions and development complexity compared with plain JavaScript.

### Spring Boot
Spring Boot is used for the backend to simplify REST API development, dependency injection, validation, Spring Data JPA, and scheduler support.
The project uses Spring Web controllers, service interfaces, repositories, and scheduled background tasks in `TaskReminderScheduler`.

Trade-off:
- Has more framework/runtime overhead than a very lightweight backend, but it keeps the application structure consistent and easier to extend.

### SQLite
SQLite is used as the persistent store because this is a small-team / MVP application with simple setup requirements.
The backend is configured with `jdbc:sqlite:agile_pm.db` and `spring.jpa.hibernate.ddl-auto=update`, so evaluators can run the app locally without a separate database server.

Trade-off:
- Less suitable for high concurrency and large-scale production systems than PostgreSQL or MySQL.

### DTO Pattern
DTOs are used between controllers and frontend clients to separate persistence models from API responses.
This provides controlled API output, reduces entity serialization issues, and avoids exposing internal JPA entity structure directly.

Trade-off:
- Requires additional mapping and boilerplate code around DTO conversion.

### Layered Backend Architecture
The backend uses a clear Controller → Service → Repository structure.
This separation of concerns makes the application easier to maintain, test, and extend.

Trade-off:
- Adds a bit of boilerplate compared with a single-layer implementation in a small application.

### Spring Scheduler
Spring Scheduler is used for the asynchronous reminder workflow because it is simple and built into Spring.
The scheduler runs every minute, queries upcoming tasks, creates notifications, and updates task notification state.

Trade-off:
- In-memory application-instance scheduling is less suitable for large distributed systems; a production-scale system could use a job queue or message broker as a future option.

### Authentication / Team Management
Authentication and authorization are not implemented in this MVP.
That keeps the focus on core project, story, task, and notification workflows.

Trade-off:
- The current application behaves as a shared workspace; a production multi-user system would require authentication, authorization, team membership, and role-based access control.

### Swagger / OpenAPI
Swagger/OpenAPI is enabled via `OpenApiConfig` to provide interactive API documentation and easier endpoint discovery for evaluators.

Trade-off:
- Swagger documentation must remain synchronized with actual API behavior.

## Database Schema & Relationships

- Uses SQLite via `jdbc:sqlite:agile_pm.db` from `backend/src/main/resources/application.properties`.
- The database file is created automatically in the backend working directory when the Spring Boot application starts.
- JPA is configured with `spring.jpa.hibernate.ddl-auto=update`.

### Main Entities

- **Project**
  - Primary key: `id`
  - Fields: `name`, `description`, `createdAt`, `updatedAt`
  - One-to-many relationship to `UserStory` via `userStories`
  - Cascade: `CascadeType.ALL` with `orphanRemoval=true`

- **UserStory**
  - Primary key: `id`
  - Foreign key: `project_id` references `Project`
  - Fields: `title`, `description`, `status`, `priority`, `createdAt`, `updatedAt`
  - Many-to-one relationship to `Project`
  - One-to-many relationship to `Task` via `tasks`
  - Cascade: `CascadeType.ALL` with `orphanRemoval=true`

- **Task**
  - Primary key: `id`
  - Foreign key: `user_story_id` references `UserStory`
  - Fields: `title`, `description`, `status`, `priority`, `dueDate`, `notified`, `createdAt`, `updatedAt`
  - Many-to-one relationship to `UserStory`

- **Notification**
  - Primary key: `id`
  - Fields: `taskId`, `message`, `isRead`, `createdAt`
  - Contains a `task_id` string reference to `Task`, but it is not modeled as a JPA object relationship.

### Relationship Overview

- `Project` 1 — * `UserStory`
- `UserStory` 1 — * `Task`
- `Task` 1 — * `Notification` (via `taskId` string reference only)

This reflects the application hierarchy:

```text
Project
   1
   |
   | has many
   *
UserStory
   1
   |
   | has many
   *
Task
   0..*
   |
   | generates
   *
Notification
```

Notes:

- `Project` 1 — * `UserStory`
- `UserStory` 1 — * `Task`
- `Task` 0..* — * `Notification` via the string `taskId` field
- `Notification` is not modeled as a JPA object relationship to `Task`

In the current implementation:

- Deleting a `Project` cascades delete operations to its `UserStory` children and their `Task` children through JPA entity cascade settings.
- Deleting a `UserStory` cascades delete operations to its `Task` children.
- `Notification` stores `taskId` as a lookup reference, but there is no JPA `@ManyToOne` mapping from `Notification` back to `Task`.

## Asynchronous Reminder Workflow

The background reminder flow is implemented by `TaskReminderScheduler` in `backend/src/main/java/com/agileflow/agilepm/scheduler/TaskReminderScheduler.java`.

- The scheduler runs every minute at second 0, based on `@Scheduled(cron = "0 * * * * *")`.
- It loads tasks via `TaskRepository.findPendingTasksDueBefore(now, threshold)`.
- The selected tasks meet these conditions:
  - `dueDate` is not null
  - `dueDate` is between now and 24 hours from now
  - `status` is not `COMPLETED`
  - `notified` is `false`

For each eligible task, the scheduler:

1. Builds a reminder message containing the task title, story title, and project name.
2. Creates a new `Notification` entity with `isRead=false`.
3. Saves the notification to SQLite.
4. Sets `task.notified = true` and saves the task.

This prevents duplicate reminders because the query only selects tasks where `notified = false`.

The created notifications are exposed to the React frontend through the backend APIs:

- `GET /api/notifications`
- `GET /api/notifications/unread-count`

Flow:

```text
Task created
     ↓
Stored in SQLite
     ↓
TaskReminderScheduler runs every minute
     ↓
Selects tasks due within 24 hours, not completed, not notified
     ↓
Creates Notification with isRead=false
     ↓
Sets Task.notified = true
     ↓
Notification returned by backend APIs
     ↓
Frontend displays the new notification
```

## Configuration

Key configuration is located in `backend/src/main/resources/application.properties`:

- `server.port`: backend HTTP port
- `spring.datasource.url`: SQLite database file
- `spring.jpa.database-platform`: SQLite dialect
- `spring.jpa.hibernate.ddl-auto`: schema auto-update mode
- `springdoc.swagger-ui.path`: Swagger UI path

### Swagger / OpenAPI

The backend exposes OpenAPI documentation at:

- Local development: `http://localhost:8080/swagger-ui.html`
- Local API docs: `http://localhost:8080/api-docs`
- Deployed Render API docs: `https://agileflow-jl7c.onrender.com/swagger-ui/index.html`

## Security Considerations

This application is designed as a demonstration / MVP for managing agile projects and does not currently implement user authentication or authorization.

The following security considerations are addressed in the current implementation:

- **Input Validation:** Backend request payloads are validated using Spring Boot Validation annotations in DTO classes (for example, `@NotNull`, `@Size`) to reduce invalid or malformed input.
- **Database Access:** Spring Data JPA/Hibernate is used for database operations rather than constructing raw SQL queries, which reduces the risk of SQL injection.
- **DTO Usage:** DTOs are used between the API and client instead of directly exposing persistence entities, providing a better separation between API contracts and persistence models.
- **Exception Handling:** Centralized exception handling is implemented via `GlobalExceptionHandler` to return controlled API error responses and avoid exposing unnecessary internal implementation details.
- **CORS Configuration:** CORS is configured in `CorsConfig.java` to allow frontend-backend communication during development. This is intentionally permissive for local development and should be restricted to trusted origins in production.

### Current Limitations and Production Improvements

Authentication and authorization are outside the scope of the current MVP. As a result, this application should not be used to store sensitive or confidential information in its current form.

For a production deployment, the following improvements should be considered:

- Authentication using Spring Security
- Secure password hashing using BCrypt or an equivalent algorithm
- Role-based access control (RBAC)
- JWT or secure session-based authentication
- HTTPS for encrypted client-server communication
- Restricting CORS to trusted production origins
- Rate limiting for API endpoints
- Environment variables / secrets management for sensitive configuration
- Additional logging and security monitoring

## What I Would Improve or Build Next

- Add user authentication and authorization so individual team members can log in, manage their own projects and tasks, and enforce data access rules.
- Implement team and role management for owners, contributors, and stakeholders to support collaborative Agile planning.
- Add real-time updates using WebSockets or Server-Sent Events so dashboard cards, task lists, and notifications refresh automatically.
- Replace SQLite with PostgreSQL or MySQL for a more production-ready database and better support for concurrent users.
- Extend notifications with email and push alerts, plus a user-configurable notification preferences model.
- Add end-to-end tests for frontend flows and backend API routes to improve regression coverage and deployment confidence.
- Add deployment automation with Docker and a CI/CD pipeline for repeatable build/deploy processes.

## Development Notes

- The frontend uses React Router for navigation and query-based filtering.
- Notifications sync unread counts and status from the backend.
- The scheduler (`TaskReminderScheduler`) creates reminder notifications for pending tasks due within 24 hours.
- The app uses conditional query filters so dashboard clicks only show matching tasks.
- Backend CORS policy is permissive for local development.

## Troubleshooting

- If the frontend cannot reach the backend, verify backend is running on `http://localhost:8080`.
- If npm install fails, ensure Node.js and npm are current.
- If Maven build fails, ensure Java 21 is installed and `JAVA_HOME` is set properly.
- If the SQLite file cannot be created, confirm file system permissions in the backend folder.

