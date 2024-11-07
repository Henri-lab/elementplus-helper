import { ElMessage, ElMessageBox, ElLoading } from "element-plus"
import bus from '@/utils/bus'
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
        // 注册鼠标事件
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        let info = {}
        // 鼠标双击事件
        handler.setInputAction(event => {
            pickedObjectArrays = viewer.scene.drillPick(event.position)
            if (!!pickedObjectArrays) {
                // 当双击到实体，传回页面操作样式
                bus.emit('leftDouble', pickedObjectArrays[0])
            }
            console.log(pickedObjectArrays,'pickedObjectArrays');
            // 判断双击拿到的是圆
            if (!!pickedObjectArrays[0] && pickedObjectArrays[0].id.ellipse) {
                this.setEllipse(pickedObjectArrays[0].id) // 调用修改圆的方法
            }
            // 判断拿到的是矩形
            if (!!pickedObjectArrays[0] && pickedObjectArrays[0].id.rectangle) {
                this.setRectangle(pickedObjectArrays[0].id) // 调用修改矩形的方法
            }
            // // 当点击拿到文字实例时进行操作
            if (!!pickedObjectArrays[0] && pickedObjectArrays[0].id.label) {
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
        // handler.setInputAction(e => {
        //     let pick = viewer.scene.pick(e.position)
        //     if (!!pick && pick.id.id == pickedObjectArrays[0].id.id) {
        //         viewer.entities.removeById(pickedObjectArrays[0].id.id)
        //         isSet = true
        //         viewer.scene.screenSpaceCameraController.enableRotate = true//解锁相机
        //     }
        //     isSet = false

        // }, Cesium.ScreenSpaceEventType.RIGHT_UP)
        // 鼠标右键抬起
        handler.setInputAction(e => {
            let pick = viewer.scene.pick(e.position)
            if (!!pick) {
                bus.emit("remMap", pick.id.id)
                viewer.entities.removeById(pick.id.id)
            }

        }, Cesium.ScreenSpaceEventType.RIGHT_UP)
        // // 鼠标按下

        // // handler.setInputAction(e => {
        // //             let pick = this.viewer.scene.pick(e.position)
        // //             if (Cesium.defined(pick) && (pick.id.id)) {
        // //                 this.pick = pick
        // //                 this.leftDownFlag = true
        // //                 this.viewer.scene.screenSpaceCameraController.enableRotate = false//锁定相机
        // //             }
        // //         }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

        handler.setInputAction(e => {
            pick = viewer.scene.pick(e.position)
            // if (pick && pick.id.id == pickedObjectArrays[0].id.id) {
            //     isSet = true
            //     viewer.scene.screenSpaceCameraController.enableRotate = false//解锁相机
            // }
            // 当按下获取到实例且为文字时触发
            if (pick && pick.id.label) {
                isSet = true
                viewer.scene.screenSpaceCameraController.enableRotate = false//解锁相机
            }

        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    }
    mouseMoveAction () {
        handler.setInputAction(event => {
            if (viewer.scene.camera.pickEllipsoid(event.endPosition)) {
                pickedObjectArrays[0].id.position._value = viewer.scene.camera.pickEllipsoid(event.endPosition)

            }
            // if (this.leftDownFlag === true && this.pick != null) {
            //     let ray = this.viewer.camera.getPickRay(e.endPosition)
            //     let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene)

            //     this.pick.id.position = cartesian
            //     // this.pick.id.position = new Cesium.CallbackProperty(function () {
            //     //     return cartesian;
            //     // }, false);//感觉拖拽有点卡顿

            // }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
    leftDownAction () {
        handler.setInputAction(e => {
            let pick = viewer.scene.pick(e.position)
            if (pick) {
                this.mouseMoveAction()
            }
            // if (Cesium.defined(pick) && (pick.id.id)) {
            //     this.pick = pick
            //     this.leftDownFlag = true
            //     this.viewer.scene.screenSpaceCameraController.enableRotate = false//锁定相机
            // }
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
        // 获取当前矩形的弧度 转为经纬度
        let west = Cesium.Math.toDegrees(data.rectangle.coordinates._value.west)
        let north = Cesium.Math.toDegrees(data.rectangle.coordinates._value.north)
        let east = Cesium.Math.toDegrees(data.rectangle.coordinates._value.east)
        let south = Cesium.Math.toDegrees(data.rectangle.coordinates._value.south)
        // 经纬度转为两点的笛卡尔坐标
        let topLeftPoint = Cesium.Cartesian3.fromDegrees(west, north)
        let bottomRightPoint = Cesium.Cartesian3.fromDegrees(east, south)
        // 创建两个用于接收原始坐标
        let topLeftPointNew = {}
        let bottomRightPointNew = {}
        let startPosition = new Cesium.Cartesian3()
        data.rectangle.coordinates = new Cesium.CallbackProperty(() => {
            let west = Cesium.Cartographic.fromCartesian(topLeftPoint).longitude
            let north = Cesium.Cartographic.fromCartesian(topLeftPoint).latitude
            let east = Cesium.Cartographic.fromCartesian(bottomRightPoint).longitude
            let south = Cesium.Cartographic.fromCartesian(bottomRightPoint).latitude
            return new Cesium.Rectangle(west, south, east, north)
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

            } else if (ellPick && ellPick.id.rectangle) {
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
                    // pickedObjectArrays[0].id.position._value = viewer.scene.camera.pickEllipsoid(event.endPosition)
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
            let info = {
                id: id,
                coords: west + ',' + north + ';' + east + ',' + north + ';' + east + ',' + south + ';' + west + ',' + south + ';',
            }
            // 信息传回父页面记录
            bus.emit('setMap', {
                data: info,
                isShow: false
            })
            data.rectangle.coordinates = new Cesium.Rectangle(topLeftPoint1.longitude, bottomRightPoint1.latitude, bottomRightPoint1.longitude, topLeftPoint1.latitude)
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
        // 先深拷贝当前圆的半径
        let radius = JSON.stringify(JSON.parse(data.ellipse.semiMajorAxis._value))
        let id = JSON.stringify(JSON.parse(data.id))
        let setRadius = false // 默认不修改半径
        let setPosition = false // 默认不修改位置
        let ellPick = {} // 定义对象用来接收点击到的实例

        data.ellipse.semiMinorAxis = new Cesium.CallbackProperty(() => {
            return radius
        }, false)
        data.ellipse.semiMajorAxis = new Cesium.CallbackProperty(() => {
            return radius
        }, false)
        // 标注圆心 用于后期移动位置
        let poin = viewer.entities.add({
            position: data.position,
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

            } else if (ellPick && ellPick.id.ellipse) {
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

                }
            } else if (setRadius) {
                // 修改半径
                let cartesian = viewer.scene.camera.pickEllipsoid(event.endPosition)
                radius = Cesium.Cartesian3.distance(ellPick.id.position._value, cartesian)
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        // 鼠标双击事件
        setHandler.setInputAction(event => {
            let cartographic = Cesium.Cartographic.fromCartesian(poin.position._value) // 笛卡尔转经纬度
            let longitude = Cesium.Math.toDegrees(cartographic.longitude)
            let latitude = Cesium.Math.toDegrees(cartographic.latitude)
            let info = {
                id: id,
                coords: longitude + ',' + latitude + ';' + radius,
            }
            // 信息传回父页面记录
            bus.emit('setMap', {
                data: info,
                isShow: false
            })
            data.ellipse.semiMinorAxis = radius
            data.ellipse.semiMajorAxis = radius
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
    // DrawCircle () {
    //     return new Promise((resolve, reject) => {
    //         let centerPoint = null
    //         let centerPointEntity = null  // 用于存储中点实体的引用
    //         let radius = 10
    //         viewer.scene.globe.depthTestAgainstTerrain = false

    //         // viewer.entities.removeAll()
    //         let drawingCircle = viewer.entities.add({
    //             id: new Date().getTime(),
    //             name: "画圆",
    //             polyline: {
    //                 positions: circlePoints,
    //                 width: 2,
    //                 material: new Cesium.PolylineDashMaterialProperty({
    //                     color: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
    //                     dashLength: 10.0
    //                 }),
    //                 clampToGround: true // 贴合地面
    //             }
    //         })

    //         let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

    //         handler.setInputAction(event => {
    //             var cartesian = viewer.scene.camera.pickEllipsoid(event.position)
    //             if (cartesian && centerPoint === null) {
    //                 centerPoint = cartesian
    //                 drawingCircle.position = centerPoint

    //                 // 添加中点实体并保存其引用
    //                 centerPointEntity = viewer.entities.add({
    //                     position: cartesian,
    //                     point: {
    //                         color: Cesium.Color.RED,
    //                         pixelSize: 5
    //                     }
    //                 })
    //             }
    //         }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    //         handler.setInputAction(event => {
    //             if (centerPoint) {
    //                 let cartesian = viewer.scene.camera.pickEllipsoid(event.endPosition)
    //                 if (cartesian) {
    //                     let distance = Cesium.Cartesian3.distance(centerPoint, cartesian)
    //                     radius = distance
    //                 }
    //             }
    //         }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    //         handler.setInputAction(() => {
    //             if (centerPoint !== null && radius > 0) {
    //                 viewer.entities.remove(centerPointEntity)
    //                 handler.destroy() // 关闭鼠标事件监听，结束绘制
    //                 drawingCircle.ellipse.semiMinorAxis = radius
    //                 drawingCircle.ellipse.semiMajorAxis = radius
    //                 let circleCenter = Cesium.Cartographic.fromCartesian(centerPoint)
    //                 let lng = Cesium.Math.toDegrees(circleCenter.longitude)
    //                 let lat = Cesium.Math.toDegrees(circleCenter.latitude)
    //                 resolve(
    //                     {
    //                         type: 'ellipse',
    //                         coords: Number(lng).toFixed(6) + ',' + Number(lat).toFixed(6) + ';' + radius,
    //                         id: drawingCircle.id
    //                     }

    //                 )
    //                 // resolve({
    //                 //     center: { lng: lng, lat: lat },
    //                 //     radius: radius
    //                 // })
    //             }
    //         }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    //     })
    // };
    DrawCircle () {
        return new Promise((resolve, reject) => {
            let centerPoint = null
            let centerPointEntity = null  // 用于存储中点实体的引用
            let radius = 10
            viewer.scene.globe.depthTestAgainstTerrain = false

            // viewer.entities.removeAll()
            let drawingCircle = viewer.entities.add({
                id: new Date().getTime(),
                name: "画圆",
                ellipse: {
                    semiMinorAxis: new Cesium.CallbackProperty(() => {
                        return radius
                    }, false),
                    semiMajorAxis: new Cesium.CallbackProperty(() => {
                        return radius
                    }, false),
                    material: Cesium.Color.YELLOW.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 2,
                    fill: false,  //为true时只显示轮廓线
                }
            })

            let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

            handler.setInputAction(event => {
                var cartesian = viewer.scene.camera.pickEllipsoid(event.position)
                if (cartesian && centerPoint === null) {
                    centerPoint = cartesian
                    drawingCircle.position = centerPoint

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

            handler.setInputAction(event => {
                if (centerPoint) {
                    let cartesian = viewer.scene.camera.pickEllipsoid(event.endPosition)
                    if (cartesian) {
                        let distance = Cesium.Cartesian3.distance(centerPoint, cartesian)
                        radius = distance
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

            handler.setInputAction(() => {
                if (centerPoint !== null && radius > 0) {
                    viewer.entities.remove(centerPointEntity)
                    handler.destroy() // 关闭鼠标事件监听，结束绘制
                    // entitiesAll.push({
                    //     position: centerPoint,
                    //     // id: drawingCircle.id,
                    //     name: "画圆",
                    //     ellipse: {
                    //         semiMinorAxis: radius,
                    //         semiMajorAxis:radius,
                    //         material: Cesium.Color.BLUE.withAlpha(0.2),
                    //         outline: true,
                    //         outlineColor: Cesium.Color.RED,
                    //         outlineWidth: 2,
                    //         fill: true,  //为true时只显示轮廓线
                    //     }
                    // })
                    drawingCircle.ellipse.semiMinorAxis = radius
                    drawingCircle.ellipse.semiMajorAxis = radius
                    let circleCenter = Cesium.Cartographic.fromCartesian(centerPoint)
                    let lng = Cesium.Math.toDegrees(circleCenter.longitude)
                    let lat = Cesium.Math.toDegrees(circleCenter.latitude)
                    resolve(
                        {
                            type: 'ellipse',
                            coords: Number(lng).toFixed(6) + ',' + Number(lat).toFixed(6) + ';' + radius,
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
    /**
   * 动态绘制矩形
   */
    DrawRectangle = () => {
        var allPoints = []
        // 设置返回值
        return new Promise((resolve, reject) => {
            let topLeftPoint = null
            let bottomRightPoint = null

            let drawingRectangle = viewer.entities.add({
                id: new Date().getTime(),
                name: "画矩形",
                rectangle: {
                    coordinates: new Cesium.CallbackProperty(() => {
                        if (topLeftPoint === null || bottomRightPoint === null) {
                            return
                        }
                        let west = topLeftPoint.longitude
                        let north = topLeftPoint.latitude
                        let east = bottomRightPoint.longitude
                        let south = bottomRightPoint.latitude
                        return new Cesium.Rectangle(west, south, east, north)
                    }, false),
                    material: Cesium.Color.YELLOW.withAlpha(0.5),
                    closeTop: true,
                    closeBottom: false,
                    outlineColor: Cesium.Color.YELLOW,
                    fill: false,
                    outline: true,
                }
            })

            let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

            handler.setInputAction(event => {
                var cartesian = viewer.scene.camera.pickEllipsoid(event.position)
                if (cartesian) {
                    if (topLeftPoint === null) {
                        topLeftPoint = Cesium.Cartographic.fromCartesian(cartesian)
                    }

                    // viewer.entities.add({
                    //     position: cartesian,
                    //     point: {
                    //         color: Cesium.Color.RED,
                    //         pixelSize: 10
                    //     }
                    // })
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

            handler.setInputAction(event => {
                if (topLeftPoint) {
                    bottomRightPoint = Cesium.Cartographic.fromCartesian(viewer.scene.camera.pickEllipsoid(event.endPosition))
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

            handler.setInputAction(() => {
                if (topLeftPoint !== null && bottomRightPoint !== null) {
                    drawingRectangle.rectangle.coordinates = new Cesium.Rectangle(topLeftPoint.longitude, bottomRightPoint.latitude, bottomRightPoint.longitude, topLeftPoint.latitude)
                    handler.destroy() // 关闭鼠标事件监听，结束绘制
                    let west = Cesium.Math.toDegrees(topLeftPoint.longitude)
                    let north = Cesium.Math.toDegrees(topLeftPoint.latitude)
                    let east = Cesium.Math.toDegrees(bottomRightPoint.longitude)
                    let south = Cesium.Math.toDegrees(bottomRightPoint.latitude)

                    allPoints.push({ lng: west, lat: north })
                    allPoints.push({ lng: east, lat: north })
                    allPoints.push({ lng: east, lat: south })
                    allPoints.push({ lng: west, lat: south })
                    allPoints.push(allPoints[0]) // 闭合
                    entitiesAll.push({
                        type: 'rectangle',
                        coords: west + ',' + north + ';' + east + ',' + north + ';' + east + ',' + south + ';' + west + ',' + south + ';',
                        content: ''
                    })
                    resolve(
                        {
                            type: 'rectangle',
                            coords: west + ',' + north + ';' + east + ',' + north + ';' + east + ',' + south + ';' + west + ',' + south + ';',
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
                    // viewer.entities.add({
                    //     position: cartesian,
                    //     point: {
                    //         color: Cesium.Color.RED,
                    //         pixelSize: 10
                    //     }
                    // })
                    // 获取地理坐标（经纬度）
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
                    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
                    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
                    let height = Cesium.Math.toDegrees(cartographic.height)
                    // 将绘制的点添加到数组中
                    drawnPoints.push({ lng: longitude, lat: latitude, height: height })
                    // entitiesAll.push({
                    //     type: 'label',
                    //     coords: longitude + ',' + latitude,
                    //     // content: ''
                    // })
                    // ElMessageBox.prompt("请输入文字", "提示", {
                    //     confirmButtonText: "确认",
                    //     cancelButtonText: "取消",
                    // })
                    //     .then(({ value }) => {
                    //         viewer.entities.add({
                    //             position: cartesian,
                    //             label: {
                    //                 text: value,
                    //                 // fillColor: Cesium.Color.YELLOW,
                    //                 fillColor: new Cesium.Color.fromCssColorString('#F10E0E'),
                    //                 font: '25px sans-serif'
                    //             }
                    //         })
                    //         entitiesAll.push({
                    //             type: 'label',
                    //             coords: longitude + ',' + latitude,
                    //             content: value
                    //         })
                    //         ElMessage({
                    //             type: "success",
                    //             message: "添加成功",
                    //         })
                    //         resolve(value)
                    //     })
                    //     .catch(() => {
                    //         ElMessage({
                    //             type: "info",
                    //             message: "停止标汇",
                    //         })
                    //     })
                    resolve({
                        id: new Date().getTime(),
                        type: 'label',
                        coords: longitude + ',' + latitude,
                        // content: ''
                    })
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
    // ellipse (data, id) {
    //     console.log(data, 'data')
    //     const entity = viewer.entities.getById(data.id)//根据id获取到指定实体
    //     if (entity) {
    //         entity.ellipse.outlineColor._value = new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e')
    //     } else {
    //         let center1 = data.coords.split(';')
    //         let destination = center1[0].split(',')


    //         // 圆心坐标（经度、纬度）
    //         const centerLongitude =Number(destination[0]) 
    //         const centerLatitude =Number(destination[1]) 

    //         // 圆半径（单位：米）
    //         const radius = center1[1]

    //         // 圆的边界点数量
    //         const numPoints = 100

    //         // 计算圆的边界点
    //         const circlePoints = []
    //         const angleIncrement = 2 * Math.PI / numPoints

    //         for (let i = 0; i < numPoints; i++) {
    //             const angle = i * angleIncrement

    //             // 计算圆上的点（经纬度到笛卡尔坐标）
    //             const offsetX = radius * Math.cos(angle)
    //             const offsetY = radius * Math.sin(angle)

    //             // 将笛卡尔坐标转换为经纬度
    //             const offset = Cesium.Cartesian3.fromDegrees(centerLongitude, centerLatitude, 0)
    //             const offsetPosition = Cesium.Cartesian3.fromDegrees(centerLongitude + offsetX / 111320, centerLatitude + offsetY / 110540, 0)

    //             circlePoints.push(offsetPosition)
    //         }
    //         circlePoints.push(circlePoints[0]) // 闭合圆
    //         console.log(circlePoints,'circlePoints');
    //         // 添加虚线圆到视图
    //         viewer.entities.add({
    //             polyline: {
    //                 positions: circlePoints,
    //                 width: 2,
    //                 material: new Cesium.PolylineDashMaterialProperty({
    //                     color: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
    //                     dashLength: 10.0
    //                 }),
    //                 clampToGround: true // 贴合地面
    //             }
    //         });
    //     }
    // }
    ellipse (data, id) {
        console.log(data, 'data')
        const entity = viewer.entities.getById(data.id)//根据id获取到指定实体
        if (entity) {
            entity.ellipse.outlineColor._value = new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e')
        } else {
            let center = data.coords.split(';')
            let destination = center[0].split(',')
            let entities = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(destination[0], destination[1]),
                // id: drawingCircle.id,
                id: data.id,
                name: "画圆",
                ellipse: {
                    semiMinorAxis: center[1],
                    semiMajorAxis: center[1],
                    // material: Cesium.Color.YELLOW.withAlpha(0.5),
                    outline: true,
                    outlineColor: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
                    outlineWidth: 100,
                    height: 0.0,
                    fill: false,  //为true时只显示轮廓线
                    show: true
                    // clampToGround: true,
                }
            })
            // entities.show = data.show
        }
        // entitiesAll.push({
        //     type: 'ellipse',
        //     coords: coords,
        //     content: ''
        // })
    }
    // 画矩形
    rectangle (data, id) {
        let center = data.coords.split(';').map((item) => item.split(','))
        let topLeftPoint = Cesium.Cartographic.fromCartesian(Cesium.Cartesian3.fromDegrees(...center[0]))
        let bottomRightPoint = Cesium.Cartographic.fromCartesian(Cesium.Cartesian3.fromDegrees(...center[2]))

        let west = topLeftPoint.longitude
        let north = topLeftPoint.latitude
        let east = bottomRightPoint.longitude
        let south = bottomRightPoint.latitude
        let coordinates = new Cesium.Rectangle(west, south, east, north)
        let entities = viewer.entities.add({
            id: data.id,
            name: "画矩形",
            rectangle: {
                coordinates: coordinates,
                material: Cesium.Color.YELLOW.withAlpha(0.5),
                closeTop: true,
                closeBottom: false,
                // outlineColor: Cesium.Color.YELLOW,
                outlineColor: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
                fill: false,
                outline: true,
                outlineWidth: 4,
            }
        })
        // entities.show=data.show
    }
    // 加载文字
    lookLabel (data, id) {
        const entity = viewer.entities.getById(data.id)//根据id获取到指定实体
        if (entity) {
            entity.label.text._value = data.content
            entity.label.font._value = data.size ? `${data.size}px sans-serif` : '25px sans-serif'
            entity.label.fillColor._value = new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e')
        } else {

            let cartesian = Cesium.Cartesian3.fromDegrees(...data.coords.split(','))
            let entities = viewer.entities.add({
                position: cartesian,
                id: data.id,
                label: {
                    text: data.content ? data.content : '',
                    fillColor: new Cesium.Color.fromCssColorString(data.color ? data.color : '#e7e91e'),
                    // font: data.size ? `${data.size}px sans-serif` : '25px sans-serif'
                    font: data.size ? `${data.size}px sans-serif` : '25px sans-serif',
                    rotation: Cesium.Math.toRadians(45)
                }
            })
            // entities.show = data.show
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