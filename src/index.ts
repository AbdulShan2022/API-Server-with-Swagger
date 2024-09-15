import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Create Express App
const app = express();
const port = 3000;

// Load Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Middleware for JSON request body
app.use(express.json());

// In-memory data storage for users
let users: { id: number, name: string, email: string }[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }
];

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API Server with Swagger and CRUD');
});

// CRUD Routes

// Get all users
app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

// Get user by ID
app.get('/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Create new user
app.post('/users', (req: Request, res: Response) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user by ID
app.put('/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

// Delete user by ID
app.delete('/users/:id', (req: Request, res: Response) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.status(204).send();
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});
