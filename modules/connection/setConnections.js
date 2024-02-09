const {connect} = require("modules/mongoose");
const {ConnectionDocument} = require("models/mongoDB");
const mongoose = require("mongoose");

async function setConnections(connections){
    try{
        if(connections.validAt>=connections.expiredAt){
            throw new Error("invalid connections");
        }
        await connect();

        const overlapped = await ConnectionDocument.find(
            {
                expiredAt: {
                    $gt: connections.validAt,
                },
                validAt: {
                    $lt: connections.expiredAt
                }
            }
        );
        const {updated, revokeData} = 
        (
            await Promise.all(
                overlapped.map(
                    async (overlappedConnections)=>{
                        const dataRevoke = {
                            validAt: overlappedConnections.validAt,
                            expiredAt: overlappedConnections.expiredAt
                        };
                        const updateData = (
                            (overlappedConnections, connections)=>{
                                const updateData = [
                                    {
                                        validAt: overlappedConnections.validAt,
                                        expiredAt: connections.validAt
                                    },
                                    {
                                        validAt: connections.expiredAt,
                                        expiredAt: overlappedConnections.expiredAt
                                    }
                                ].filter(
                                    ({validAt, expiredAt})=>{
                                        return validAt<expiredAt;
                                    }
                                );
                                return (updateData.length>0)?updateData:
                                [
                                    {
                                        validAt: overlappedConnections.validAt,
                                        expiredAt: connections.validAt
                                    }
                                ]
                            }
                        )(overlappedConnections, connections);
                        
                        const updated = await overlappedConnections.set(updateData[0]).save();
                        const created = updateData[1]?
                            await ConnectionDocument.create(
                                {
                                    ...updated.toObject(),
                                    _id: new mongoose.Types.ObjectId(),
                                    ...updateData[1]
                                }
                            )
                            :null;
                        const revokeData = {
                            updated: {
                                document: updated,
                                data: dataRevoke
                            },
                            created: created?
                                {
                                    document: created
                                }:
                                null
                        };
                        return {
                            updated: created?[updated, created]:[updated],
                            revokeData
                        }
                    }
                )
            )
        ).reduce(
            (result, connections)=>{
                return {
                    updated: [
                        ...result.updated,
                        ...connections.updated
                    ],
                    revokeData: [
                        ...result.revokeData,
                        connections.revokeData
                    ]
                }
            },
            {updated: [], revokeData: []}
        )
        const inserted = await ConnectionDocument.create(
            connections
        );
        return {
            inserted,
            overlapped: updated,
            revoke: async ()=>{
                const deleted = await ConnectionDocument.deleteOne(
                    {
                        _id: inserted._id
                    }
                )
                const revoked = await Promise.all(
                    revokeData.map(
                        async ({updated, created})=>{
                            return {
                                updated: await updated.document.set(updated.data).save(),
                                deleted: created?
                                {
                                    _id: created.document._id,
                                    ...await ConnectionDocument.deleteOne(
                                        {
                                            _id: created.document._id
                                        }
                                    )
                                }:
                                null
                            }
                        }
                    )
                )
                return {
                    deleted,
                    revoked
                }
            }
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = setConnections;