# NoticeBoard – CAMC Portal

A NoticeBoard feature for the TPC portal that allows an administrator to create announcements, choose recipients, publish the announcement to the portal, and optionally distribute it by email. Announcements are persisted in PostgreSQL through Sequelize; email delivery is a separate step.

## 1. Features

### Create announcement

The admin form supports:

- Club name (currently pre-filled as `CAMC`).
- Announcement heading.
- Rich-text announcement content using ReactQuill, including headings, bold/italic/underline, lists, alignment, links, blockquotes, and code blocks.
- Optional announcement logo. The frontend accepts PNG, JPG/JPEG, GIF, and WebP images up to 2 MB and sends the image as a data URL.
- Recipient group selection:
  - `all` – all students with an email address.
  - `manager` – the placement manager email.
  - `programs` – students belonging to the selected academic programs.
  - `none` – no predefined group; manually entered email addresses can still be used.
- Optional manually entered email addresses. The backend combines these with the selected group recipients and removes duplicates.
- Form validation for required heading/content, program selection, and email address format.

### View and manage announcements

The NoticeBoard view supports:

- Fetching announcements from the backend.
- Showing the newest announcements first.
- Searching announcement heading, content, and club name.
- Selecting one or multiple announcements.
- Single and bulk delete actions, with a confirmation prompt.
- Loading, empty, and error states.
- Sanitizing announcement HTML before rendering it in the browser with DOMPurify.

## 2. Technology stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Rich-text editor | ReactQuill |
| UI components | Project UI components and Lucide icons |
| Frontend API layer | Shared `apiCall()` helper in `src/helpers/api.ts` |
| Backend | NestJS, TypeScript |
| ORM | Sequelize with `sequelize-typescript` |
| Database | PostgreSQL |
| Email | Nodemailer (Gmail transport configuration in `EmailService`) |

## 3. Main files

### Frontend

| File | Responsibility |
|---|---|
| `src/components/Admin/NoticeBoard.tsx` | Admin form to create and publish an announcement. |
| `src/components/Admin/NoticeBoardView.tsx` | Lists, searches, selects, previews, and deletes announcements. |
| `src/helpers/api.ts` | Shared API request helper and NoticeBoard API methods (`fetchAnnouncements`, `createAnnouncement`, `deleteAnnouncements`). |

### Backend

| File / area | Responsibility |
|---|---|
| `src/noticeboard/noticeboard.controller.ts` | Exposes the NoticeBoard HTTP endpoints. |
| `src/noticeboard/noticeboard.service.ts` | Saves and retrieves announcements, resolves recipient email addresses, and triggers email delivery. |
| `src/noticeboard/dtos/` | Validates create-announcement and query request data. |
| `NoticeboardModel` | Sequelize model for announcement records. |
| Email service (`EmailService` / `email.service.ts`) | Creates the Nodemailer transport and sends email messages. |
| Database provider | Configures PostgreSQL Sequelize and registers `NoticeboardModel` with the other database models. |

> File names and capitalization can differ slightly in the local repository. Keep imports consistent with the actual file names in the project.

## 4. Application flow

### Publishing an announcement

1. The administrator fills in the announcement form.
2. The frontend validates the heading, content, recipients, and any selected programs.
3. The logo, when provided, is converted to a Base64 data URL.
4. The frontend sends the payload to `POST /api/v1/announce` through the shared `apiCall()` helper.
5. The NestJS controller calls `NoticeboardService.createAnnouncement()`.
6. The service inserts the announcement using `NoticeboardModel.create()`.
7. If `SEND_MAIL` is set to `true`, the service resolves recipient addresses and attempts email delivery through `EmailService`.
8. The saved announcement is returned to the frontend. Email delivery is independent of the database insert: the service's current implementation saves the record before attempting to send email, and reports an email failure without discarding the saved record.

### Resolving recipients

The current service logic uses these rules:

- `all`: retrieves students and their related user email addresses.
- `manager`: uses the placement manager email configured by the service (with `managerplacement@iiti.ac.in` as the fallback in the referenced service code).
- `programs`: retrieves students whose `programId` is in the selected program IDs, then reads their related user email addresses.
- `none`: does not add a predefined recipient group.
- Manually entered addresses are combined with the group recipients and deduplicated.

The current `NoticeboardModel.create()` call persists the announcement content and the chosen group. The `emails` and `programIds` values are used to resolve email recipients in the service; they are not included in that insert call, so they are not stored in the announcement record by this implementation.

### Viewing announcements

1. The frontend calls `GET /api/v1/notification` through `fetchAnnouncements()`.
2. The service retrieves announcements ordered by `createdAt` descending.
3. The API returns a paginated object containing `data`, `total`, `page`, and `limit`.
4. The frontend renders the records and provides local search and selection controls.

### Deleting announcements

The frontend helper is designed to send one or more numeric IDs as repeated query parameters:

```http
DELETE /api/v1/notification?id=12
DELETE /api/v1/notification?id=12&id=13
```

For this flow to work end-to-end, the backend controller must expose `DELETE /notification`, read the `id` query parameter (which may be a string or an array of strings), and call a service method that deletes those IDs using Sequelize. The backend response is expected to include:

```json
{
  "deletedCount": 1,
  "message": "1 announcement(s) deleted successfully."
}
```

The NoticeBoard view checks `deletedCount` before removing the records from its local state. If the local backend controller/service does not yet implement this exact route and response, the frontend delete action will not complete successfully.

## 5. API contract

The shared frontend API helper builds the `/api/v1` prefix from `NEXT_PUBLIC_BACKEND_URL`.

| Method | Endpoint | Purpose | Expected response |
|---|---|---|---|
| `POST` | `/api/v1/announce` | Create an announcement and optionally send email. | Message and saved announcement data. |
| `GET` | `/api/v1/notification?page=1&limit=500` | Retrieve announcements. | `{ data, total, page, limit }`. |
| `DELETE` | `/api/v1/notification?id=12&id=13` | Delete one or multiple announcements. | `{ deletedCount, message }`. |

### Example create payload

```json
{
  "clubname": "CAMC",
  "heading": "Important Announcement",
  "info": "<p>Announcement content goes here.</p>",
  "announcelogo": "",
  "group": "programs",
  "emails": [],
  "programIds": ["PROGRAM_UUID"]
}
```

For a `programs` recipient group, at least one program ID must be selected. For other groups, `programIds` should be an empty array.

## 6. Database details

The backend uses PostgreSQL through Sequelize. `NoticeboardModel` must be registered in the Sequelize instance (the provided database provider includes it in `sequelize.addModels([...])`).

The announcement insert shown in the service stores:

- `id` – record identifier, generated by the model/database.
- `clubname` – publishing club name.
- `heading` – announcement title.
- `info` – announcement content (HTML from the rich-text editor).
- `announcelogo` – optional image data URL or an empty string.
- `group` – selected recipient group.
- `createdAt` and `updatedAt` – Sequelize timestamps, when enabled in the model.

The Sequelize `sync({ force: true })` call in the supplied database-provider code is commented out. Therefore, registering the model does not by itself guarantee that the database table is created. The table must already exist or be created through the project's migration/schema process.

### Verify announcements in pgAdmin

First, locate the table if you are unsure of its exact schema/name:

```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name ILIKE '%noticeboard%'
ORDER BY table_schema, table_name;
```

If the model is mapped to `public.noticeboard`, list the records:

```sql
SELECT *
FROM public.noticeboard
ORDER BY "createdAt" DESC;
```

Count the stored announcements:

```sql
SELECT COUNT(*) AS total_announcements
FROM public.noticeboard;
```

Check one announcement by ID:

```sql
SELECT *
FROM public.noticeboard
WHERE id = 1;
```

After a successful deletion, rerun the query for that ID. Zero returned rows means the record is no longer present in that table. Adjust the schema/table name if the `NoticeboardModel` uses a different `tableName` or PostgreSQL schema.



## 7. Important implementation notes

- Database persistence and email delivery are separate. A saved announcement remains saved even if email delivery fails in the current service flow.
- The frontend sends rich-text HTML. The NoticeBoard view sanitizes HTML before displaying it. The email service should also sanitize or safely render user-provided content before including it in outgoing email.
- The current service's database insert stores the group but not the selected program IDs or the manually entered email list. Persist those separately only if the application needs recipient history/auditability later.
- The frontend delete helper expects numeric IDs and repeated `id` query parameters. Keep the frontend helper, controller route, service implementation, and response shape aligned.
- Do not enable `sequelize.sync({ force: true })` in a database containing data; `force: true` can drop and recreate tables.
