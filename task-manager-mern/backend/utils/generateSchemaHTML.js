const fs = require('fs');

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager Schema</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .schema-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .schema-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s;
        }
        .schema-card:hover {
            transform: translateY(-5px);
        }
        .schema-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #667eea;
        }
        .schema-icon {
            font-size: 2em;
            margin-right: 15px;
        }
        .schema-title {
            font-size: 1.5em;
            color: #333;
            font-weight: bold;
        }
        .field {
            padding: 12px;
            margin: 8px 0;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .field-name {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .field-details {
            font-size: 0.9em;
            color: #666;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.75em;
            margin-right: 5px;
            font-weight: 600;
        }
        .badge-required { background: #fee; color: #c33; }
        .badge-optional { background: #efe; color: #3c3; }
        .badge-unique { background: #fef3cd; color: #856404; }
        .badge-ref { background: #d1ecf1; color: #0c5460; }
        
        .relationships {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .relationships h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        .rel-item {
            padding: 15px;
            margin: 10px 0;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #764ba2;
            font-size: 1.1em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Task Manager Database Schema</h1>
        
        <div class="schema-grid">
            <!-- User Schema -->
            <div class="schema-card">
                <div class="schema-header">
                    <div class="schema-icon">👤</div>
                    <div class="schema-title">User</div>
                </div>
                <div class="field">
                    <div class="field-name">name</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        String, max 50 chars
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">email</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        <span class="badge badge-unique">Unique</span>
                        String, email format
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">password</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        String, min 6 chars, hashed
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">role</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        Enum: 'user', 'admin' (default: 'user')
                    </div>
                </div>
            </div>

            <!-- Project Schema -->
            <div class="schema-card">
                <div class="schema-header">
                    <div class="schema-icon">📁</div>
                    <div class="schema-title">Project</div>
                </div>
                <div class="field">
                    <div class="field-name">name</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        String, max 100 chars
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">description</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        String, max 500 chars
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">owner</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        <span class="badge badge-ref">→ User</span>
                        ObjectId reference
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">members</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        <span class="badge badge-ref">→ User[]</span>
                        Array of ObjectId
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">status</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        Enum: 'active', 'completed', 'archived'
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">color</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        String (hex color)
                    </div>
                </div>
            </div>

            <!-- Task Schema -->
            <div class="schema-card">
                <div class="schema-header">
                    <div class="schema-icon">✅</div>
                    <div class="schema-title">Task</div>
                </div>
                <div class="field">
                    <div class="field-name">title</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        String, max 200 chars
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">description</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        String
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">project</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        <span class="badge badge-ref">→ Project</span>
                        ObjectId reference
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">assignedTo</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        <span class="badge badge-ref">→ User</span>
                        ObjectId reference
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">createdBy</div>
                    <div class="field-details">
                        <span class="badge badge-required">Required</span>
                        <span class="badge badge-ref">→ User</span>
                        ObjectId reference
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">status</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        Enum: 'todo', 'in-progress', 'completed'
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">priority</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        Enum: 'low', 'medium', 'high'
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">dueDate</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        Date
                    </div>
                </div>
                <div class="field">
                    <div class="field-name">tags</div>
                    <div class="field-details">
                        <span class="badge badge-optional">Optional</span>
                        Array of strings
                    </div>
                </div>
            </div>
        </div>

        <!-- Relationships -->
        <div class="relationships">
            <h2>🔗 Relationships</h2>
            <div class="rel-item">👤 User (1) ──owns──> (Many) 📁 Project</div>
            <div class="rel-item">👤 User (Many) ──member of──> (Many) 📁 Project</div>
            <div class="rel-item">📁 Project (1) ──contains──> (Many) ✅ Task</div>
            <div class="rel-item">👤 User (1) ──assigned to──> (Many) ✅ Task</div>
            <div class="rel-item">👤 User (1) ──created──> (Many) ✅ Task</div>
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync('schema-viewer.html', html);
console.log('✅ Schema viewer generated: schema-viewer.html');
console.log('📂 Open schema-viewer.html in your browser!');