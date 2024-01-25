const {convertDateToUnit, convertUnitToDate} = require("./convertDate");

const testCases = [
    {
        date: "2024-02-02T18:00:00+09:00",
        unit: {
            major: 0,
            minor: 0
        }
    },
    {
        date: "2024-02-03T10:00:00+09:00",
        unit: {
            major: 1,
            minor: 0
        }
    },
    {
        date: "2024-02-03T13:20:00+09:00",
        unit: {
            major: 1,
            minor: 1
        }
    }
];

test("convertDateToUnit", ()=>{
    testCases.forEach(
        ({date, unit})=>{
            const result = convertDateToUnit(new Date(date));
            expect(result.major).toBe(unit.major);
            expect(result.minor).toBe(unit.minor);
        }
    )
});

test("convertUnitToDate", ()=>{
    testCases.forEach(
        ({unit})=>{
            const result = convertDateToUnit(convertUnitToDate(unit));
            expect(result.major).toBe(unit.major);
            expect(result.minor).toBe(unit.minor);
        }
    )
})