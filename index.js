const express = require("express");
const bodyParser = require("body-parser");
const pptrGpt = require("pptr-gpt");
const morgan = require("morgan");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const main = async () => {
  const app = express();
  const chats = {}

  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "*",
    })
  );

  await pptrGpt.init();

  app.get("/", (req, res) => {
    res.send("pptr-gpt api running");
  });

  app.post("/ask", async (req, res) => {
    const { question } = req.body;

    const answer = await pptrGpt.singleMessage(question);

    res.json({ answer });
  });

  app.post("/create-chat", async (req, res) => {
    const { message } = req.body;
    const id = uuid()

    
    console.log('creating chat', id, message)

    const chat = await pptrGpt.createChat(message);

    chats[id] = {
        ...chat,
        lastUpdated: Date.now(),
    }

    res.json({ id, answer: chat.response });
  })

  app.post('/chat/send-message', async (req, res) => {
    const { id, message } = req.body

    console.log('sending message', id, message)

    const chat = chats[id]

    if (!chat) {
        return res.status(404).json({ error: 'Chat not found' })
    }

    const answer = await chat.send(message)
    
    chat['lastUpdated'] = Date.now()

    res.json({ answer })
  })

  app.get('/chat/:id/close', async (req, res) => {
    const { id } = req.params

    const chat = chats[id]

    if (!chat) {
        return res.status(404).json({ error: 'Chat not found' })
    }

    await chat.close()

    res.json({ status: 'ok' })
  })

  app.listen(3000, () => {

    setInterval(async () => {
        console.log('checking chats for closing')
        for (const id in chats) {
            const chat = chats[id]

            if (chat.lastUpdated + 1000 * 60 * 60 * 3 < Date.now()) {
                console.log('closing chat', id)
                await chat.close()
            }
        }
    }, 1000 * 60 * 5)

    console.log("Server running on port 3000");
  });

  // process on exit
  process.on("SIGINT", async () => {
    await pptrGpt.close();
    process.exit();
  })

  process.on("SIGTERM", async () => {
    await pptrGpt.close();
    process.exit();
  })
};

main();
