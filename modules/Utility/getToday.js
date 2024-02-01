const getNow = require("./getNow");
const {convertDateToUnit, reference} = require("./convertDate");

function getToday(){
    const unit = convertDateToUnit(getNow());
    return unit.major;
    if(unit.minor >= reference[unit.major].length-1){
        return unit.major;
    }
    return (
        (value, min, max)=>{
            if(value<min){
                return min;
            }
            if(value>max){
                return max;
            }
            return value;
        }
    )(unit.major-1, 0, reference.length-1)
}

module.exports = getToday;