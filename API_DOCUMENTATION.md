# Curriculum Tracker API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

This API uses session-based authentication. After successful login or registration, a session cookie is set that must be included in all subsequent requests.

## Response Format

All responses are in JSON format with appropriate HTTP status codes.

### Success Response

```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response

```json
{
    "message": "Error description"
}
```

---

## User Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /user/register`  
**Authentication:** Not required

**Request Body:**

```json
{
    "username": "string (3-30 chars, alphanumeric + underscore)",
    "password": "string (min 6 chars)"
}
```

**Success Response (201):**

```json
{
    "message": "User registered successfully",
    "user": {
        "id": "user_id",
        "username": "username"
    }
}
```

---

### Login

Authenticate user and create session.

**Endpoint:** `POST /user/login`  
**Authentication:** Not required

**Request Body:**

```json
{
    "username": "string",
    "password": "string"
}
```

**Success Response (200):**

```json
{
    "message": "Login successful",
    "user": {
        "id": "user_id",
        "username": "username"
    }
}
```

---

### Get User Profile

Get current user information and statistics.

**Endpoint:** `GET /user`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "user": {
        "id": "user_id",
        "username": "username",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    },
    "stats": {
        "curriculaCount": 5
    }
}
```

---

### Update User

Update username or password.

**Endpoint:** `PUT /user/updateUser`  
**Authentication:** Required

**Request Body:**

```json
{
    "username": "new_username (optional)",
    "password": "new_password (optional)",
    "currentPassword": "required if changing password"
}
```

**Success Response (200):**

```json
{
    "message": "User updated successfully",
    "user": {
        "id": "user_id",
        "username": "new_username"
    }
}
```

---

### Delete User

Delete user account and all associated data.

**Endpoint:** `DELETE /user/deleteUser`  
**Authentication:** Required

**Request Body:**

```json
{
    "password": "string (required for confirmation)"
}
```

**Success Response (200):**

```json
{
    "message": "Account deleted successfully"
}
```

---

## Curriculum Endpoints

### Create Curriculum

Create a new curriculum.

**Endpoint:** `POST /curricula/createCurriculum`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "string (required, max 100 chars)",
    "description": "string (optional, max 1000 chars)",
    "resources": [
        {
            "name": "string (required, max 100 chars)",
            "type": "documentation|theory|book|online resource|video|tutorial|article|other",
            "link": "valid URL"
        }
    ]
}
```

**Success Response (201):**

```json
{
    "message": "Curriculum created successfully",
    "curriculum": {
        "_id": "curriculum_id",
        "name": "curriculum name",
        "description": "description",
        "owner": "user_id",
        "resources": [
            {
                "_id": "resource_id",
                "name": "resource name",
                "type": "documentation",
                "link": "https://example.com",
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "levels": [],
        "projects": [],
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Get All Curricula

Get all curricula for authenticated user.

**Endpoint:** `GET /curricula`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "curricula": [
        {
            "_id": "curriculum_id",
            "name": "curriculum name",
            "description": "description",
            "owner": "user_id",
            "resources": [
                {
                    "_id": "resource_id",
                    "name": "resource name",
                    "type": "documentation",
                    "link": "https://example.com",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ],
            "levels": [
                {
                    "_id": "level_id",
                    "name": "The Roots",
                    "description": "Foundation concepts",
                    "stageStart": 1,
                    "stageEnd": 5,
                    "order": 1,
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ],
            "projects": [
                {
                    "_id": "project_id",
                    "name": "project name",
                    "description": "description",
                    "githubLink": "https://github.com/user/repo",
                    "completed": false,
                    "stage": 1,
                    "order": 1,
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ],
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
        }
    ]
}
```

---

### Get Single Curriculum

Get specific curriculum by ID.

**Endpoint:** `GET /curricula/:curriculumId`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "curriculum": {
        "_id": "curriculum_id",
        "name": "curriculum name",
        "description": "description",
        "owner": "user_id",
        "resources": [
            {
                "_id": "resource_id",
                "name": "resource name",
                "type": "documentation",
                "link": "https://example.com",
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "levels": [
            {
                "_id": "level_id",
                "name": "The Roots",
                "description": "Foundation concepts",
                "stageStart": 1,
                "stageEnd": 5,
                "order": 1,
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "projects": [
            {
                "_id": "project_id",
                "name": "project name",
                "description": "description",
                "githubLink": "https://github.com/user/repo",
                "completed": false,
                "stage": 1,
                "order": 1,
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Update Curriculum

Update curriculum name or description.

**Endpoint:** `PUT /curricula/:curriculumId/updateCurriculum`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "new name (optional)",
    "description": "new description (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Curriculum updated successfully",
  "curriculum": { ...updated curriculum with full populated projects... }
}
```

---

### Delete Curriculum

Delete curriculum and all associated projects and notes.

**Endpoint:** `DELETE /curricula/:curriculumId/deleteCurriculum`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "message": "Curriculum deleted successfully"
}
```

---

### Create Resource

Add a resource to a curriculum.

**Endpoint:** `POST /curricula/resource/:curriculumId/createResource`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "string (required)",
    "type": "documentation|theory|book|online resource|video|tutorial|article|other",
    "link": "valid URL"
}
```

**Success Response (201):**

```json
{
    "message": "Resource created successfully",
    "resource": {
        "_id": "resource_id",
        "name": "resource name",
        "type": "type",
        "link": "url",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Update Resource

Update a resource.

**Endpoint:** `PUT /curricula/resource/:resourceId/updateResource`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "new name (optional)",
    "type": "new type (optional)",
    "link": "new URL (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Resource updated successfully",
  "resource": { ...updated resource... }
}
```

---

### Delete Resource

Remove a resource from curriculum.

**Endpoint:** `DELETE /curricula/resource/:resourceId/deleteResource`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "message": "Resource deleted successfully"
}
```

---

### Get Resource

Get a specific resource.

**Endpoint:** `GET /curricula/resource/:resourceId`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "resource": {
        "_id": "resource_id",
        "name": "resource name",
        "type": "type",
        "link": "url",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

## Level Endpoints

### Create Level

Add a level to a curriculum.

**Endpoint:** `POST /curricula/level/:curriculumId/createLevel`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "string (required, max 100 chars)",
    "description": "string (optional, max 500 chars)",
    "stageStart": "number (required, min 1)",
    "stageEnd": "number (required, min 1, >= stageStart)",
    "order": "number (required, min 1, unique within curriculum)"
}
```

**Success Response (201):**

```json
{
    "message": "Level created successfully",
    "level": {
        "_id": "level_id",
        "name": "The Roots",
        "description": "Foundation concepts",
        "stageStart": 1,
        "stageEnd": 5,
        "order": 1,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Update Level

Update a level.

**Endpoint:** `PUT /curricula/level/:levelId/updateLevel`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "new name (optional)",
    "description": "new description (optional)",
    "stageStart": "new stage start (optional)",
    "stageEnd": "new stage end (optional)",
    "order": "new order (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Level updated successfully",
  "level": { ...updated level... }
}
```

---

### Delete Level

Remove a level from curriculum.

**Endpoint:** `DELETE /curricula/level/:levelId/deleteLevel`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "message": "Level deleted successfully"
}
```

---

### Get Level

Get a specific level.

**Endpoint:** `GET /curricula/level/:levelId`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "level": {
        "_id": "level_id",
        "name": "The Roots",
        "description": "Foundation concepts",
        "stageStart": 1,
        "stageEnd": 5,
        "order": 1,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

## Project Endpoints

### Create Project

Create a new project in a curriculum.

**Endpoint:** `POST /projects/:curriculumId/createProject`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "string (required, max 100 chars)",
    "description": "string (required, max 2000 chars)",
    "githubLink": "valid GitHub URL (required)",
    "stage": "number (required, min 1)",
    "order": "number (optional, auto-assigned if not provided)",
    "prerequisites": ["project_id_1", "project_id_2"],
    "projectResources": [
        {
            "name": "string",
            "type": "documentation|theory|book|online resource|video|tutorial|article|other",
            "link": "valid URL"
        }
    ]
}
```

**Success Response (201):**

```json
{
    "message": "Project created successfully",
    "project": {
        "_id": "project_id",
        "name": "project name",
        "description": "description",
        "githubLink": "github url",
        "completed": false,
        "stage": 1,
        "order": 1,
        "prerequisites": [],
        "curriculum": "curriculum_id",
        "projectResources": [
            {
                "_id": "resource_id",
                "name": "resource name",
                "type": "documentation",
                "link": "https://example.com",
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "notes": [],
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Get All Projects

Get all projects across all user's curricula, sorted by stage and order.

**Endpoint:** `GET /projects`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "projects": [
        {
            "_id": "project_id",
            "name": "project name",
            "description": "description",
            "githubLink": "url",
            "completed": false,
            "stage": 1,
            "order": 1,
            "prerequisites": [
                {
                    "_id": "prerequisite_id",
                    "name": "prerequisite name",
                    "description": "description",
                    "completed": true,
                    "stage": 1
                }
            ],
            "curriculum": {
                "_id": "curriculum_id",
                "name": "curriculum name",
                "owner": "user_id"
            },
            "projectResources": [
                {
                    "_id": "resource_id",
                    "name": "resource name",
                    "type": "documentation",
                    "link": "https://example.com",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ],
            "notes": [],
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
        }
    ]
}
```

---

### Get Projects by Stage or Level

Get projects filtered by stage number or level ID within a curriculum.

**Endpoint:** `GET /projects/curriculum/:curriculumId/stage`  
**Authentication:** Required

**Query Parameters:**

-   `stage` (number, optional): Filter by specific stage number
-   `level` (string, optional): Filter by level ID (gets all projects in that level's stage range)

**Success Response (200):**

```json
{
    "projects": [
        {
            "_id": "project_id",
            "name": "project name",
            "description": "description",
            "githubLink": "url",
            "completed": false,
            "stage": 1,
            "order": 1,
            "prerequisites": [
                {
                    "_id": "prerequisite_id",
                    "name": "prerequisite name",
                    "description": "description",
                    "completed": true,
                    "stage": 1
                }
            ],
            "curriculum": {
                "_id": "curriculum_id",
                "name": "curriculum name",
                "owner": "user_id"
            },
            "projectResources": [
                {
                    "_id": "resource_id",
                    "name": "resource name",
                    "type": "documentation",
                    "link": "https://example.com",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ],
            "notes": [
                {
                    "_id": "note_id",
                    "type": "reflection",
                    "content": "note content",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ],
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
        }
    ]
}
```

---

### Get Single Project

Get specific project with notes and prerequisites.

**Endpoint:** `GET /projects/:projectId`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "project": {
        "_id": "project_id",
        "name": "project name",
        "description": "description",
        "githubLink": "url",
        "completed": false,
        "stage": 1,
        "order": 1,
        "curriculum": {
            "_id": "curriculum_id",
            "name": "curriculum name",
            "owner": "user_id",
            "levels": [
                {
                    "_id": "level_id",
                    "name": "The Roots",
                    "description": "Foundation concepts",
                    "stageStart": 1,
                    "stageEnd": 5,
                    "order": 1,
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ],
            "resources": [
                {
                    "_id": "resource_id",
                    "name": "resource name",
                    "type": "documentation",
                    "link": "https://example.com",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
            ]
        },
        "prerequisites": [
            {
                "_id": "prerequisite_id",
                "name": "prerequisite name",
                "description": "description",
                "completed": true,
                "stage": 1
            }
        ],
        "projectResources": [
            {
                "_id": "resource_id",
                "name": "resource name",
                "type": "documentation",
                "link": "https://example.com",
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "notes": [
            {
                "_id": "note_id",
                "type": "reflection",
                "content": "content",
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Update Project

Update project details.

**Endpoint:** `PUT /projects/:projectId/updateProject`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "new name (optional)",
    "description": "new description (optional)",
    "githubLink": "new github URL (optional)",
    "completed": "boolean (optional)",
    "stage": "number (optional)",
    "order": "number (optional)",
    "prerequisites": ["project_id_1", "project_id_2"]
}
```

**Success Response (200):**

```json
{
  "message": "Project updated successfully",
  "project": { ...updated project with full population... }
}
```

---

### Delete Project

Delete project and all associated notes.

**Endpoint:** `DELETE /projects/:projectId/deleteProject`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "message": "Project deleted successfully"
}
```

---

### Create Project Resource

Add a resource to a project.

**Endpoint:** `POST /projects/resource/:projectId/createProjectResource`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "string (required)",
    "type": "documentation|theory|book|online resource|video|tutorial|article|other",
    "link": "valid URL"
}
```

**Success Response (201):**

```json
{
    "message": "Project resource created successfully",
    "projectResource": {
        "_id": "resource_id",
        "name": "resource name",
        "type": "type",
        "link": "url",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Update Project Resource

Update a project resource.

**Endpoint:** `PUT /projects/resource/:projectResourceId/updateProjectResource`  
**Authentication:** Required

**Request Body:**

```json
{
    "name": "new name (optional)",
    "type": "new type (optional)",
    "link": "new URL (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Project resource updated successfully",
  "projectResource": { ...updated resource... }
}
```

---

### Delete Project Resource

Remove a resource from project.

**Endpoint:** `DELETE /projects/resource/:projectResourceId/deleteProjectResource`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "message": "Project resource deleted successfully"
}
```

---

### Get Project Resource

Get a specific project resource.

**Endpoint:** `GET /projects/resource/:projectResourceId`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "projectResource": {
        "_id": "resource_id",
        "name": "resource name",
        "type": "type",
        "link": "url",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

## Note Endpoints

### Create Note

Add a note to a project.

**Endpoint:** `POST /notes/:projectId/createNote`  
**Authentication:** Required

**Request Body:**

```json
{
    "type": "reflection|todo|idea|bug|improvement|question|achievement|other",
    "content": "string (required, max 5000 chars)"
}
```

**Success Response (201):**

```json
{
    "message": "Note created successfully",
    "note": {
        "_id": "note_id",
        "type": "type",
        "content": "content",
        "project": "project_id",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Get Note

Get a specific note.

**Endpoint:** `GET /notes/:noteId`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "note": {
        "_id": "note_id",
        "type": "type",
        "content": "content",
        "project": {
            "_id": "project_id",
            "name": "project name",
            "curriculum": {
                "_id": "curriculum_id",
                "name": "curriculum name",
                "owner": "user_id"
            }
        },
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}
```

---

### Update Note

Update note type or content.

**Endpoint:** `PUT /notes/:noteId/updateNote`  
**Authentication:** Required

**Request Body:**

```json
{
    "type": "new type (optional)",
    "content": "new content (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Note updated successfully",
  "note": { ...updated note... }
}
```

---

### Delete Note

Remove a note from project.

**Endpoint:** `DELETE /notes/:noteId/deleteNote`  
**Authentication:** Required

**Success Response (200):**

```json
{
    "message": "Note deleted successfully"
}
```

---

## Health Check

### API Health

Check if API is running.

**Endpoint:** `GET /health`  
**Authentication:** Not required

**Success Response (200):**

```json
{
    "message": "API is running",
    "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## Common Error Responses

### 400 Bad Request

```json
{
    "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
    "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
    "message": "Access denied"
}
```

### 404 Not Found

```json
{
    "message": "Resource not found"
}
```

### 409 Conflict

```json
{
    "message": "Username already exists" // or "A level with this order already exists"
}
```

### 500 Internal Server Error

```json
{
    "message": "Internal server error"
}
```

---

## Notes on Implementation

### Levels and Stages System

The curriculum organization follows a hierarchical structure:

1. **Curricula** contain **Levels** and **Projects**
2. **Levels** define stage ranges (e.g., "The Roots" covers stages 1-5)
3. **Projects** belong to specific stages
4. Projects are sorted by stage first, then by order within the stage

**Level Validation Rules:**

-   Level orders must be unique within a curriculum
-   Stage ranges cannot overlap between levels in the same curriculum
-   Stage end must be greater than or equal to stage start

**Project Validation Rules:**

-   Stage is required for all projects
-   Prerequisites must belong to curricula owned by the same user
-   Order is auto-assigned within stage if not provided

### Session Management

The API uses session-based authentication with cookies. Ensure your frontend handles cookies properly with `credentials: 'include'` in fetch requests.

### CORS

Currently configured for `http://localhost:5173`. Update the `CLIENT_URL` environment variable for production.

### Object ID Validation

All route parameters that expect MongoDB ObjectIds are validated using middleware. Invalid ObjectId formats will return a 400 error.

### Cascading Deletes

When deleting users, curricula, or projects, all associated data is automatically deleted to maintain referential integrity.

### Project Ordering and Filtering

-   Projects can be filtered by stage or level using the `/projects/curriculum/:curriculumId/stage` endpoint
-   Use query parameter `stage=1` for specific stage or `level=level_id` for all projects in a level's range
-   All project lists are sorted by stage first, then order within stage
