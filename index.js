import express from 'express'
import { connect, Schema, model } from "mongoose"
import cors from "cors"
import { config } from "dotenv"
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
config()

const app = express()
app.use(cors())
app.use(express.json())

// DATABASE CONNECTION
connect(process.env.MONGODB).then(console.log("CONNECTED"))

//SCHEMA DEFINITIONS :
const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String
});
const User = model('User', userSchema);
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


function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}
// ============= READ OPERATIONS (GET) =============

// Register admin (run once, then remove or protect this route)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hash });
        await user.save();
        res.json({ message: "Admin registered" });
    } catch (err) {
        res.status(400).json({ message: "User already exists" });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
});

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

app.post('/api/sessions', authMiddleware, async (req, res) => {
    try {
        const { title, date, description } = req.body;
        const session = new Session({ title, date, description });
        const savedSession = await session.save();
        res.status(201).json(savedSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/events', authMiddleware, async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const event = new Event({ title, description, imageUrl });
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
    try {
        const { title, description, image, details } = req.body;
        const project = new Project({ title, description, image, details });
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/gallery', authMiddleware, async (req, res) => {
    try {
        const { image, title, description, category } = req.body;
        const galleryItem = new Gallery({ image, title, description, category });
        const savedGalleryItem = await galleryItem.save();
        res.status(201).json(savedGalleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/team', authMiddleware, async (req, res) => {
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

app.put('/api/sessions/:id', authMiddleware, async (req, res) => {
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

app.put('/api/events/:id', authMiddleware, async (req, res) => {
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

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
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

app.put('/api/gallery/:id', authMiddleware, async (req, res) => {
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

app.put('/api/team/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/sessions/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/gallery/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/team/:id', authMiddleware, async (req, res) => {
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

app.get('/api/sessions/:id', authMiddleware, async (req, res) => {
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

app.get('/api/events/:id', authMiddleware, async (req, res) => {
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

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
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

app.get('/api/gallery/:id', authMiddleware, async (req, res) => {
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

app.get('/api/team/:id', authMiddleware, async (req, res) => {
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

// ============= STATIC FILE SERVING =============

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Serve /user/ files (images from public/user folder)
app.use('/user', express.static(path.join(__dirname, 'dist/user')));

// ================== SPECIFIC ROUTES ==================
app.get('/mygood_admin_page', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ================== FALLBACK TO REACT (FIXED) ==================
// Using regex instead of '*' to avoid path-to-regexp error
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
});