const sendData = require("./sendPush");

test("sendPush", async()=>{
    const data = {
        title: "AAA - Manitto",
        body: "마니또가 바뀌었어요."
    }
    const {error, pushed} = await sendData(23, data);
})