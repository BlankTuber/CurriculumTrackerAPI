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
    "resources": [...],
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
      "resources": [...],
      "projects": [
        {
          "_id": "project_id",
          "name": "project name",
          "description": "description",
          "githubLink": "url",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      ]
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
    "resources": [...],
    "projects": [...populated...]
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
  "curriculum": { ...updated curriculum... }
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
        "link": "url"
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
        "link": "url"
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
    "curriculum": "curriculum_id",
    "projectResources": [...],
    "notes": []
  }
}
```

---

### Get All Projects

Get all projects across all user's curricula.

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
            "curriculum": {
                "_id": "curriculum_id",
                "name": "curriculum name"
            }
        }
    ]
}
```

---

### Get Single Project

Get specific project with notes.

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
    "curriculum": {
      "_id": "curriculum_id",
      "name": "curriculum name",
      "owner": "user_id"
    },
    "projectResources": [...],
    "notes": [
      {
        "_id": "note_id",
        "type": "type",
        "content": "content",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ]
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
    "githubLink": "new github URL (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Project updated successfully",
  "project": { ...updated project... }
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
        "link": "url"
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
        "link": "url"
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
        }
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
    "message": "Username already exists"
}
```

### 500 Internal Server Error

```json
{
    "message": "Internal server error"
}
```

---

## Notes on Implementation Issues

1. **Session Management**: The API uses session-based authentication with cookies. Ensure your frontend handles cookies properly with `credentials: 'include'` in fetch requests.

2. **CORS**: Currently configured for `http://localhost:5173`. Update the `CLIENT_URL` environment variable for production.

3. **Object ID Validation**: All route parameters that expect MongoDB ObjectIds are validated using middleware. Invalid ObjectId formats will return a 400 error.

4. **Cascading Deletes**: When deleting users, curricula, or projects, all associated data is automatically deleted to maintain referential integrity.
