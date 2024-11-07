import { ElMessage, ElMessageBox, ElLoading } from "element-plus"
import bus from '@/utils/bus'
import { getCanvas } from "./cloneCanvas"
// import eventCortol from "./handler"
let entitiesAll = []
let handler = null
let styleFrom = {}
let pickedObjectArrays = []
let pick = {}
let isSet = false

class entities {
    // eventCortol = new eventCortol({ viewer: viewer });
    doubleClick () {
        let isQuery = false // 是否在编辑状态
        // 注册鼠标事件
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        let info = {}
        // 鼠标双击事件
        handler.setInputAction(event => {
            if (isQuery) {
                isQuery = false
                // 判断类型为线
                if (pickedObjectArrays[0]?.id.polyline && pickedObjectArrays[0].id.name != '圆形') {
                    var time = Cesium.JulianDate.now() // 当前时间
                    var result = new Cesium.Cartesian3() // 结果存储对象
                    var currentValue = pickedObjectArrays[0].id.polyline.positions.getValue(time, result)
                    let cartCents = currentValue.map((item) => {
                        return {
                            lon: Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(item).longitude),
                            lat: Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(item).latitude)
                        }
                    })
                    let centents = ''
                    cartCents.forEach((item) => {
                        centents += item.lon + ',' + item.lat + ';'
                    })
                    bus.emit('setMap', {
                        data: {
                            id: pickedObjectArrays[0].id.id,
                            coords: centents,
                        },
                        isShow: false
                    })
                }
            }
            pickedObjectArrays = viewer.scene.drillPick(event.position)
            if (!!pickedObjectArrays.length) {
                isQuery = true
                // 当双击到实体，传回页面操作样式
                setTimeout(() => {
                    bus.emit('leftDouble', pickedObjectArrays[0])
                }, 100);
            }
            console.log(pickedObjectArrays, 'pickedObjectArrays')
            // 判断双击拿到的是圆
            if (!!pickedObjectArrays[0] && pickedObjectArrays[0].id.name == '圆形') {
                this.setEllipse(pickedObjectArrays[0].id) // 调用修改圆的方法
            }
            // 判断拿到的是矩形
            if (!!pickedObjectArrays[0] && pickedObjectArrays[0].id.name == '画矩形') {
                this.setRectangle(pickedObjectArrays[0].id) // 调用修改矩形的方法
            }
            // // 当点击拿到文字实例时进行操作
            if (!!pickedObjectArrays[0] && pickedObjectArrays[0].id.billboard) {
                let cartographic = Cesium.Cartographic.fromCartesian(pickedObjectArrays[0].primitive.position) // 笛卡尔转经纬度
                let longitude = Cesium.Math.toDegrees(cartographic.longitude)
                let latitude = Cesium.Math.toDegrees(cartographic.latitude)
                let arr = {
                    id: pickedObjectArrays[0].id.id,
                    coords: longitude + ',' + latitude,
                }
                // isSet = true
                // viewer.scene.screenSpaceCameraController.enableRotate = false//锁定相机
                bus.emit('setMap', {
                    data: arr,
                    isShow: true
                })
            } else {
                viewer.scene.screenSpaceCameraController.enableRotate = true//解锁相机
            }

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        // 鼠标移动事件
        handler.setInputAction(event => {
            if (isSet) {
                if (viewer.scene.camera.pickEllipsoid(event.endPosition)) {
                    // pickedObjectArrays[0].id.position._value = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    pick.id.position._value = viewer.scene.camera.pickEllipsoid(event.endPosition)

                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        // 鼠标左键抬起
        handler.setInputAction(e => {
            if (!!pick && isSet) {
                isSet = false

                viewer.scene.screenSpaceCameraController.enableRotate = true//解锁相机
                let cartographic = Cesium.Cartographic.fromCartesian(pick.primitive.position) // 笛卡尔转经纬度
                let longitude = Cesium.Math.toDegrees(cartographic.longitude)
                let latitude = Cesium.Math.toDegrees(cartographic.latitude)
                info = {
                    id: pick.id.id,
                    coords: longitude + ',' + latitude,
                }
                bus.emit('setMap', {
                    data: info,
                    isShow: false
                })
            }

        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        // // 鼠标右键抬起
        // 鼠标右键抬起
        handler.setInputAction(e => {
            let pick = viewer.scene.pick(e.position)
            if (!!pick) {
                bus.emit("remMap", pick.id.id)
                viewer.entities.removeById(pick.id.id)
            }

        }, Cesium.ScreenSpaceEventType.RIGHT_UP)
        // // 鼠标按下

        handler.setInputAction(e => {
            pick = viewer.scene.pick(e.position)
            // 当按下获取到实例且为文字时触发
            if (pick && pick.id.billboard) {
                isSet = true
                viewer.scene.screenSpaceCameraController.enableRotate = false//解锁相机
            }

        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    }


    // 加载点
    addPoint () {
        return new Promise((resolve, reject) => {
            let drawnPoints = []
            handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
            // 注册鼠标左键点击事件，用于绘制点
            handler.setInputAction(event => {
                // 获取鼠标点击的笛卡尔坐标(鼠标点击位置->笛卡尔坐标)
                // var cartesian = viewer.scene.camera.pickEllipsoid(event.position);
                //  let cartesian = window.viewer.scene.pick(event.position);
                let cartesian = viewer.scene.camera.pickEllipsoid(event.position)
                // 确保坐标有效
                if (cartesian) {
                    // 添加点实体
                    viewer.entities.add({
                        position: cartesian,
                        point: {
                            color: Cesium.Color.RED,
                            pixelSize: 5
                        }
                    })
                    // 获取地理坐标（经纬度）
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
                    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
                    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
                    let height = Cesium.Math.toDegrees(cartographic.height)
                    // 将绘制的点添加到数组中
                    drawnPoints.push({ lng: longitude, lat: latitude, height: height })
                }
                handler.destroy()
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        })
    }
    // 修改矩形

    setRectangle (data) {
        // 注册鼠标事件
        let setHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        // 深拷贝当前实例id
        let id = JSON.stringify(JSON.parse(data.id))
        let setPosition = false // 默认不修圆改位置
        let setRectang = false // 默认不修改矩形位置
        let ellPick = {} // 定义对象用来接收点击到的实例
        console.log(data.polyline.positions, 'data.polyline.positions')

        // 获取当前矩形的弧度 转为经纬度
        let west = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(data.polyline.positions._value[0]).longitude)
        let north = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(data.polyline.positions._value[0]).latitude)
        let east = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(data.polyline.positions._value[2]).longitude)
        let south = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(data.polyline.positions._value[2]).latitude)
        // 经纬度转为两点的笛卡尔坐标
        let topLeftPoint = Cesium.Cartesian3.fromDegrees(west, north)
        let bottomRightPoint = Cesium.Cartesian3.fromDegrees(east, south)
        // 创建两个用于接收原始坐标
        let topLeftPointNew = {}
        let bottomRightPointNew = {}
        let startPosition = new Cesium.Cartesian3()
        data.polyline.positions = new Cesium.CallbackProperty(() => {
            let cartographic = Cesium.Cartographic.fromCartesian(topLeftPoint)
            let longitude = Cesium.Math.toDegrees(cartographic.longitude)
            let latitude = Cesium.Math.toDegrees(cartographic.latitude)
            let cartographic2 = Cesium.Cartographic.fromCartesian(bottomRightPoint)
            let longitude2 = Cesium.Math.toDegrees(cartographic2.longitude)
            let latitude2 = Cesium.Math.toDegrees(cartographic2.latitude)
            return this.rectangCenter([longitude, latitude], [longitude2, latitude2])
        }, false)
        let posint1 = viewer.entities.add({
            position: topLeftPoint,
            name: '圆1',
            point: {
                color: Cesium.Color.RED,
                pixelSize: 5
            }
        })
        let posint2 = viewer.entities.add({
            position: bottomRightPoint,
            name: '圆2',
            point: {
                color: Cesium.Color.RED,
                pixelSize: 5
            }
        })
        // 鼠标左键按下事件
        setHandler.setInputAction(e => {
            ellPick = viewer.scene.pick(e.position)
            // 判断点击的是圆还是边框
            if (ellPick && ellPick.id.point) {
                // 当点击的为圆心时改变位置
                setPosition = true
                viewer.scene.screenSpaceCameraController.enableRotate = false //锁定相机

            } else if (ellPick && ellPick.id.polyline) {
                viewer.scene.screenSpaceCameraController.enableRotate = false //锁定相机
                // 当点击边框时修改半径
                setRectang = true
                startPosition = viewer.scene.camera.pickEllipsoid(e.position)
                // topLeftPointNew = JSON.stringify(JSON.parse(topLeftPoint))
                topLeftPointNew.x = topLeftPoint.x
                topLeftPointNew.y = topLeftPoint.y
                topLeftPointNew.z = topLeftPoint.z
                bottomRightPointNew.x = bottomRightPoint.x
                bottomRightPointNew.y = bottomRightPoint.y
                bottomRightPointNew.z = bottomRightPoint.z
                // bottomRightPointNew = JSON.stringify(JSON.parse(bottomRightPoint))
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
        // 鼠标左键抬起
        setHandler.setInputAction(e => {
            // 关闭移动触发
            setPosition = false
            setRectang = false
            viewer.scene.screenSpaceCameraController.enableRotate = true//解锁相机
            if (!!ellPick) {
            }

        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        // 鼠标移动事件
        setHandler.setInputAction(event => {
            // 当修改点位置时
            if (setPosition) {
                if (viewer.scene.camera.pickEllipsoid(event.endPosition)) {
                    ellPick.id.position._value = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    if (ellPick.id.name == "圆1") {
                        topLeftPoint = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    } else if (ellPick.id.name == "圆2") {
                        bottomRightPoint = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    }

                }
            } else if (setRectang) {
                // 拖动位置时
                let endPosition = viewer.scene.camera.pickEllipsoid(event.endPosition)
                if (Cesium.defined(endPosition)) {
                    let X = endPosition.x - startPosition.x
                    let Y = endPosition.y - startPosition.y
                    let Z = endPosition.z - startPosition.z
                    topLeftPoint.x = topLeftPointNew.x + X
                    topLeftPoint.y = topLeftPointNew.y + Y
                    topLeftPoint.z = topLeftPointNew.z + Z
                    bottomRightPoint.x = bottomRightPointNew.x + X
                    bottomRightPoint.y = bottomRightPointNew.y + Y
                    bottomRightPoint.z = bottomRightPointNew.z + Z
                    posint1.position = topLeftPoint
                    posint2.position = bottomRightPoint
                }

            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        // 鼠标双击事件
        setHandler.setInputAction(event => {
            // 拿到两个点坐标转换经纬度
            let topLeftPoint1 = Cesium.Cartographic.fromCartesian(topLeftPoint) // 笛卡尔转经纬度
            let bottomRightPoint1 = Cesium.Cartographic.fromCartesian(bottomRightPoint) // 笛卡尔转经纬度
            let west = Cesium.Math.toDegrees(topLeftPoint1.longitude)
            let north = Cesium.Math.toDegrees(topLeftPoint1.latitude)
            let east = Cesium.Math.toDegrees(bottomRightPoint1.longitude)
            let south = Cesium.Math.toDegrees(bottomRightPoint1.latitude)
            // let info = {
            //     id: id,
            //     coords: west + ',' + north + ';' + east + ',' + north + ';' + east + ',' + south + ';' + west + ',' + south + ';',
            // }
            // // 信息传回父页面记录
            // bus.emit('setMap', {
            //     data: info,
            //     isShow: false
            // })
            // data.rectangle.coordinates = new Cesium.Rectangle(topLeftPoint1.longitude, bottomRightPoint1.latitude, bottomRightPoint1.longitude, topLeftPoint1.latitude)
            data.polyline.positions = this.rectangCenter([west, north], [east, south])
            viewer.entities.remove(posint1)
            viewer.entities.remove(posint2)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
    // 修改圆形
    setEllipse (data) {
        // 注册鼠标事件
        let setHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        // 拿到当前标绘的位置信息
        let centerInfo = this.calculateCircleProperties(data.polyline.positions._value)
        // 定义经纬度和半径
        let lon = centerInfo.center.lon
        let lat = centerInfo.center.lat
        let radius = centerInfo.radius
        data.polyline.positions = new Cesium.CallbackProperty(() => {
            return this.getPoints(lon, lat, radius)
        }, false)
        // 经纬度转笛卡尔
        let position = Cesium.Cartesian3.fromDegrees(lon, lat)

        // 先深拷贝当前圆的半径
        let id = JSON.stringify(JSON.parse(data.id))
        let setRadius = false // 默认不修改半径
        let setPosition = false // 默认不修改位置
        let ellPick = {} // 定义对象用来接收点击到的实例

        // 标注圆心 用于后期移动位置
        let poin = viewer.entities.add({
            position: position,
            point: {
                color: Cesium.Color.RED,
                pixelSize: 5
            }
        })
        // 鼠标左键按下事件
        setHandler.setInputAction(e => {
            ellPick = viewer.scene.pick(e.position)
            // 判断点击的是圆心还是边框
            if (ellPick && ellPick.id.point) {
                // 当点击的为圆心时改变位置
                setPosition = true
                viewer.scene.screenSpaceCameraController.enableRotate = false //锁定相机

            } else if (ellPick && ellPick.id.polyline) {
                viewer.scene.screenSpaceCameraController.enableRotate = false //锁定相机
                // 当点击边框时修改半径
                setRadius = true

            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
        // 鼠标左键抬起
        setHandler.setInputAction(e => {
            // 关闭移动触发
            setPosition = false
            setRadius = false
            viewer.scene.screenSpaceCameraController.enableRotate = true//解锁相机
            if (!!ellPick) {
            }

        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        // 鼠标移动事件
        setHandler.setInputAction(event => {
            // 当修改位置时
            if (setPosition) {
                if (viewer.scene.camera.pickEllipsoid(event.endPosition)) {
                    // pickedObjectArrays[0].id.position._value = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    ellPick.id.position._value = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    let circleCenter = Cesium.Cartographic.fromCartesian(ellPick.id.position._value)
                    lon = Cesium.Math.toDegrees(circleCenter.longitude)
                    lat = Cesium.Math.toDegrees(circleCenter.latitude)
                }
            } else if (setRadius) {
                // 修改半径
                let cartesian = viewer.scene.camera.pickEllipsoid(event.endPosition)
                radius = Cesium.Cartesian3.distance(poin.position._value, cartesian)
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        // 鼠标双击事件
        setHandler.setInputAction(event => {
            let info = {
                id: id,
                coords: lon + ',' + lat + ';' + radius,
            }
            // 信息传回父页面记录
            bus.emit('setMap', {
                data: info,
                isShow: false
            })
            data.polyline.positions = this.getPoints(lon, lat, radius)
            viewer.entities.remove(poin)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
            setHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
    /**
* 动态绘制圆形
*/
    DrawCircle () {
        return new Promise((resolve, reject) => {
            let centerPoint = null // 存储圆的中心点位置
            let centerPointEntity = null  // 用于存储中点实体的引用
            let circlePoints = [] // 用于存储圆的边界坐标
            let radius = '' // 存储圆的半径
            let lon = null
            let lat = null
            // 点击后首先生成没有边界点的标绘
            let drawingCircle = viewer.entities.add({
                id: new Date().getTime(),
                name: "圆形",
                polyline: {
                    // positions: circlePoints,
                    positions: new Cesium.CallbackProperty(() => {
                        return circlePoints
                    }, false),
                    width: 2,
                    material: new Cesium.Color.fromCssColorString('#e7e91e'),
                    // clampToGround: true // 贴合地面
                }
            })
            // 注册点击事件
            let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
            // 鼠标单机后生成圆的中心点
            handler.setInputAction(event => {
                // 转换获取点击位置的笛卡尔坐标
                var cartesian = viewer.scene.camera.pickEllipsoid(event.position)
                // lon = Cesium.Cartographic.fromCartesian(cartesian).longitude
                // lat = Cesium.Cartographic.fromCartesian(cartesian).latitude
                if (cartesian && centerPoint === null) {
                    centerPoint = cartesian
                    let circleCenter = Cesium.Cartographic.fromCartesian(centerPoint)
                    lon = Cesium.Math.toDegrees(circleCenter.longitude)
                    lat = Cesium.Math.toDegrees(circleCenter.latitude)
                    // 添加中点实体并保存其引用
                    centerPointEntity = viewer.entities.add({
                        position: cartesian,
                        point: {
                            color: Cesium.Color.RED,
                            pixelSize: 5
                        }
                    })
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
            // 鼠标移动实时更新圆信息
            handler.setInputAction(event => {
                // 判断当有中心点位置时
                if (centerPoint) {
                    let cartesian = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    if (cartesian) {
                        // 拿到鼠标实时位置坐标转为半径
                        let distance = Cesium.Cartesian3.distance(centerPoint, cartesian)
                        radius = distance
                        circlePoints = this.getPoints(lon, lat, radius)
                        viewer.scene.requestRender()

                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

            handler.setInputAction(() => {
                if (centerPoint !== null && radius > 0) {
                    viewer.entities.remove(centerPointEntity)
                    handler.destroy() // 关闭鼠标事件监听，结束绘制
                    circlePoints = this.getPoints(lon, lat, radius)
                    drawingCircle.polyline.positions = this.getPoints(lon, lat, radius)
                    // let circleCenter = Cesium.Cartographic.fromCartesian(centerPoint)
                    // let lng = Cesium.Math.toDegrees(circleCenter.longitude)
                    // let lat = Cesium.Math.toDegrees(circleCenter.latitude)
                    resolve(
                        {
                            type: 'ellipse',
                            coords: Number(lon).toFixed(6) + ',' + Number(lat).toFixed(6) + ';' + radius,
                            id: drawingCircle.id
                        }
                    )

                    // resolve({
                    //     center: { lng: lng, lat: lat },
                    //     radius: radius
                    // })
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        })
    };
    // 封装圆边缘点位
    getPoints (lon, lat, radius) {
        const numPoints = 100
        const circlePoints = []
        const angleIncrement = 2 * Math.PI / numPoints

        // 经纬度半径的比例
        const latitudinalRadius = radius / 111320 // 纬度方向
        const longitudinalRadius = radius / (111320 * Math.cos(Cesium.Math.toRadians(lat))) // 经度方向

        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleIncrement

            // 计算圆上的点（经纬度偏移量）
            const offsetX = longitudinalRadius * Math.cos(angle)
            const offsetY = latitudinalRadius * Math.sin(angle)

            // 将经纬度偏移量转换为笛卡尔坐标
            const cartographic = new Cesium.Cartographic(
                Cesium.Math.toRadians(Number(lon) + offsetX),
                Cesium.Math.toRadians(Number(lat) + offsetY)
            )
            const cartesian = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0)

            circlePoints.push(cartesian)
        }
        circlePoints.push(circlePoints[0]) // 闭合圆
        return circlePoints
    }
    // 通过圆的边缘点计算中心位置和半径
    calculateCircleProperties (circlePoints) {
        let sumLon = 0
        let sumLat = 0
        const numPoints = circlePoints.length

        // 计算圆心（平均经纬度）
        circlePoints.forEach(point => {
            const cartographic = Cesium.Cartographic.fromCartesian(point)
            sumLon += Cesium.Math.toDegrees(cartographic.longitude)
            sumLat += Cesium.Math.toDegrees(cartographic.latitude)
        })

        const centerLon = sumLon / numPoints
        const centerLat = sumLat / numPoints

        // 计算半径
        let totalDistance = 0
        circlePoints.forEach(point => {
            const cartographic = Cesium.Cartographic.fromCartesian(point)
            const distance = Cesium.Cartesian3.distance(
                Cesium.Cartesian3.fromDegrees(centerLon, centerLat, 0),
                point
            )
            totalDistance += distance
        })

        const radius = totalDistance / numPoints

        return {
            center: { lon: centerLon, lat: centerLat },
            radius: radius
        }
    }
    // 通过两点经纬度返回矩形五点坐标
    rectangCenter (top, botton) {
        let centenList = [
            {
                lon: top[0],
                lat: top[1]
            },
            {
                lon: top[0],
                lat: botton[1]
            },
            {
                lon: botton[0],
                lat: botton[1]
            },
            {
                lon: botton[0],
                lat: top[1]
            },
            {
                lon: top[0],
                lat: top[1]
            },
        ]
        return centenList.map((item) => Cesium.Cartesian3.fromDegrees(item.lon, item.lat))
    }
    /**
   * 动态绘制矩形
   */
    DrawRectangle = () => {
        // 设置返回值
        return new Promise((resolve, reject) => {
            let topLeftPoint = null
            let bottomRightPoint = null
            let circlePoints = []
            let drawingRectangle = viewer.entities.add({
                id: new Date().getTime(),
                name: "画矩形",
                polyline: {
                    positions: new Cesium.CallbackProperty(() => {
                        return circlePoints
                    }, false),
                    width: 2,
                    // new Cesium.PolylineOutlineMaterialProperty // 加阴影方法
                    material: new Cesium.Color.fromCssColorString('#e7e91e'),
                    clampToGround: true // 贴合地面
                }
            })

            let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

            handler.setInputAction(event => {
                var cartesian = viewer.scene.camera.pickEllipsoid(event.position)
                if (cartesian) {
                    if (topLeftPoint === null) {
                        topLeftPoint = Cesium.Cartographic.fromCartesian(cartesian)
                    }

                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

            handler.setInputAction(event => {
                if (topLeftPoint) {
                    bottomRightPoint = Cesium.Cartographic.fromCartesian(viewer.scene.camera.pickEllipsoid(event.endPosition))
                    if (topLeftPoint != null || bottomRightPoint != null) {
                        let west = Cesium.Math.toDegrees(topLeftPoint.longitude)
                        let north = Cesium.Math.toDegrees(topLeftPoint.latitude)
                        let east = Cesium.Math.toDegrees(bottomRightPoint.longitude)
                        let south = Cesium.Math.toDegrees(bottomRightPoint.latitude)
                        circlePoints = this.rectangCenter([west, north], [east, south])
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

            handler.setInputAction(() => {
                if (topLeftPoint !== null && bottomRightPoint !== null) {
                    // drawingRectangle.rectangle.coordinates = new Cesium.Rectangle(topLeftPoint.longitude, bottomRightPoint.latitude, bottomRightPoint.longitude, topLeftPoint.latitude)
                   
                    drawingRectangle.polyline.positions = circlePoints
                    handler.destroy() // 关闭鼠标事件监听，结束绘制
                    let west = Cesium.Math.toDegrees(topLeftPoint.longitude)
                    let north = Cesium.Math.toDegrees(topLeftPoint.latitude)
                    let east = Cesium.Math.toDegrees(bottomRightPoint.longitude)
                    let south = Cesium.Math.toDegrees(bottomRightPoint.latitude)
                    resolve(
                        {
                            type: 'rectangle',
                            coords: west + ',' + north + ';' + east + ',' + north + ';' + east + ',' + south + ';' + west + ',' + south,
                            id: drawingRectangle.id
                        }

                    )
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        })
    };
    // 动态添加文字标注
    label () {
        return new Promise((resolve, reject) => {
            // let drawnPoints = []
            handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
            // 注册鼠标左键点击事件，用于绘制点
            handler.setInputAction(event => {
                // 获取鼠标点击的笛卡尔坐标(鼠标点击位置->笛卡尔坐标)
                // var cartesian = viewer.scene.camera.pickEllipsoid(event.position);
                //  let cartesian = window.viewer.scene.pick(event.position);
                let cartesian = viewer.scene.camera.pickEllipsoid(event.position)
                // 确保坐标有效
                if (cartesian) {

                    // 获取当前相机的位置
                    const cameraPosition = viewer.camera.positionWC // 获取世界坐标系中的相机位置

                    // 将相机位置转换为地球表面高度
                    const scene = viewer.scene
                    const ellipsoid = scene.globe.ellipsoid
                    const cartographic1 = ellipsoid.cartesianToCartographic(cameraPosition)

                    // 获取高度
                    const height1 = cartographic1.height

                    // 添加点实体
                    // 获取地理坐标（经纬度）
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
                    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
                    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
                    // let height = Cesium.Math.toDegrees(cartographic.height)
                    // 将绘制的点添加到数组中
                    // drawnPoints.push({ lng: longitude, lat: latitude, height: height })
                    let data = {
                        id: new Date().getTime(),
                        type: 'label',
                        coords: longitude + ',' + latitude,
                        wordHeight: height1
                    }
                    this.lookLabel(data)
                    resolve(data)
                }
                handler.destroy()
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        })
    }
    /**
 * 动态绘制折线
 */
    polyline () {
        return new Promise((resolve, reject) => {
            let polylinePoints = []

            // 临时折线实体
            let polylineEntity = viewer.entities.add({
                name: "画线",
                polyline: {
                    //使用CallbackProperty允许我们在用户点击时动态更新线段的位置
                    positions: new Cesium.CallbackProperty(() => {
                        return polylinePoints
                    }, false),
                    width: 2,
                    material: Cesium.Color.YELLOW.withAlpha(0.5)
                }
            })

            // 临时动态线实体
            let dynamicLineEntity = viewer.entities.add({
                polyline: {
                    positions: new Cesium.CallbackProperty(() => {
                        if (lastPoint && currentMousePoint) {
                            return [lastPoint, currentMousePoint]
                        } else {
                            return []
                        }
                    }, false),
                    width: 2,
                    material: Cesium.Color.YELLOW.withAlpha(0.5) // 使用半透明红色，与主线区分
                }
            })

            let lastPoint = null
            let currentMousePoint = null

            // 创建事件处理器
            let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

            // 注册鼠标左键点击事件，用于添加点和显示点
            handler.setInputAction(event => {
                let cartesian = viewer.scene.camera.pickEllipsoid(event.position)
                if (cartesian) {
                    if (lastPoint) {
                        polylinePoints.push(cartesian)
                        lastPoint = cartesian

                        // viewer.entities.add({
                        //     position: cartesian,
                        //     point: {
                        //         color: Cesium.Color.BLUE,
                        //         pixelSize: 10
                        //     }
                        // })
                        let circleCenter1 = Cesium.Cartographic.fromCartesian(polylinePoints[0])
                        let lng1 = Cesium.Math.toDegrees(circleCenter1.longitude)
                        let lat1 = Cesium.Math.toDegrees(circleCenter1.latitude)
                        let circleCenter2 = Cesium.Cartographic.fromCartesian(polylinePoints[1])
                        let lng2 = Cesium.Math.toDegrees(circleCenter2.longitude)
                        let lat2 = Cesium.Math.toDegrees(circleCenter2.latitude)
                        entitiesAll.push({
                            type: 'polyline',
                            coords: lng1 + ',' + lat1 + ';' + lng2 + ',' + lat2,
                            content: ''
                        })
                        handler.destroy()

                    } else {
                        polylinePoints.push(cartesian)
                        lastPoint = cartesian

                        // viewer.entities.add({
                        //     position: cartesian,
                        //     point: {
                        //         color: Cesium.Color.BLUE,
                        //         pixelSize: 10
                        //     }
                        // })

                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

            // 鼠标移动事件，更新当前鼠标位置并重绘临时线
            handler.setInputAction(event => {
                currentMousePoint = viewer.scene.camera.pickEllipsoid(event.endPosition)
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

            // 注册鼠标左键双击点击事件，用于结束绘制
            handler.setInputAction(() => {
                handler.destroy()
                let circleCenter1 = Cesium.Cartographic.fromCartesian(polylinePoints[0])
                let lng1 = Cesium.Math.toDegrees(circleCenter1.longitude)
                let lat1 = Cesium.Math.toDegrees(circleCenter1.latitude)
                let circleCenter2 = Cesium.Cartographic.fromCartesian(polylinePoints[1])
                let lng2 = Cesium.Math.toDegrees(circleCenter2.longitude)
                let lat2 = Cesium.Math.toDegrees(circleCenter2.latitude)
                entitiesAll.push({
                    type: 'polyline',
                    coords: lng1 + ',' + lat1 + ';' + lng2 + ',' + lat2,
                    content: ''
                })
                viewer.entities.remove(dynamicLineEntity) // 移除临时线

                resolve(polylinePoints)
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        })
    }
    // 加载圆
    ellipse (data, id) {
        const entity = viewer.entities.getById(data.id)//根据id获取到指定实体
        if (entity) {
            // entity.ellipse.outlineColor._value = new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e')
        } else {
            let center1 = data.coords.split(';')
            let destination = center1[0].split(',')
            let circlePoints = this.getPoints(destination[0], destination[1], center1[1])
            console.log(circlePoints, 'circlePoints')
            // 添加虚线圆到视图
           let entites = viewer.entities.add({
                entitId:id,
                id: data.id,
                name: '圆形',
                polyline: {
                    positions: circlePoints,
                    width: data.lineSize,
                    // new Cesium.PolylineOutlineMaterialProperty // 加阴影方法
                    material: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
                    clampToGround: true // 贴合地面
                }
           })
            if (data.lineType == 'solid') {
                entites.polyline.material = new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e')
            } else {
                entites.polyline.material = new Cesium.PolylineDashMaterialProperty({
                    color: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
                    dashLength: 16,
                })
            }
        }
    }

    // 画矩形
    rectangle (data, id) {
        console.log(data,'data加载矩形');
        let center = data.coords.split(';').map((item) => item.split(','))
        let circlePoints = center.map((item) => Cesium.Cartesian3.fromDegrees(item[0], item[1]))
        circlePoints.push(circlePoints[0]) // 闭合
        let entities = viewer.entities.add({
            entitId: id,
            id: data.id,
            name: "画矩形",
            polyline: {
                positions: circlePoints,
                width: data.lineSize,
                // new Cesium.PolylineOutlineMaterialProperty // 加阴影方法
                material: new Cesium.Color.fromCssColorString(data.color || '#e7e91e'),
                clampToGround: true // 贴合地面
            }
        })
        if (data.lineType == 'solid') {
            entities.polyline.material = new Cesium.Color.fromCssColorString(data.color || '#e7e91e')
        } else {
            entities.polyline.material = new Cesium.PolylineDashMaterialProperty({
                color: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
                dashLength: 16,
            })
        }
        // entities.show=data.show
    }
    createCanvasWithText (text, fontSize, fontFamily, textColor) {
        // 创建 Canvas 元素
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        // 设置字体样式
        context.font = `${fontSize}px ${fontFamily}` // 字号-字体
        context.fillStyle = textColor // 填充色
        context.textAlign = 'center' // 文本对齐方式
        context.textBaseline = 'middle' // 文本基线对齐

        // 测量文本的宽度和高度
        const textMetrics = context.measureText(text)
        const textWidth = textMetrics.width
        const textHeight = fontSize // Approximate height, may vary based on font

        // 设置 Canvas 尺寸
        canvas.width = textWidth * 2 // Adding some padding
        canvas.height = textHeight * 1.5 // Adding some padding

        context.font = `${fontSize}px ${fontFamily}` // 字号-字体
        context.fillStyle = textColor // 填充色
        context.textAlign = 'center' // 文本对齐方式
        context.textBaseline = 'middle' // 文本基线对齐
        context.strokeStyle = 'red'
        context.lineWidth = 2 // 设置文本边框宽度为 2 像素
        // 绘制文本边框
        context.strokeText(text, canvas.width / 2, canvas.height / 2)

        // // 设置阴影属性
        // context.shadowColor = 'rgba(0, 0, 0, 0.5)' // 阴影颜色
        // context.shadowOffsetX = 2 // 阴影水平偏移
        // context.shadowOffsetY = 2 // 阴影垂直偏移
        // context.shadowBlur = 4 // 阴影模糊程度
        // 绘制文本
        context.fillText(text, canvas.width / 2, canvas.height / 2)

        return canvas
    }
    // 加载文字
    lookLabel (data, id) {
        console.log(data, '查看文字返回信息')
        const entity = viewer.entities.getById(data.id)//根据id获取到指定实体
        if (entity) {
            // entity.label.text._value = data.content
            // entity.label.font._value = data.size ? `${data.size}px sans-serif` : '25px sans-serif'
            // entity.label.fillColor._value = new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e')
        } else {

            // 使用示例
            const canvas = getCanvas(data)
            const imageUrl = canvas.toDataURL()

            let cartesian = Cesium.Cartesian3.fromDegrees(...data.coords.split(','))
            let entity1 = viewer.entities.add({
                position: cartesian,
                entitId: id,
                id: data.id,
                billboard: {
                    image: imageUrl, // 使用图像作为文字标绘的替代
                    scale: 1.0
                }
            })
            var heading = Cesium.Math.toRadians(data.wordAngle||0) // 旋转角度

            entity1.billboard.rotation = heading // 设置旋转角度

            let wordHeight = data.wordHeight ? data.wordHeight : 80000
            // 监听视图变化以调整缩放比例
            viewer.scene.postRender.addEventListener(() => {
                var camera = viewer.camera
                var distance = Cesium.Cartesian3.distance(camera.positionWC, cartesian)
                // var scale = Math.max(0.5, Math.min(2.0, 5000 / distance)) // 根据距离计算缩放比例
                var scale = Math.min(1.0, 5000 / distance) // 根据距离计算缩放比例
                // var scale = wordHeight / distance // 根据距离计算缩放比例
                entity1.billboard.scale = scale
            })

            // let cartesian = Cesium.Cartesian3.fromDegrees(...data.coords.split(','))
            // let entities = viewer.entities.add({
            //     position: cartesian,
            //     id: data.id,
            //     label: {
            //         text: data.content ? data.content : '',
            //         fillColor: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
            //         // font: data.size ? `${data.size}px sans-serif` : '25px sans-serif'
            //         font: data.size ? `${data.size}px sans-serif` : '25px sans-serif',
            //         style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            //         // fillColor: Cesium.Color.YELLOW,
            //         outlineColor: Cesium.Color.RED,
            //         outlineWidth: 2,
            //         // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            //         // verticalOrigin: Cesium.VerticalOrigin.CENTER,
            //         scale: 1.0
            //     }
            // })


        }
    }
    // 加载线
    lookPolyline (coords, id) {
        let center = []
        coords.split(';').forEach((item) => {
            item = Cesium.Cartesian3.fromDegrees(...item.split(','))
            center.push(item)
        })
        let entities = viewer.entities.add({
            name: "画线",
            polyline: {
                //使用CallbackProperty允许我们在用户点击时动态更新线段的位置
                positions: center,
                width: 2,
                material: Cesium.Color.YELLOW.withAlpha(0.5)
            }
        })
        entitiesAll.push({
            type: 'polyline',
            coords: coords,
            content: ''
        })
    }
    entitiesInfo () {
        // viewer.entities.add(entitiesAll[0])
        return entitiesAll
    }
    // 清除全部实体
    deleteAll () {
        entitiesAll = []
        viewer.entities.removeAll()
    }
    getStyle (row) {
        // styleFrom = row
        switch (row.type) {
            case 'label':
                this.lookLabel(row)
                break
            case 'ellipse':
                this.ellipse(row)
                break

            default:
                break
        }

    }
}
export default entities