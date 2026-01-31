const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/taskmanager';

async function fixOrphanProjects() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        const projectsCollection = db.collection('projects');
        const usersCollection = db.collection('users');

        // Find projects with null or missing ownerId
        const orphanProjects = await projectsCollection.find({
            $or: [
                { ownerId: null },
                { ownerId: { $exists: false } }
            ]
        }).toArray();

        console.log(`Found ${orphanProjects.length} orphan projects`);

        // Get the first user to assign orphan projects (or create one if none exists)
        let user = await usersCollection.findOne({});

        if (!user) {
            console.log('No users found. Creating admin user...');
            const result = await usersCollection.insertOne({
                name: 'Admin',
                email: 'admin@taskflow.com',
                password: '$2a$10$example', // This won't work for login, just a placeholder
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
                memberProjectIds: []
            });
            user = { _id: result.insertedId };
            console.log('Created admin user');
        }

        console.log(`Using user: ${user._id}`);

        // Update all orphan projects if any
        if (orphanProjects.length > 0) {
            console.log('Fixing orphan projects...');
        }
        const updateResult = await projectsCollection.updateMany(
            {
                $or: [
                    { ownerId: null },
                    { ownerId: { $exists: false } }
                ]
            },
            {
                $set: {
                    ownerId: user._id,
                    updatedAt: new Date()
                }
            }
        );

        console.log(`Updated ${updateResult.modifiedCount} projects`);

        // Also fix tasks with null createdById or projectId
        const tasksCollection = db.collection('tasks');

        // Get first project for orphan tasks
        const firstProject = await projectsCollection.findOne({});

        // Fix tasks with null projectId
        const orphanTasksNoProject = await tasksCollection.find({
            $or: [
                { projectId: null },
                { projectId: { $exists: false } }
            ]
        }).toArray();

        console.log(`Found ${orphanTasksNoProject.length} tasks with null projectId`);

        if (orphanTasksNoProject.length > 0 && firstProject) {
            const taskProjectResult = await tasksCollection.updateMany(
                {
                    $or: [
                        { projectId: null },
                        { projectId: { $exists: false } }
                    ]
                },
                {
                    $set: {
                        projectId: firstProject._id,
                        updatedAt: new Date()
                    }
                }
            );
            console.log(`Fixed ${taskProjectResult.modifiedCount} tasks with null projectId`);
        }

        // Fix tasks with null createdById
        const orphanTasks = await tasksCollection.find({
            $or: [
                { createdById: null },
                { createdById: { $exists: false } }
            ]
        }).toArray();

        console.log(`Found ${orphanTasks.length} tasks with null createdById`);

        if (orphanTasks.length > 0) {
            const taskUpdateResult = await tasksCollection.updateMany(
                {
                    $or: [
                        { createdById: null },
                        { createdById: { $exists: false } }
                    ]
                },
                {
                    $set: {
                        createdById: user._id,
                        updatedAt: new Date()
                    }
                }
            );
            console.log(`Fixed ${taskUpdateResult.modifiedCount} tasks with null createdById`);
        }

        console.log('Done! All orphan records fixed.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

fixOrphanProjects();
