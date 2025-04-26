import cors from "cors";
import express from "express";
const app = express();
const PORT = 3001;

const delayedResponse = (data, delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay * 1000);
  });
};

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/triangle", async (req, res) => {
  const result = await delayedResponse("triangle", 3);
  res.send(result);
});

app.get("/circle", async (req, res) => {
  const result = await delayedResponse("circle", 1);
  res.send(result);
});

app.get("/rectangle", async (req, res) => {
  const result = await delayedResponse("rectangle", 4);
  res.send(result);
});

app.get("/line", async (req, res) => {
  const result = await delayedResponse("line", 2);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
