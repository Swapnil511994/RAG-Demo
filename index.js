import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";

const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

const index = await VectorStoreIndex.fromDocuments(documents);

const queryEngine = index.asQueryEngine();

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ status: true, message: "Server is running" });
});

app.post("/", async (req, res) => {
  const queryText = req.body.query;
  const response = await queryEngine.query({
    query: queryText,
  });
  if (response?.toString().length > 0) {
    return res.json({
      status: true,
      message: "Query Successful",
      data: response.toString(),
    });
  } else {
    res.json({ status: false, message: "Query Failed" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port: 3000");
});
