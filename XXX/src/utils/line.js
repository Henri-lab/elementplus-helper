/*
 * @Author: XC
 * @Date: 2024-07-15 11:11:57
 * @LastEditors: XC
 * @LastEditTime: 2024-07-24 10:53:08
 * @FilePath: \RuoYi-Vue3-3.8.6\src\utils\line.js
 * @Description: 绘制线
 */
import eventCortol from "./handler";
import { extendEntity } from "./drawfunction";
export class drawLine {
  constructor(option) {
    console.log(option,'option');
    this.viewer = option.viewer;
    this.option = option;
    this.arrEntity = [];
    this.currentEntity = null;
    // this.eventCortol = null
    this.eventCortol = new eventCortol({ viewer: this.viewer });
    this.heandleClick();
    // 创建新的图层
    this.dataSource = new Cesium.CustomDataSource();
    this.viewer.dataSources.add(this.dataSource);
    this.editEntity();
    // this.defaultHandler()
    this.attribute = {
      edittype: "polyline",
      name: "线",
      type: "polyline",
      position: {
        minCount: 2,
      },
      style: {
        clampToGround: true,
        color: "#d1cb15",
        lineType: "solid",
        opacity: 1,
        outline: false,
        outlineColor: "#d1cb15",
        outlineWidth: 1,
        width: 2,
        zIndex: 0,
      },
    };
  }
  // 编辑事件
  editEntity() {
    let $this = this;
    // this.defaultHandler()
    //初始化编辑相关事件
    this.eventCortol.createEditSelectHandler(function (pickedEntity) {
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
  startDraw (id) {

    var entity = this.lineDraw(id);
    this.stopDraw();
    // return;
    // this.attribute.type;
    this.defaultHandler();
    //线
    this.eventCortol.createDrawPolylineHandler(
      entity,
      this.getPositions(entity)
    );
    // 扩展实体类
    extendEntity(this.option, entity, this.dataSource);
    this.arrEntity.push(entity);

    // entity.startDrawing();
    this.currentEntity = entity;

    return entity;
  }
  startDraw1() {
    var entity = this.lineDraw('');
    this.stopDraw();
    // return;
    // this.attribute.type;
    this.defaultHandler();
    //线
    this.eventCortol.createDrawPolylineHandler1(
      entity,
      this.getPositions(entity)
    );
    // 扩展实体类
    extendEntity(this.option, entity, this.dataSource);
    this.arrEntity.push(entity);

    // entity.startDrawing();
    this.currentEntity = entity;
    return entity;
  }
  lineDraw (id) {
    if (!id) {
      this.attribute = {
        edittype: "polyline",
        name: "线",
        type: "polyline",
        position: {
          minCount: 2,
        },
        style: {
          clampToGround: true,
          color: "#d1cb15",
          lineType: "solid",
          opacity: 1,
          outline: false,
          outlineColor: "#d1cb15",
          outlineWidth: 1,
          width: 2,
          zIndex: 0,
        },
      }
    }
    var entityattr = this.attribute2Entity(this.attribute);
    var entity = viewer.entities.add({
      id: id?id:new Date().getTime(),
      polyline: entityattr,
      attribute: this.attribute,
      _draw_positions: [],
    });

    entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
      return entity._draw_positions;
    }, false);

    return entity;
  }
  //   设置样式
  attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};

    if (entityattr == null) {
      entityattr = {
        followSurface: true,
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
        case "lineType": //跳过扩展其他属性的参数
        case "color":
        case "opacity":
        case "outline":
        case "outlineWidth":
        case "outlineColor":
        case "outlineOpacity":
          break;
      }
    }

    var color = new Cesium.Color.fromCssColorString(
      attribute.style.color || "#FFFF00"
    ).withAlpha(Number(attribute.style.opacity || 1.0));
    switch (attribute.style.lineType) {
      default:
      case "solid":
        //实线
        if (attribute.style.outline) {
          //存在衬色时
          entityattr.material = new Cesium.PolylineOutlineMaterialProperty({
            color: color,
            outlineWidth: Number(attribute.style.outlineWidth || 1.0),
            outlineColor: new Cesium.Color.fromCssColorString(
              attribute.style.outlineColor || "#FFFF00"
            ).withAlpha(
              Number(
                attribute.style.outlineOpacity || attribute.style.opacity || 1.0
              )
            ),
          });
        } else {
          entityattr.material = color;
        }
        break;
      case "dash": 
        //虚线
        if (attribute.style.outline) {
          //存在衬色时
          entityattr.material = new Cesium.PolylineDashMaterialProperty({
            dashLength:
              attribute.style.dashLength ||
              attribute.style.outlineWidth ||
              16.0,
            color: color,
            gapColor: new Cesium.Color.fromCssColorString(
              attribute.style.outlineColor || "#FFFF00"
            ).withAlpha(
              Number(
                attribute.style.outlineOpacity || attribute.style.opacity || 1.0
              )
            ),
          });
        } else {
          entityattr.material = new Cesium.PolylineDashMaterialProperty({
            dashLength: attribute.style.dashLength || 16.0,
            color: color,
          });
        }

        break;
    }

    return entityattr;
  }
  //   修改
  // getEditor(dataSource, entity, options) {
  //   return new PolylineEditor(dataSource, entity, options);
  // }
  setPositions(entity, positions) {
    entity._draw_positions = positions;
  }
  getPositions(entity) {
    return entity._draw_positions || entity.polyline.positions.getValue();
  }
  getlabel(entity) {
    if (entity.label !== undefined) {
      return entity.label.text.getValue();
    } else {
      return "";
    }
    // return entity.label.text.getValue();
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

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  }
  //   停止绘制
  stopDraw () {
    //释放上次未完成的绘制
    this.eventCortol.destroyDrawHandler();
    if (this.currentEntity && this.currentEntity.inProgress) {
      this.currentEntity.stopDrawing();
      this.dataSource.entities.remove(this.currentEntity);
      // removeArrayOne(this.arrEntity, this.currentEntity); //arrEntity.remove(currentEntity);
      for (var i = 0; i < this.arrEntity.length; i++) {
        if (this.arrEntity[i] == this.currentEntity) {
          this.arrEntity.splice(i, 1);
          break;
        }
      }
    }

    //释放在编辑的对象
    if (this.currentEntity && this.currentEntity.stopEditing) {
      this.currentEntity.stopEditing();
      this.currentEntity = null;
    }
    return this;
  }
  //   添加文字标识
  addlabel(text, position) {
    this.currentEntity.position = Cesium.Cartesian3.fromDegrees(
      position[0],
      position[1]
    );
    this.currentEntity.label = {
      text: text,
      font: "normal small-caps normal 25px 楷体",
      fillColor: Cesium.Color.YELLOW,
    };
    // this.dataSource.entities.add({
    //     label:{
    //         text: text,
    //         font: "normal small-caps normal 30px 楷体",
    //         fill: Cesium.Color.YELLOW
    //     },
    //     position:Cesium.Cartesian3.fromDegrees(position[0],position[1])
    // })
  }
  // 初始化点击事件
  defaultHandler() {
    console.log(this.viewer.screenSpaceEventHandler, "点击事件");
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
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
  //   加载线
  setline (text, positions, entitId, item) {
    this.attribute.style.color=item.color
    this.attribute.style.lineType = item.lineType
    this.attribute.style.width = item.lineSize
    let entities = this.startDraw(item.id);

    entities.entitId = entitId;
    let position = this.lonLatsToCartesians(positions);
    // this.addlabel(text, positions[positions.length - 1]);
    this.setPositions(entities, position);
    this.stopDraw();
    // MoveEntity.ConstructMoveEntity({viewer:this.viewer},function(entities){
    //   console.log(entities,'000000000000')
    // })
  }
  SetEntity() {
    return this.arrEntity;
  }
  //   删除单个
  deleteId(row) {
    this.dataSource.entities.remove(row);
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
      var cartesian = that.viewer.scene.pick(event.position).id;
      // console.log(cartesian);
      // var cartesian = this.getCurrentMousePosition(
      //   this.viewer.scene,
      //   event.position,
      //   entity
      // );
      if (cartesian) {
        that.dataSource.entities.remove(cartesian);
        that.arrEntity.map((item, index) => {
          if (item.id == cartesian.id) {
            that.arrEntity.splice(index, 1);
          }
        });
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
}

export default drawLine;
