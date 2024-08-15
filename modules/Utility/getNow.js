function getNow(){
    const now = new Date(Date.now());
    //const now = new Date("2024-08-18T00:30:00+09:00");
    return now;
}

module.exports = getNow;