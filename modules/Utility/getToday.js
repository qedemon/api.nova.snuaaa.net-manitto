const getNow = require("./getNow");
const {convertDateToUnit, reference} = require("./convertDate");

function getToday(){
    const unit = convertDateToUnit(getNow());
    return unit.major;
}

module.exports = getToday;