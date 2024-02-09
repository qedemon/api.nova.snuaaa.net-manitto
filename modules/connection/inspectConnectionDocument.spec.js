const {connect, disconnect} = require("modules/mongoose");
const {ConnectionDocument} = require("models/mongoDB");
test("inspectConnectionDocument", async ()=>{
    await connect();
    documents = await ConnectionDocument.find(
        {
            $expr: {
                $lt: ["$validAt", "$expiredAt"]
            }
        }
    ).sort({validAt: 1});
    await disconnect();
    expect(
        documents.reduce(
            (result, doc, index, array)=>{
                if(index<array.length-1){
                    return [
                        ...result,
                        [doc, array[index+1]]
                    ]
                }
                return result
            },
            []
        ).every(
            ([a, b], index)=>{
                if(a.expiredAt>b.validAt){
                    console.error(`${a} connection confilcts ${b}`)
                }
                return a.expiredAt<=b.validAt;
            }
        )
    ).toBe(true)
})