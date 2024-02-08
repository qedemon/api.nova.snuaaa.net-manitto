const getNow = require("modules/Utility/getNow");
const {sessions, convertDateToSession} = require("modules/Utility/Session");
const getConnectionDocumentAt = require("./getConnectionDocumentAt");

async function getConnectionDocument(targetSessionNo, at=getNow()){
    try{
        const sessionFrom=convertDateToSession(at);
        const targetSession = sessions[targetSessionNo];
        const targetAt = (
            (targetSessionNo, targetSession, sessionFrom, at)=>{
                if(targetSessionNo<sessionFrom.sessionNo){
                    return targetSession.endAt;
                }
                else if(targetSessionNo === sessionFrom.sessionNo){
                    return at;
                }
                return targetSession.startAt
            }
        )(targetSessionNo, targetSession, sessionFrom, at);
        
        const {data, error} = await getConnectionDocumentAt(targetAt);
        if(error){
            throw error;
        }
        return {
            data: {
                at: targetAt,
                editable: targetSessionNo>=sessionFrom.sessionNo,
                current: targetSessionNo===sessionFrom.sessionNo,
                ...data
            }
        }
        
    }
    catch(error){
        console.error(error);
        return {
            error
        }
    }
}

module.exports = getConnectionDocument;