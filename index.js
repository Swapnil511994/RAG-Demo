import dotenv from "dotenv";
dotenv.config();

import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";

const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

const index = await VectorStoreIndex.fromDocuments(documents);

const queryEngine = index.asQueryEngine();
const response = await queryEngine.query({
  query: "what is author's opinion on job?",
});

console.log(response.toString());
