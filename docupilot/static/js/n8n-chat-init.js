import { createChat } from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";

createChat({
  webhookUrl: "https://nodemation.kayrules.com/webhook/3157e7f7-34a4-4c1e-a9af-b0b0c077e2aa/chat",
  initialMessages: [
    "Hi there! Welcome to DocuPilot",
    "My name is Docupilot. How can I assist you today?",
  ],
});
