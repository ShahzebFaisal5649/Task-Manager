const fs = require('fs');

const mermaidDiagram = `
# Database Schema Diagram

\`\`\`mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    USER }o--o{ PROJECT : "member of"
    USER ||--o{ TASK : creates
    USER ||--o{ TASK : "assigned to"
    PROJECT ||--o{ TASK : contains

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        ObjectId _id PK
        string name
        string description
        ObjectId owner FK
        ObjectId[] members FK
        string status
        string color
        datetime createdAt
        datetime updatedAt
    }

    TASK {
        ObjectId _id PK
        string title
        string description
        ObjectId project FK
        ObjectId assignedTo FK
        ObjectId createdBy FK
        string status
        string priority
        date dueDate
        string[] tags
        datetime createdAt
        datetime updatedAt
    }
\`\`\`

## Field Details

### User
- **name**: Required, max 50 chars
- **email**: Required, unique, email format
- **password**: Required, min 6 chars, hashed
- **role**: Enum ['user', 'admin'], default 'user'

### Project
- **name**: Required, max 100 chars
- **description**: Optional, max 500 chars
- **owner**: Reference to User
- **members**: Array of User references
- **status**: Enum ['active', 'completed', 'archived'], default 'active'
- **color**: Hex color code, default '#3B82F6'

### Task
- **title**: Required, max 200 chars
- **description**: Optional
- **project**: Reference to Project (required)
- **assignedTo**: Reference to User (optional)
- **createdBy**: Reference to User (required)
- **status**: Enum ['todo', 'in-progress', 'completed'], default 'todo'
- **priority**: Enum ['low', 'medium', 'high'], default 'medium'
- **dueDate**: Optional date
- **tags**: Array of strings

## Indexes

### Task Collection
\`\`\`javascript
{ project: 1, status: 1 }  // Compound index for project-status queries
{ assignedTo: 1 }           // Index for user assignments
\`\`\`
`;

fs.writeFileSync('SCHEMA_DIAGRAM.md', mermaidDiagram);
console.log('✅ Schema diagram generated: SCHEMA_DIAGRAM.md');