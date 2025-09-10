import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableMap, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { loadCsvAsDocs } from "./csv.js";

const SYSTEM_PROMPT = 
`You are here to help Sarah as a clinical trials analyst. 
Answer ONLY using the provided context snippets from the CSV.
I will supply the file information to you. 
Cite NCTIds or NCT Number inline like [NCT01234567].
If the answer is not in the context, say you don't know.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  ["human", `Question: {question}\n\nContext:\n{context}`],
]);

function formatContext(docs: Document[]) {
  return docs
    .map((doc, i) => `#${i + 1} [${doc.metadata?.NCTId}] ${doc.pageContent}`)
    .join("\n\n");
}

let store: MemoryVectorStore | null = null;

export async function answer(csvPath: string, question: string) {
  if (!store) {
    const docs = await loadCsvAsDocs(csvPath);
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY || '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', // ensure it's read here
    });

    // Chunk long docs to stay well below model context window
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    store = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  }

  // vector similarity 
  const retriever = store.asRetriever({ k: 5 });
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    maxRetries: 3,
    apiKey: process.env.OPENAI_API_KEY || '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',
  });

  const chain = RunnableSequence.from([
    RunnableMap.from({
      docs: async (input: { question: string }) => retriever.invoke(input.question),
      question: (input: { question: string }) => input.question,
    }),
    RunnableMap.from({
      question: (input: any) => input.question,
      context: (input: any) => formatContext(input.docs as Document[]),
    }),
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  return chain.invoke({ question });
}
