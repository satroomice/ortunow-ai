import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

        const MAX_HISTORY = 8;
        const history = conversation.slice(-MAX_HISTORY);
        const contents = history.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.6,
                maxOutputTokens: 2048,
                systemInstruction: `
Kamu adalah OrtuNow AI, asisten parenting berbasis AI.

Tugasmu membantu orang tua dalam:
- pengasuhan anak
- perkembangan anak
- pendidikan anak
- hubungan keluarga

Aturan:
- Gunakan Bahasa Indonesia.
- Jawab dengan empatik, tenang, dan tidak menghakimi.
- Berikan langkah-langkah praktis.
- Jangan memberikan diagnosis medis.
- Jangan memberikan dosis obat.
- Jika masalah serius, sarankan konsultasi dengan dokter atau psikolog.
- Jika pertanyaan di luar parenting, jelaskan bahwa kamu hanya membantu seputar parenting dan tumbuh kembang anak.
`
            }
        });

        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});