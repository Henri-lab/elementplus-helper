// DrawPolygon
/*
绘制面
 */
class DrawPolygon {
    constructor(arg) {
        this.viewer = arg;
        // this.callback = arg.callback;
        this._polygon = null; //活动面
        this._polygonLast = null; //最后一个面
        this._positions = []; //活动点
        this._entities_point = []; //脏数据
        this._entities_polygon = []; //脏数据
        this._entities_label = []; //脏数据
        this._polygonData = null; //用户构造面
        this._lonlatData = []; //转换后的数据
    }

    //返回最后活动面
    get polygon() {
        return this._polygonLast;
    }

    //返回面数据用于加载面
    getData() {
        this._polygonData.map(item => [
            this._lonlatData.push(this.GetWGS84FromDKR(item))
        ])
        return this._lonlatData;
    }
    GetWGS84FromDKR(coor) {
        // console.log(coor);
        let cartographic = Cesium.Cartographic.fromCartesian(coor);
        let x = Cesium.Math.toDegrees(cartographic.longitude);
        let y = Cesium.Math.toDegrees(cartographic.latitude);
        let wgs84 = {
            x: x,
            y: y,
        };
        return wgs84;
    }
    //加载面
    loadPolygon(data) {
        var $this = this;
        return this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(data),
                clampToGround: true,
                show: true,
                fill: true,
                material: Cesium.Color.WHITE.withAlpha(0.5),
                width: 3,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                outline: false
            }
        });
    }

    //开始绘制
    startCreate() {
        var $this = this;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
            }

                $this._positions.push(cartesian);
            
            $this.createPoint(cartesian);

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制面
            if (evt.endPosition) {
                // console.log($this._positions)
                if ($this._positions.length < 1) return;
                var cartesian = $this.getCatesian3FromPX(evt.endPosition);
                if (cartesian) {
                    if ($this._positions.length == 3) {
                        if (!Cesium.defined($this._polygon)) {
                            $this._polygon = $this.createPolygon();
                        }
                    }
                    $this._positions.pop();
                    $this._positions.push(cartesian);
                }

            }

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            console.log($this._polygon,$this._positions)
            if (!$this._polygon) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);
            $this._polygonData = $this._positions.concat();
            $this.viewer.entities.remove($this._positions); //移除
            $this._positions = null;
            $this._positions = [];
            var Polygon = $this.loadPolygon($this._polygonData);
            $this._entities_polygon.push(Polygon);
            $this._polygonLast = Polygon;
            // if (typeof $this.callback == "function") {
            //     $this.callback(Polygon);
            // }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    //创建面
    createPolygon() {
        var $this = this;
        var polygon = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.CallbackProperty(function () {
                    return new Cesium.PolygonHierarchy($this._positions);
                }, false),
                clampToGround: true,
                show: true,
                fill: true,
                material: Cesium.Color.WHITE.withAlpha(0.5),
                width: 3,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                outline: false
            }
        });
        $this._entities_polygon.push(polygon);
        return polygon;
    }

    //创建点
    createPoint(cartesian) {
        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW,
            }
        });
        $this._entities_point.push(point);
        return point;
    }
    //销毁事件
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    //清空实体对象
    clear() {
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_polygon.length; i++) {
            this.viewer.entities.remove(this._entities_polygon[i]);
        }
        for (var i = 0; i < this._entities_label.length; i++) {
            this.viewer.entities.remove(this._entities_label[i]);
        }
        this._polygon = null; //活动面
        this._polygonLast = null; //最后一个面
        this._positions = []; //活动点
        this._entities_point = []; //活动点
        this._entities_polygon = []; //面数据
        this._polygonData = null; //用户构造面
        this._lonlatData = []; //转换后的数据
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }
}

export default DrawPolygon