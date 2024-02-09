const setConnections = require("./setConnections");
const getNow = require("modules/Utility/getNow");

test("setConnections", async ()=>{
    const newConnections = {
        connections: [],
        validAt: new Date("2024-02-03T10:00:00.000Z"),
        expiredAt: new Date("2024-02-04T16:30:00.000Z")
    }
    const {error, revoke, inserted, overlapped} = await setConnections(newConnections);
    if(error){
        console.error(error);
        throw error;
    }
    //console.log("inserted", JSON.stringify(inserted, null, "\t"));
    //console.log("overlapped", JSON.stringify(overlapped, null, "\t"));
    const {deleted, revoked} = await revoke();
    //console.log("deleted", JSON.stringify(deleted, null, "\t"));
    //console.log("revoked", JSON.stringify(revoked, null, "\t"));
})