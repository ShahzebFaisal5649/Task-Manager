const fs = require('fs');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const generateSchemaDoc = (model) => {
    const schema = model.schema;
    const paths = schema.paths;

    let doc = `## ${model.modelName} Schema\n\n`;
    doc += '| Field | Type | Required | Default | Validation |\n';
    doc += '|-------|------|----------|---------|------------|\n';

    Object.keys(paths).forEach((key) => {
        if (key === '__v' || key === '_id') return;

        const path = paths[key];
        const type = path.instance || 'Mixed';
        const required = path.isRequired ? '✅' : '❌';
        const defaultValue = path.defaultValue !== undefined ? path.defaultValue : '-';
        const validation = [];

        if (path.options.enum) validation.push(`Enum: ${path.options.enum.join(', ')}`);
        if (path.options.minlength) validation.push(`Min: ${path.options.minlength}`);
        if (path.options.maxlength) validation.push(`Max: ${path.options.maxlength}`);
        if (path.options.match) validation.push('Email format');
        if (path.options.unique) validation.push('Unique');
        if (path.options.ref) validation.push(`Ref: ${path.options.ref}`);

        doc += `| ${key} | ${type} | ${required} | ${defaultValue} | ${validation.join(', ') || '-'} |\n`;
    });

    doc += '\n---\n\n';
    return doc;
};

const generateFullDoc = () => {
    let fullDoc = '# Task Manager Database Schema\n\n';
    fullDoc += '> Generated automatically from Mongoose models\n\n';
    fullDoc += '---\n\n';

    fullDoc += generateSchemaDoc(User);
    fullDoc += generateSchemaDoc(Project);
    fullDoc += generateSchemaDoc(Task);

    // Add relationships
    fullDoc += '## Relationships\n\n';
    fullDoc += '```\n';
    fullDoc += 'User (1) ──owns──> (Many) Project\n';
    fullDoc += 'User (Many) ──member of──> (Many) Project\n';
    fullDoc += 'Project (1) ──has──> (Many) Task\n';
    fullDoc += 'User (1) ──assigned to──> (Many) Task\n';
    fullDoc += 'User (1) ──created──> (Many) Task\n';
    fullDoc += '```\n\n';

    // Add indexes
    fullDoc += '## Indexes\n\n';
    fullDoc += '### Task Collection\n';
    fullDoc += '- `{ project: 1, status: 1 }` - For filtering tasks by project and status\n';
    fullDoc += '- `{ assignedTo: 1 }` - For finding tasks by assignee\n\n';

    return fullDoc;
};

// Generate and save
const doc = generateFullDoc();
fs.writeFileSync('DATABASE_SCHEMA.md', doc);
console.log('✅ Schema documentation generated: DATABASE_SCHEMA.md');