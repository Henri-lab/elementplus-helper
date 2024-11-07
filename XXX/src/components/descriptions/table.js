export const tableTemplate_facility = {
    id: Date.now(),
    _meta_: {
        select: ""  // 初始化为默认值
    },
    facilityType: 1,
    data: [
        {
            name: '名称',
            value: '',
            span: 3,
            key: 'facilityName',
            type: 'text-basic',
        },
        {
            name: '目标尺寸',
            value: '',
            span: 3,
            key: 'targetSize',
            type: 'text-basic',
        },
        {
            name: '伪装防护情况',
            value: '',
            span: 3,
            key: 'camouflage',
            type: 'text-basic',
        },
        {
            name: '识别特征',
            value: '',
            span: 3,
            key: 'feature',
            type: 'text-basic',
        },
        // {
        //   name: "装备类型",
        //   value: "",
        //   span: 1,
        //   key: "equipmentType",
        //   type: "sel",
        // },
        {
            name: '固定设施类型',
            value: '',
            span: 1,
            key: 'fixedType',
            type: 'sel',
        },
        {
            name: '新增情况',
            value: '',
            span: 1,
            key: 'isNewFacility',
            type: 'switch'
        }
    ],
}

export const tableTemplate_radar = {
    id: Date.now(),
    _meta_: {
        selRadar: ""  // 初始化为默认值
    },
    facilityType: 2,
    data: [
        {
            id: 0,
            name: '名称',
            value: '',
            span: 3,
            key: 'facilityName',
            status: true,
            type: 'text-basic',
        },
        {
            id: 1,
            name: '目标尺寸',
            value: '',
            span: 3,
            key: 'targetSize',
            type: 'text-basic',
        },
        {
            id: 2,
            name: '伪装防护情况',
            value: '',
            span: 3,
            key: 'camouflage',
            type: 'text-basic',
        },
        {
            id: 3,
            name: '识别特征',
            value: '',
            span: 3,
            key: 'feature',
            type: 'text-basic',
        },
        {
            id: 4,
            name: '雷达型号',
            value: '',
            span: 1,
            key: 'radar',
            status: true,
            type: 'sel',
        },
        // 自动补全字段
        {
            id: 5,
            name: '天线类型',
            value: '',
            span: 1,
            key: 'antennaType',
            status: true,
            type: 'text-auto',
        },
        {
            id: 6,
            name: '工作波段',
            value: null,
            span: 1,
            key: 'workBand',
            status: true,
            type: 'text-auto',
        },

        {
            id: 7,
            name: '发射机输出功率(w)',
            value: '',
            span: 1,
            key: 'sender',
            status: true,
            type: 'text-auto',
        },
        {
            id: 8,
            name: '载频类型',
            value: '',
            span: 1,
            key: 'carrierType',
            status: true,
            type: 'text-auto',
        },

        {
            id: 9,
            name: '载频值(MHz)',
            value: '',
            span: 1,
            key: 'carrierValue',
            status: true,
            type: 'text-auto',
        },
        {
            id: 10,
            name: '载频容差(MHz)',
            value: '',
            span: 1,
            key: 'carrierAlw',
            status: true,
            type: 'text-auto',
        },

        {
            id: 11,
            name: '重周类型',
            value: '',
            span: 1,
            key: 'cycleType',
            status: true,
            type: 'text-auto',
        },
        {
            id: 12,
            name: '重周值(μs)',
            value: '',
            span: 1,
            key: 'cycleValue',
            status: true,
            type: 'text-auto',
        },
        {
            id: 13,
            name: '重周容差(μs)',
            value: '',
            span: 1,
            key: 'cycleAlw',
            status: true,
            type: 'text-auto',
        },
        {
            name: '脉宽类型',
            value: '',
            span: 1,
            key: 'pulseType',
            status: true,
            type: 'text-auto',
        },
        {
            id: 14,
            name: '脉宽值(μs)',
            value: '',
            span: 1,
            key: 'pulseValue',
            status: true,
            type: 'text-auto',
        },
        {
            id: 15,
            name: '脉宽容差(μs)',
            value: '',
            span: 1,
            key: 'pulseAlw',
            status: true,
            type: 'text-auto',
        },
        {
            id: 16,
            name: '天线架设高度（米）',
            value: '',
            span: 1,
            key: 'antennaHeight',
            status: true,
            type: 'text-auto',
        },
        {
            id: 17,
            name: '天线架设角(°）',
            value: '',
            span: 1,
            key: 'antennaAngle',
            status: true,
            type: 'text-auto',
        },
        {
            id: 18,
            name: '波束宽度(°）',
            value: '',
            span: 1,
            key: 'beamWidth',
            status: true,
            type: 'text-auto',
        },
        // textarea字段
        {
            id: 19,
            name: '诱饵情况',
            value: '',
            span: 3,
            key: 'decoy',
            status: true,
            type: 'textarea',
        },
        {
            id: 20,
            name: '装备能力',
            value: '',
            span: 3,
            key: 'equipment',
            status: true,
            type: 'textarea',
        },
    ],
}

export function spanSize(key) {
    const spanMap = {
        facilityName: 3,
        targetSize: 3,
        camouflage: 3,
        feature: 3,
        fixedType: 1,
        radar: 1,
        antennaType: 1,
        workBand: 1,
        sender: 1,
        carrierType: 1,
        carrierValue: 1,
        carrierAlw: 1,
        cycleType: 1,
        cycleValue: 1,
        cycleAlw: 1,
        pulseType: 1,
        pulseValue: 1,
        pulseAlw: 1,
        antennaHeight: 1,
        antennaAngle: 1,
        beamWidth: 1,
        decoy: 3,
        equipment: 3,
    };
    return spanMap[key] || 1;
}
export function Name_CN(key) {
    const cnMap = {
        facilityName: '名称',
        targetSize: '目标尺寸',
        camouflage: '伪装防护情况',
        feature: '识别特征',
        fixedType: '固定设施类型',
        radar: '雷达型号',
        antennaType: '天线类型',
        workBand: '工作波段',
        sender: '发射机输出功率(w)',
        carrierType: '载频类型',
        carrierValue: '载频值(MHz)',
        carrierAlw: '载频容差(MHz)',
        cycleType: '重周类型',
        cycleValue: '重周值(μs)',
        cycleAlw: '重周容差(μs)',
        pulseType: '脉宽类型',
        pulseValue: '脉宽值(μs)',
        pulseAlw: '脉宽容差(μs)',
        antennaHeight: '天线架设高度（米）',
        antennaAngle: '天线架设角(°)',
        beamWidth: '波束宽度(°)',
        decoy: '诱饵情况',
        equipment: '装备能力',
    };

    return cnMap[key] || `${key}`; // 返回对应的name值，如果没有找到对应key，返回空字符串或你希望的默认值
}

export function inputType(key) {
    switch (key) {
        case 'facilityName':
        case 'targetSize':
        case 'camouflage':
        case 'feature':
        case 'fixedType':
        case 'antennaType':
        case 'workBand':
        case 'sender':
        case 'carrierType':
        case 'carrierValue':
        case 'carrierAlw':
        case 'cycleType':
        case 'cycleValue':
        case 'cycleAlw':
        case 'pulseType':
        case 'pulseValue':
        case 'pulseAlw':
        case 'antennaHeight':
        case 'antennaAngle':
        case 'beamWidth':
            return 'text-auto';

        case 'decoy':
        case 'equipment':
            return 'textarea';

        case 'radar':
        case 'fixedType':
            return 'sel';

        default:
            return 'text-basic';
    }
}


export function wrap({ key, value }) {
    return {
        key,
        value,
        name: Name_CN(key),
        span: spanSize(key),
        status: true,
        type: inputType(key),
    }
}

export function wrapObj(obj) {
    return Object.keys(obj).map(key => wrap({ key, value: obj[key] }))
}

export let _init_ = {
    facilityName: '',
    targetSize: '',
    camouflage: '',
    feature: '',
    radar: '',
    antennaType: '',
    workBand: '',
    sender: '',
    carrierType: '',
    carrierValue: '',
    carrierAlw: '',
    cycleType: '',
    cycleValue: '',
    cycleAlw: '',
    pulseType: '',
    pulseValue: '',
    pulseAlw: '',
    antennaHeight: '',
    antennaAngle: '',
    beamWidth: '',
    decoy: '',
    equipment: ''
};
// const res = wrapObj(data)
// console.log(res, 'wrapObj')