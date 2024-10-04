import express from 'express';
import bodyParser from 'body-parser';
import jwt from  'jsonwebtoken';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

const SECRET_KEY = 'Simplon_2024';

const users = [
    { id: 1, email: 'mohamed@example.com', password: 'password123' }
];

app.post('/api/login', (req, res) => {

    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '30min' });
        return res.json({ token });
    }
    return res.status(401).json({ message: 'Email ou mot de passe invalide' });
});

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Token invalide
            }
            req.user = user;
            next(); // Appel au prochain middleware ou à la route
        });
    } else {
        res.sendStatus(401); // Pas de token fourni
    }
};

app.get('/api/new-private-data', authenticateJWT, (req, res) => {
    res.json({ message: 'Voici des données privées accessibles uniquement aux utilisateurs authentifiés.' });
});

app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
