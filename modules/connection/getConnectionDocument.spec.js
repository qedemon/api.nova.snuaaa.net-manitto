const getConnectionDocument = require("./getConnectionDocument");

test("getConnectionDocument", async ()=>{
    const {data, error} = await getConnectionDocument(1);
    if(error){
        console.error(error);
        throw error;
    }
    //console.log(JSON.stringify(data, null, '\t'));
})