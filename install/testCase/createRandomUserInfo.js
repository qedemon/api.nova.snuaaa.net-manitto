const {convertUnitToDate} = require("modules/Utility/convertDate");

const words = [
    ["김", "이", "박", "안", "최", "강", "문", "정"],
    ["태", "래", "도", "민", "지", "영", "선", "서", "융", "소", "지"],
    ["석", "산", "린", "영", "혁", "재", "우"]
];
const col_nos = [
    "09", "19", "20", "21", "22", "23"
];
majors = [
    "목탁디자인학과", "십자가디자인전공", "제삿상생산관리학부", "천체계량학과"
]

function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
  
function createRandomName(){
    return words[0][getRandomArbitrary(0, words[0].length)] + words[1][getRandomArbitrary(0, words[1].length)] + words[2][getRandomArbitrary(0, words[2].length)]
}
function createRandomColNo(){
    return col_nos[getRandomArbitrary(0, col_nos.length)];
}
function createRandomMajor(){
    return majors[getRandomArbitrary(0, majors.length)];
}
function createRandomId(){
    return Math.random().toString(36).slice(2);
}
function createRandomSchedule(){
    const unit_enter = {
        major: getRandomArbitrary(0, 3),
        minor: getRandomArbitrary(0, 3)
    }
    const unit_exit = {
        major: getRandomArbitrary(unit_enter.major+1, 4),
        minor: getRandomArbitrary(0, 3)
    };
    return {
        enter_at: convertUnitToDate(unit_enter),
        exit_at: convertUnitToDate(unit_exit)
    }
}
function createRandomUserInfo(length){
    return Array.from({length: length}).map(
        ()=>{
            return {
                user_id: getRandomArbitrary(1000, 5000),
                name: createRandomName(),
                col_no: createRandomColNo(),
                major: createRandomMajor(),
                id: createRandomId(),
                schedule: createRandomSchedule(),
            }
        }
    )
}

module.exports = createRandomUserInfo;