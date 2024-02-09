const reference = [
    {
        endAt: new Date("2024-02-03T09:00:00+09:00")
    },
    {
        startAt: new Date("2024-02-03T09:00:00+09:00"),
        endAt: new Date("2024-02-04T09:00:00+09:00")
    },
    {
        startAt: new Date("2024-02-04T09:00:00+09:00")
    }
];

function convertDateToSession(date){
    const sessionNo = reference.findIndex(
        ({startAt, endAt})=>{
            return (!startAt || startAt<=date) && (!endAt || date<=endAt);
        }
    )
    if(sessionNo<0){
        return {
            error: new Error(`error finding session with ${date}`)
        }
    }
    return {
        sessionNo,
        session: reference[sessionNo]
    };
}

module.exports = {
    sessions: reference,
    convertDateToSession
}