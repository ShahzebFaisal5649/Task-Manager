# Task Manager Database Schema

> Generated automatically from Mongoose models

---

## User Schema

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| name | String | ✅ | - | Max: 50,Name cannot be more than 50 characters |
| email | String | ✅ | - | Email format, Unique |
| password | String | ✅ | - | Min: 6,Password must be at least 6 characters |
| role | String | ❌ | user | Enum: user, admin |
| createdAt | Date | ❌ | - | - |
| updatedAt | Date | ❌ | - | - |

---

## Project Schema

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| name | String | ✅ | - | Max: 100,Project name cannot be more than 100 characters |
| description | String | ❌ | - | Max: 500,Description cannot be more than 500 characters |
| owner | ObjectId | ✅ | - | Ref: User |
| members | Array | ❌ | function() {
      // Leave it up to `cast()` to convert the array
      return fn
        ? defaultArr.call(this)
        : defaultArr != null
          ? [].concat(defaultArr)
          : [];
    } | - |
| status | String | ❌ | active | Enum: active, completed, archived |
| color | String | ❌ | #3B82F6 | - |
| createdAt | Date | ❌ | - | - |
| updatedAt | Date | ❌ | - | - |

---

## Task Schema

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| title | String | ✅ | - | Max: 200,Task title cannot be more than 200 characters |
| description | String | ❌ | - | - |
| project | ObjectId | ✅ | - | Ref: Project |
| assignedTo | ObjectId | ❌ | - | Ref: User |
| createdBy | ObjectId | ✅ | - | Ref: User |
| status | String | ❌ | todo | Enum: todo, in-progress, completed |
| priority | String | ❌ | medium | Enum: low, medium, high |
| dueDate | Date | ❌ | - | - |
| tags | Array | ❌ | function() {
      // Leave it up to `cast()` to convert the array
      return fn
        ? defaultArr.call(this)
        : defaultArr != null
          ? [].concat(defaultArr)
          : [];
    } | - |
| createdAt | Date | ❌ | - | - |
| updatedAt | Date | ❌ | - | - |

---

## Relationships

```
User (1) ──owns──> (Many) Project
User (Many) ──member of──> (Many) Project
Project (1) ──has──> (Many) Task
User (1) ──assigned to──> (Many) Task
User (1) ──created──> (Many) Task
```

## Indexes

### Task Collection
- `{ project: 1, status: 1 }` - For filtering tasks by project and status
- `{ assignedTo: 1 }` - For finding tasks by assignee

