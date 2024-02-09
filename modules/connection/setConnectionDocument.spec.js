const getConnectionDocumentAt = require("./getConnectionDocumentAt");
const setConnectionDocument = require("./setConnectionDocument");

test("setConnectionDocument", async()=>{
    const {data} = await getConnectionDocumentAt(new Date("2024-02-02T21:30:00+09:00"));
    //console.log(JSON.stringify(data, null, "\t"));
    const result = await setConnectionDocument(1, data);
    await result.revoke();
    //console.log(JSON.stringify(result, null, "\t"));
    //console.log(await result.revoke());
})