const reference = [
    {
        endAt: new Date("2025-02-08T10:00:00+09:00")
    },
    {
        startAt: new Date("2025-02-08T10:00:00+09:00"),
        endAt: new Date("2025-02-09T10:00:00+09:00")
    },
    {
        startAt: new Date("2025-02-09T10:00:00+09:00"),
        endAt: new Date("2025-02-10T23:00:00+09:00")
    }
];

function convertDateToSession(date){
    const sessionNo = reference.findIndex(
        ({startAt, endAt})=>{
            return (!startAt || startAt<=date) && (!endAt || date<=endAt);
        }
    )??reference[reference.length-1]
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