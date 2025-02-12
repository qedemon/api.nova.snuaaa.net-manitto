function getNow(){
    const now = new Date(Date.now());
    //now.setMonth(1);
    //now.setDate(7)
    //const now = new Date("2025-02-07T15:30:00+09:00");
    return now;
}

module.exports = getNow;