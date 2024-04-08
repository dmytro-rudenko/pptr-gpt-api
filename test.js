const test = async () => {
    const ask = await fetch("http://199.247.9.86:3000/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question: "What is the meaning of life?",
        }),
    })

    const answer = await ask.json()

    console.log('answer', answer)

    const createChat = await fetch("http://199.247.9.86:3000/create-chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "What is the meaning of life?",
        }),
    })

    const chat = await createChat.json()

    console.log('chat', chat)

    const sendMessage = await fetch(`http://199.247.9.86:3000/chat/send-message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: chat.id,
            message: "Translate answer to ukrainian",
        }),
    })

    const message = await sendMessage.json()

    console.log('message', message)
}

test()