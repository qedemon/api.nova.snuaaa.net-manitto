const {connect, disconnect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const getConnections = require("./getConnections");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getConnectionDocumentFromConnections = require("./getConnectionDocumentFromConnections");
const getConnectionGroups = require("modules/Utility/connectionGroups");

async function getConnectionDocumentAt(at=getNow(), from=getNow()){
    try{
        await connect();
        const {documents, error} = await getConnections({}, at);
        if(error){
            throw error;
        }
        const connections = documents[0]?
        documents[0].connections:
        [];
        
        const {disconnected, connected, connectionGroups} = await
        (
            async (connections, at, from)=>{
                const shouldBeConnected = await User.find(
                    {
                        isAdmin: false,
                        "schedule.enter_at": {
                            $lte: from
                        },
                        "schedule.exit_at": {
                            $gte: at
                        }
                    }
                );
                const {document, error} = await getConnectionDocumentFromConnections(connections, shouldBeConnected);
                if(error){
                    throw error;
                }
                return document;
            }
        )(connections, at, from)

        return {
            data: {
                at,
                disconnected,
                connected,
                connectionGroups
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

module.exports = getConnectionDocumentAt;