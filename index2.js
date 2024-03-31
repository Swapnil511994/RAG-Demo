import dotenv from "dotenv";
dotenv.config();

import * as llamaIndex from "llamaindex";

const documents = await new llamaIndex.SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

const index = await llamaIndex.VectorStoreIndex.fromDocuments(documents);

let customLLM = new llamaIndex.OpenAI();
let customEmbedding = new llamaIndex.OpenAIEmbedding();
let customServiceContext = new llamaIndex.serviceContextFromDefaults({
  llm: customLLM,
  embedModel: customEmbedding,
});

let customQaPrompt = (context = "", query = "") => {
  return `Context information is below.
    ---------------------
    ${context}
    ---------------------
    Given the context information, answer the query.
    Include a random fact about whales in your answer.\
    The whale fact can come from your training data.
    Query: ${query}
    Answer:`;
};

let customResponseBuilder = new llamaIndex.SimpleResponseBuilder(
  customServiceContext,
  customQaPrompt
);

let customSynthesizer = new llamaIndex.ResponseSynthesizer({
  responseBuilder: customResponseBuilder,
  serviceContext: customServiceContext,
});

let customRetreiver = new llamaIndex.VectorIndexRetriever({ index });
let customQueryEngine = new llamaIndex.RetrieverQueryEngine(
  customRetreiver,
  customSynthesizer
);

let response = await customQueryEngine.query({
  query: "What does the author think of college?",
});
console.log(response.toString());
