const HOST = "144.202.103.96:3000";

const test = async () => {
  const promises = [];

  for (let i = 0; i < 10; i++) {
    const res = fetch(`http://${HOST}/create-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message:
          "Напиши прикольний короткий гостроумний твіт пов'язаний з кіберпанком",
      }),
    });

    promises.push(res);
  }

  const results = await Promise.all(promises);

  const chats = await Promise.all(results.map(async (res) => await res.json()));

  console.log(chats);
};


test()