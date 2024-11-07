
// let data = {
//     color="#e7e91e",
//     content="123",
//     coords="145.31419350637336,13.831186319241601",
//     createTime=null,
//     id=2721,
//     labelImageId=82,
//     size=55,
//     strokeColor=null,
//     strokeSize=null,
//     type="label",
//     wordAngle=null,
//     wordFont=null
// }
export function getCanvas (
    { color = "#e7e91e",
        content = "",
        coords = "",
        createTime = null,
        size = 25,
        type = "label",
        wordAngle = null,
        strokeColor = "#e7e91e",
        wordFont = 'sans-serif',
        strokeSize=0
}
) {
    // 创建 Canvas 元素
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    // 设置字体样式
    context.font = `${size}px ${wordFont}` // 字号-字体
    context.fillStyle = color // 填充色
    context.textAlign = 'center' // 文本对齐方式
    context.textBaseline = 'middle' // 文本基线对齐

    // 测量文本的宽度和高度
    const textMetrics = context.measureText(content)
    const textWidth = textMetrics.width
    const textHeight = size // Approximate height, may vary based on font

    // 设置 Canvas 尺寸
    canvas.width = textWidth * 2 // Adding some padding
    canvas.height = textHeight * 1.5 // Adding some padding

    context.font = `${size}px ${wordFont}` // 字号-字体
    context.fillStyle = color // 填充色
    context.textAlign = 'center' // 文本对齐方式
    context.textBaseline = 'middle' // 文本基线对齐
    context.strokeStyle = strokeColor
    context.lineWidth = strokeSize // 设置文本边框宽度为 2 像素

    // 绘制文本边框
    if (strokeSize > 0) {
        
        context.strokeText(content, canvas.width / 2, canvas.height / 2)
    }

    // // 设置阴影属性
    // context.shadowColor = 'rgba(0, 0, 0, 0.5)' // 阴影颜色
    // context.shadowOffsetX = 2 // 阴影水平偏移
    // context.shadowOffsetY = 2 // 阴影垂直偏移
    // context.shadowBlur = 4 // 阴影模糊程度
    // 绘制文本
    context.fillText(content, canvas.width / 2, canvas.height / 2)

    return canvas
}