require('dotenv').config();

const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();

app.use(express.json({ limit: '1mb' }));

// Vérification de la clé API Gemini
if (!process.env.GEMINI_API_KEY) {
    console.error('ERREUR : GEMINI_API_KEY est manquante.');
    process.exit(1);
}

// Initialisation Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Route principale
app.get('/', (req, res) => {
    res.status(200).send('Le serveur de l API fonctionne parfaitement !');
});

// Vérification de santé pour Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API opérationnelle'
    });
});

// Assistant IA
app.post('/api/assistant-ia', async (req, res) => {
    try {
        const { texte, style } = req.body || {};

        if (
            typeof texte !== 'string' ||
            !texte.trim() ||
            typeof style !== 'string' ||
            !style.trim()
        ) {
            return res.status(400).json({
                error: "Les champs 'texte' et 'style' sont obligatoires."
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Réécris le texte suivant dans un style ${style}.
Donne directement la réécriture, sans guillemets, sans introduction,
sans puces et sans commentaires.

Texte à réécrire : ${texte.trim()}`
        });

        const textePropre = response.text?.trim();

        if (!textePropre) {
            return res.status(502).json({
                error: "Gemini n'a retourné aucun texte."
            });
        }

        return res.status(200).json({
            suggestion: textePropre
        });

    } catch (error) {
        console.error('Erreur API Gemini :', error);

        return res.status(500).json({
            error: "Une erreur interne est survenue."
        });
    }
});

// Gestion des routes inexistantes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route introuvable'
    });
});

// Gestion des erreurs JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            error: 'JSON invalide'
        });
    }

    console.error(err);

    return res.status(500).json({
        error: 'Erreur serveur'
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
