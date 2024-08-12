const reference = [
    [
        new Date("2024-08-16T12:00:00+09:00"),
        new Date("2024-08-16T19:00:59+09:00"),
        new Date("2024-08-16T23:59:59+09:00")
    ],
    [
        new Date("2024-08-17T12:00:00+09:00"),
        new Date("2024-08-17T19:00:00+09:00"),
        new Date("2024-08-17T23:59:59+09:00")
    ],
    [
        new Date("2024-08-18T12:00:00+09:00"),
        new Date("2024-08-18T19:00:00+09:00"),
        new Date("2024-08-18T23:59:59+09:00")
    ],
    [
        new Date("2024-08-19T23:59:59+09:00"),
    ]
]

function convertDateToUnit(dateDescription){
    const date = new Date(dateDescription);
    for(let i = 0; i<reference.length; i++){
        for(let j=0; j<reference[i].length; j++){
            if(date<=reference[i][j]){
                return {
                    major: i,
                    minor: j
                }
            }
        }
    }
    return {
        major: reference.length,
        minor: 0
    }
}

function convertUnitToDate(unit){
    const major = (reference.length<=unit.major)?(reference.length-1):unit.major;
    const minor = (reference[major].length<=unit.minor)?(reference[major].length-1):unit.minor;
    return new Date(reference[major][minor].getTime()-10*60*1000);
}

module.exports = {
    convertDateToUnit,
    convertUnitToDate,
    reference
}