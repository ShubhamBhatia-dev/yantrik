import express from 'express'
import { connect, Schema, model } from "mongoose"
import cors from "cors"
import { config } from "dotenv"
import path from 'path'
import { fileURLToPath } from 'url'

config()

const app = express()
app.use(cors())
app.use(express.json()) // Add this to parse JSON bodies

// DATABASE CONNECTION
connect(process.env.MONGODB).then(console.log("CONNECTED"))

//SCHEMA DEFINITIONS :
const sessionSchema = new Schema({
    title: String,
    date: String,
    description: String
});

const eventSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
});

const projectSchema = new Schema({
    title: String,
    description: String,
    image: String,
    details: String,
});

const GalleryItemSchema = new Schema({
    image: String,
    title: String,
    description: String,
    category: String,
    date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0],
    },
});

const teamMemberSchema = new Schema({
    name: String,
    role: String,
    image: String,
    instagram: String,
    linkedin: String
});

const Gallery = model('GalleryItem', GalleryItemSchema);
const Project = model("Project", projectSchema);
const Event = model('Event', eventSchema);
const Session = model('Session', sessionSchema)
const TeamMember = model('TeamMember', teamMemberSchema);

// ============= READ OPERATIONS (GET) =============

app.get("/api/sessions", async (req, res) => {
    try {
        const sessions = await Session.find();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch sessions" });
    }
})

app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events" });
    }
});

app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/gallery', async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const items = await Gallery.find(filter).sort({ date: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch gallery items' });
    }
});

app.get('/api/team', async (req, res) => {
    try {
        const members = await TeamMember.find();
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
});

// ============= CREATE OPERATIONS (POST) =============

app.post('/api/sessions', async (req, res) => {
    try {
        const { title, date, description } = req.body;
        const session = new Session({ title, date, description });
        const savedSession = await session.save();
        res.status(201).json(savedSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const event = new Event({ title, description, imageUrl });
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, image, details } = req.body;
        const project = new Project({ title, description, image, details });
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/gallery', async (req, res) => {
    try {
        const { image, title, description, category } = req.body;
        const galleryItem = new Gallery({ image, title, description, category });
        const savedGalleryItem = await galleryItem.save();
        res.status(201).json(savedGalleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/team', async (req, res) => {
    try {
        const { name, role, image, instagram, linkedin } = req.body;
        const teamMember = new TeamMember({ name, role, image, instagram, linkedin });
        const savedTeamMember = await teamMember.save();
        res.status(201).json(savedTeamMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ============= UPDATE OPERATIONS (PUT) =============

app.put('/api/sessions/:id', async (req, res) => {
    try {
        const { title, date, description } = req.body;
        const updatedSession = await Session.findByIdAndUpdate(
            req.params.id,
            { title, date, description },
            { new: true, runValidators: true }
        );
        if (!updatedSession) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json(updatedSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/events/:id', async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, imageUrl },
            { new: true, runValidators: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const { title, description, image, details } = req.body;
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { title, description, image, details },
            { new: true, runValidators: true }
        );
        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/gallery/:id', async (req, res) => {
    try {
        const { image, title, description, category } = req.body;
        const updatedGalleryItem = await Gallery.findByIdAndUpdate(
            req.params.id,
            { image, title, description, category },
            { new: true, runValidators: true }
        );
        if (!updatedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.json(updatedGalleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/team/:id', async (req, res) => {
    try {
        const { name, role, image, instagram, linkedin } = req.body;
        const updatedTeamMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            { name, role, image, instagram, linkedin },
            { new: true, runValidators: true }
        );
        if (!updatedTeamMember) {
            return res.status(404).json({ message: "Team member not found" });
        }
        res.json(updatedTeamMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ============= DELETE OPERATIONS (DELETE) =============

app.delete('/api/sessions/:id', async (req, res) => {
    try {
        const deletedSession = await Session.findByIdAndDelete(req.params.id);
        if (!deletedSession) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json({ message: "Session deleted successfully", deletedSession });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({ message: "Event deleted successfully", deletedEvent });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted successfully", deletedProject });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        const deletedGalleryItem = await Gallery.findByIdAndDelete(req.params.id);
        if (!deletedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.json({ message: "Gallery item deleted successfully", deletedGalleryItem });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/team/:id', async (req, res) => {
    try {
        const deletedTeamMember = await TeamMember.findByIdAndDelete(req.params.id);
        if (!deletedTeamMember) {
            return res.status(404).json({ message: "Team member not found" });
        }
        res.json({ message: "Team member deleted successfully", deletedTeamMember });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ============= GET SINGLE ITEM BY ID =============

app.get('/api/sessions/:id', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/gallery/:id', async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.json(galleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/team/:id', async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ message: "Team member not found" });
        }
        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Render Admin PANEL FOR BACKEND :-)

const file = fileURLToPath(import.meta.url)
const dir = path.dirname(file)
app.get("/admin_panel", (req, res) => {
    res.sendFile(path.join(dir, 'index.html'))
})

app.listen(5000, () => {
    console.log("LISTENING ON PORT 5000")
})