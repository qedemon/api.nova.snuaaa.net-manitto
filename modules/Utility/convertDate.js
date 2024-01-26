const reference = [
    [
        new Date("2024-02-02T23:59:59+09:00")
    ],
    [
        new Date("2024-02-03T12:00:00+09:00"),
        new Date("2024-02-03T18:00:00+09:00"),
        new Date("2024-02-03T23:59:59+09:00")
    ],
    [
        new Date("2024-02-04T12:00:00+09:00"),
        new Date("2024-02-04T18:00:00+09:00"),
        new Date("2024-02-04T23:59:59+09:00")
    ],
    [
        new Date("2024-02-05T23:59:59+09:00"),
    ]
]

function convertDateToUnit(date){
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