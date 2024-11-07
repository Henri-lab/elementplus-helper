// Function to generate a single object with random data
function generateTestDataArray() {
    return {
        antennaAngle: Math.floor(Math.random() * 10).toString(),
        antennaHeight: Math.floor(Math.random() * 10).toString(),
        antennaType: `type${Math.floor(Math.random() * 10)}`,
        beamWidth: (Math.random() * 1).toFixed(3),
        camouflage: `伪装${Math.floor(Math.random() * 10)}`,
        carrierAlw: Math.floor(Math.random() * 20).toString(),
        carrierType: Math.floor(Math.random() * 1000).toString(),
        carrierValue: Math.floor(Math.random() * 20).toString(),
        cycleAlw: `${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 100)}`,
        cycleType: `JY${Math.floor(Math.random() * 10)}`,
        cycleValue: Math.floor(Math.random() * 100).toString(),
        decoy: `youer${Math.floor(Math.random() * 10)}`,
        equipment: `zhuangbei${Math.floor(Math.random() * 10)}`,
        facilityId: Math.floor(Math.random() * 20),
        facilityName: `雷达天线${Math.floor(Math.random() * 10)}`,
        facilityType: Math.random() > 0.5 ? 1 : 2,
        feature: `颜色${Math.floor(Math.random() * 10)}`,
        fixedType: `${Math.random > 0.5 ? 'A000' : 'B000'}`,
        infoId: Math.floor(Math.random() * 20),
        logId: Math.floor(Math.random() * 200),
        pulseAlw: `${Math.floor(Math.random() * 500)}-${Math.floor(Math.random() * 500)}`,
        pulseType: Math.floor(Math.random() * 20).toString(),
        pulseValue: Math.floor(Math.random() * 100).toString(),
        radar: `LD-Y0${Math.floor(Math.random() * 10)}`,
        radarId: Math.floor(Math.random() * 20),
        sender: `${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`,
        targetName: 'TEST-' + `${Math.floor(Math.random() * 1000)}`,
        targetSize: `长${Math.floor(Math.random() * 20)}`,
        workBand: `${Math.floor(Math.random() * 10)}`,
    };
}

// Generate an array with multiple objects
const testDataArr = [];
for (let i = 0; i < 5; i++) { // Change 5 to any number of objects you want
    testDataArr.push(generateTestDataArray());
}

export default testDataArr;
