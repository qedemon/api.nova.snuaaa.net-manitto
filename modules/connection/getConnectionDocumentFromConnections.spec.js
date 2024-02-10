const getConnections = require("./getConnections");
const getConnectionDocumentFromConnections = require("./getConnectionDocumentFromConnections");

test("getConnectionDocumentFromConnections", async ()=>{
    const {error, document} = await getConnectionDocumentFromConnections((await getConnections()).documents[0]);
    if(error){
        console.error(error);
        throw error;
    }
    console.log(JSON.stringify(document, null, "\t"));
})