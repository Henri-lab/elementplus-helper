
let digital = 0;
function parseDMStoDecimal(dmsString) {
    const dmsRegex = /(\d+)\s*°\s*(\d+)\s*'\s*(\d+)\s*"/;;
    const match = dmsRegex.exec(dmsString);


    if (!match) {
        console.log('Invalid DMS string')
        return false;
    }

    const degrees = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    digital = degrees + minutes / 60 + seconds / 3600;

    return between(-180, 180, degrees * 1) && between(0, 60, minutes * 1) && between(0, 60, seconds * 1);

}

export function transformToNum() {
    if (digital) return digital
}

function between(min, max, value) {
    return value >= min && value <= max;
}

const lonDMS = (value) => {
    return parseDMStoDecimal(value)
};

const latDMS = (value) => {
    return parseDMStoDecimal(value)
};

console.log(lonDMS(`30°05'06"`));

export {
    lonDMS,
    latDMS
}