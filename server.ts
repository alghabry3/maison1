import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from "./src/data";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/recommend", async (req, res) => {
    try {
      const { cartItems } = req.body;
      
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.json({ recommendedIds: [] });
      }

      const cartProductNames = cartItems.map(item => item.name).join(", ");
      
      const catalog = MOCK_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        tags: p.tags
      }));

      const prompt = `You are a chocolate recommendation AI for a luxury chocolate store.
A customer has the following items in their cart: ${cartProductNames}

Here is our product catalog:
${JSON.stringify(catalog, null, 2)}

Based on what they have in their cart, recommend exactly 3 other products from the catalog that would go well with their purchase or that they might also like.
Return ONLY a JSON array of the recommended product IDs. For example: ["p2", "p4", "p6"]
Do NOT return anything else, no markdown formatting.`;

      let recommendedIds: string[] = [];
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        
        if (response.text) {
          try {
            recommendedIds = JSON.parse(response.text);
          } catch (e) {
            console.warn("Failed to parse AI response, using fallback");
          }
        }
      } catch (error) {
        // Fallback recommendations if API fails (rate limit, etc.)
        recommendedIds = ["p2", "p3", "p4"];
      }

      // Filter out items already in cart
      const cartIds = cartItems.map((item: any) => item.id);
      recommendedIds = recommendedIds.filter(id => !cartIds.includes(id));

      res.json({ recommendedIds });
    } catch (error) {
      console.error("Unexpected error in /api/recommend:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
