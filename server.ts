import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function downloadSpot4() {
  const url = "https://postfiles.pstatic.net/MjAyNTA0MDNfMzUg/MDAxNzQzNjYyOTQzNzI1.qIeRH-dY_H0WNaOiqphj25CVjHcsqyErL7qge9SDKakg._lVaZeP0jB5n0nV40V6D4Y3-3yP0tPNvtZG7qsnK-oMg.JPEG/%EC%A0%9C4%EA%B2%BD-%EA%B8%88%EC%B2%9C%EC%B2%B4%EC%9C%A1%EA%B3%B5%EC%9B%90_%EC%A0%84%EB%A7%9D%EB%8C%80(2).jpg?type=w966";
  const filePath = path.join(process.cwd(), 'spot4.jpg');

  if (fs.existsSync(filePath)) return;

  try {
    console.log("Downloading spot4.jpg...");
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://blog.naver.com'
      }
    });

    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);
    console.log("Successfully downloaded spot4.jpg");
  } catch (error) {
    console.error("Error downloading spot4.jpg:", error);
  }
}

async function startServer() {
  await downloadSpot4();
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
