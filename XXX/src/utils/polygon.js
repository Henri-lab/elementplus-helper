import eventCortol from "./handler";
import { extendEntity } from "./drawfunction";
import { color } from "echarts"
class DrawPolygon {
  constructor(option) {
    this.viewer = option.viewer;
    this.option = option;
    this.dataSource = new Cesium.CustomDataSource();
    this.viewer.dataSources.add(this.dataSource);
    this.defaultHandler();
    this.eventCortol = new eventCortol({ viewer: this.viewer });
    this.heandleClick()
    this.editEntity()
    this.arrEntity = [];
    this.currentEntity = null;
    this.attribute = {
      edittype: "polygon",
      name: "面",
      type: "polygon",
      position: {
        minCount: 3,
      },
      style: {
        clampToGround: true,
        color: "#d1cb15",
        fill: true,
        opacity: 0.6,
        outline: true,
        outlineColor: "#d1cb15",
        outlineOpacity: 0.6,
        outlineWidth: 1,
        zIndex: 0,
      },
    };
    this.cesiumStyle = {
      color: "#d1cb15",
      width: 2,
      lineType:'solid'
    }
  }
   // 编辑事件
   editEntity(){
    let $this = this;
       //初始化编辑相关事件
       this.defaultHandler()
       this.eventCortol.createEditSelectHandler(function (pickedEntity) {
        console.log(pickedEntity,'')
        if ($this.currentEntity && $this.currentEntity.inProgress)
          //正在绘制中entity跳出
          return;
        if (pickedEntity == null) {
          $this.stopDraw();
          if (
            $this.option.onStopEditing &&
            typeof $this.option.onStopEditing == "function"
          ) {
            $this.option.onStopEditing(null);
          }
          return;
        }
  
        if (pickedEntity === $this.currentEntity)
          //单击了当前entity跳出
          return;
  
        if ($this.currentEntity && $this.currentEntity.stopEditing) {
          $this.currentEntity.stopEditing();
          $this.currentEntity = null;
        }
        $this.currentEntity = pickedEntity;
        if ($this.currentEntity && $this.currentEntity.startEditing) {
          $this.currentEntity.startEditing();
        }
      });
      this.eventCortol.createEditDraggerHandler();
    }
  startDraw(id) {
    var entity = this.ploygonDraw(id);
    this.stopDraw();
    //面
    this.eventCortol.createDrawPolygonHandler(
      entity,
      this.getPositions(entity)
    );
    // 扩展实体类
    extendEntity(this.option, entity,this.dataSource);
    this.arrEntity.push(entity);

    // entity.startDrawing();
    this.currentEntity = entity;
    this.defaultHandler()
    //   drawOkCalback
    return entity;
  }
  SetEntity(){
    return this.arrEntity
  }
  stopDraw() {
    //释放上次未完成的绘制
    this.eventCortol.destroyDrawHandler();
    if (this.currentEntity && this.currentEntity.inProgress) {
      //   this.currentEntity.stopDrawing();
      // this.dataSource.entities.remove(this.currentEntity);
      // removeArrayOne(this.arrEntity, this.currentEntity); //arrEntity.remove(currentEntity);
    }

    //释放在编辑的对象
    if (this.currentEntity && this.currentEntity.stopEditing) {
        this.currentEntity.stopEditing();
      this.currentEntity = null;
    }
    return this;
  }
  ploygonDraw (id) {
    if (!id) {
      this.cesiumStyle = {
        color: "#d1cb15",
        width: 2,
        lineType: 'solid'
      }
    }
    var entityattr = this.attribute2Entity(this.attribute);
    var addattr = {
      id: id ? id : new Date().getTime(),
      polygon: entityattr,
      attribute: this.attribute,
      _draw_positions: [],
    };
    if (!this.attribute.style.extrudedHeight) {
      //边线特殊处理
      addattr.polyline = {
        clampToGround: this.attribute.style.clampToGround,
        show: false,
      };
    }
    var entity = viewer.entities.add(addattr);
    entity.polygon.hierarchy = new Cesium.CallbackProperty(function (time) {
      return new Cesium.PolygonHierarchy(entity._draw_positions);
      // return entity._draw_positions;
    }, false);

    if (entity.polyline) {
      //边线
      entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
        if (!entity.polyline.show.getValue()) return null;

        return entity._draw_positions.concat([entity._draw_positions[0]]);
      }, false);
      entity.polyline.show = new Cesium.CallbackProperty(function (time) {
        return (
          entity.polygon.outline &&
          entity.polygon.outline.getValue() &&
          entity.polygon.outlineWidth &&
          entity.polygon.outlineWidth.getValue() > 1
        );
      }, false);
      entity.polyline.width = this.cesiumStyle.width
      // entity.polyline.color = new Cesium.CallbackProperty(function (time) {
      //   return entity.polygon.outlineColor;
      // }, false);
      if (this.cesiumStyle.lineType == 'solid') {
        entity.polyline.material = new Cesium.Color.fromCssColorString(this.cesiumStyle.color);
        
      } else {
        entity.polyline.material = new Cesium.PolylineDashMaterialProperty({
          color: new Cesium.Color.fromCssColorString(this.cesiumStyle.color), // 线条颜色
          dashLength: 16 // 虚线的长度
        });
        
      }
    }

    return entity;
  }
  attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      entityattr = {
        fill: true,
        classificationType: Cesium.ClassificationType.BOTH,
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || attribute.style.color || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "color":
          //填充颜色
          entityattr.material = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
        case "extrudedHeight":
          //高度
          var maxHight = 0;
          if (entityattr.hierarchy)
            maxHight = drawutils.getMaxHeightForPositions(
              entityattr.hierarchy.getValue()
            );
          entityattr.extrudedHeight = Number(value) + maxHight;
          break;
        case "clampToGround":
          //贴地
          entityattr.perPositionHeight = !value;
          break;
      }
    }
    entityattr.fill = false;
    entityattr.outlineWidth = 2;
    entityattr.outlineColor = new Cesium.Color.fromCssColorString(
             "#FFFF00"
          ).withAlpha(0);

    //如果未设置任何material，默认设置随机颜色
    if (attribute.style.color == null) {
      entityattr.material = Cesium.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(attribute.style.opacity || 1.0),
      });
    }
    console.log(entityattr,'entityattr');
    return entityattr;
  }
  //   getEditor(dataSource, entity, options) {
  //     if (entity.polygon.extrudedHeight) {
  //       return new PolygonExtrudedEditor(dataSource, entity, options);
  //     } else {
  //       return new PolygonEditor(dataSource, entity, options);
  //     }
  //   }
  setPositions(entity, position) {
    entity._draw_positions = position;

    //存在extrudedHeight高度设置时
    // if (entity.attribute.style.extrudedHeight) {
    //   var maxHight = drawutils.getMaxHeightForPositions(position);
    //   entity.polygon.extrudedHeight =
    //     maxHight + Number(entity.attribute.style.extrudedHeight);
    // }
  }
  getPositions(entity) {
    if (entity._draw_positions) return entity._draw_positions;

    var arr = entity.polygon.hierarchy.getValue();
    if (arr.positions && this.isArray(arr.positions)) return arr.positions;
    return arr;
  }
  isArray(obj) {
    return (
      (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object" &&
      obj.constructor == Array
    );
  }
  getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = this.getDrawutilsCoordinates(positions);
    return coordinates;
  }
  getDrawutilsCoordinates(positions) {
    var coordinates = [];
    for (var i = 0; i < positions.length; i++) {
      var carto = Cesium.Cartographic.fromCartesian(positions[i]);

      var lng = Number(Cesium.Math.toDegrees(carto.longitude).toFixed(6));
      var lat = Number(Cesium.Math.toDegrees(carto.latitude).toFixed(6));
      var height = Number(carto.height.toFixed(1));

      coordinates.push([lng, lat, height]);
    }
    return coordinates;
  }
  toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    if (coordinates.length > 0) {
      var first = coordinates[0];
      var last = coordinates[coordinates.length - 1];
      if (first[0] != last[0] || first[1] != last[1] || first[2] != last[2]) {
        coordinates.push(first);
      }
    }

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "Polygon",
        coordinates: coordinates,
      },
    };
  }
  //   添加文字标识
  addlabel(text, position) {
    this.currentEntity.position = Cesium.Cartesian3.fromDegrees(
      position[0],
      position[1]
    );
    this.currentEntity.label = {
      text: text,
      font: "normal small-caps normal 20px 楷体",
      fillColor: Cesium.Color.YELLOW,
    };
  }
  // 加载面
  setPolygon(text, positions,entitId,item) {
  //  this.attribute.style.color=item.color
    //   this.attribute.style.lineType = item.lineType
    console.log(item,'查看加载面');
    this.cesiumStyle.color = item?.color
    this.cesiumStyle.lineType = item?.lineType
    this.cesiumStyle.width = item?.lineSize
    let entities = this.startDraw(item?.id);
    entities.entitId = entitId;
    let position = this.lonLatsToCartesians(positions);
    // this.addlabel(text, positions[positions.length - 1]);
    this.setPositions(entities,position);
    this.stopDraw();
  }
  getlabel(entity){
    if(entity.label !==undefined){
      return entity.label.text.getValue();
    }else{
      return "";
    }
    
    
  }
    //   删除单个
    deleteId(row) {
      this.dataSource.entities.remove(row);
    }
  //   坐标转换
  lonLatsToCartesians(coords) {
    var lonlats = [];
    for (var i = 0; i < coords.length; i++) {
      var lonlat = [
        Number(coords[i][0]),
        Number(coords[i][1]),
        Number(coords[i][2] || 0),
      ];
      lonlats = lonlats.concat(lonlat);
    }
    return Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
  }
  // 初始化点击事件
  defaultHandler() {
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
  }
  //删除所有
  deleteAll() {
    this.stopDraw();
    this.dataSource.entities.removeAll();
    this.arrEntity = [];
  }
  heandleClick() {
    let that = this;
    var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction(function (event) {
      var cartesian = that.viewer.scene.pick(event.position);
      // var cartesian = this.getCurrentMousePosition(
      //   this.viewer.scene,
      //   event.position,
      //   entity
      // );
      if (cartesian) {
        that.dataSource.entities.remove(cartesian.id);
        that.arrEntity.map((item,index)=>{
          if(item.id == cartesian.id.id){
            that.arrEntity.splice(index,1)
          }
        })
        
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    
  }
}
export default DrawPolygon;
