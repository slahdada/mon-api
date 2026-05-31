// 1. Configuration des variables d'environnement (TOUJOURS EN PREMIER)
require('dotenv').config();

// 2. Importation des modules nécessaires
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

// 3. Initialisation de l'application Express
const app = express();
app.use(express.json());

// 4. Initialisation du SDK Gemini avec la clé API du fichier .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 5. Définition de la route API pour l'assistant
app.post("/api/assistant-ia", async (req, res) => {
    try {
        const { texte, style } = req.body;

        if (!texte || !style) {
            return res.status(400).json({ error: "Les champs 'texte' et 'style' sont requis." });
        }

        // On demande à Gemini une seule reformulation directe, sans fioritures ni guillemets
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Réécris le texte suivant dans un style ${style}. Donne-moi directement la réécriture, sans guillemets autour, sans introduction, sans puces et sans commentaires.
            
            Texte à réécrire : ${texte}`,
        });

        // On nettoie les éventuels espaces vides au début ou à la fin
        const textePropre = response.text.trim();

        // On renvoie le résultat de manière simple
        return res.json({ 
            suggestion: textePropre 
        });

    } catch (error) {
        console.error("Erreur avec l'API Gemini :", error);
        return res.status(500).json({ error: "Une erreur interne est survenue." });
    }
});


// ... fin de votre bloc catch précédent (ligne 43/44)
    }
}); // <-- Vérifiez que la route précédente est bien fermée ici

// 6. Démarrage du serveur et définition des routes globales
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send("Le serveur de l'API fonctionne parfaitement !");
});

app.listen(PORT, () => {
    console.log(`Serveur démarré avec succès sur le port ${PORT}`);
});

