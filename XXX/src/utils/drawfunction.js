/**
 * 扩展entity实体，绑定一些方法
 */
export function extendEntity(options, entity, dataSource) {
  var currentEntity;
  //绘制开始、修改、结束
  // entity.startDrawing = function () {

  //   var entity = this;
  //   if (
  //     options.onStartDrawing &&
  //     typeof options.onStartDrawing == "function"
  //   ) {
  //     options.onStartDrawing(entity);
  //   }
  // };
  entity.changeDrawing = function () {
    var entity = this;
    if (
      options.onChangeDrawing &&
      typeof options.onChangeDrawing == "function"
    ) {
      options.onChangeDrawing(entity);
    }
  };
  entity.moveDrawing = function () {
    var entity = this;
    if (options.onMoveDrawing && typeof options.onMoveDrawing == "function") {
      options.onMoveDrawing(entity);
    }
  };
  entity.stopDrawing = function () {
    var entity = this;
    if (options.onStopDrawing && typeof options.onStopDrawing == "function") {
      options.onStopDrawing(entity);
    }
  };

  //编辑开始、修改、结束
  entity.startEditing = function () {
    // if (!_hasEdit) return;
    var entity = this;
    currentEntity = entity;
    console.log(dataSource)
    //绑定编辑器
    if (entity.editor == null) {
      var type = entity.attribute.type;
      console.log(type,'type ')
      if (type == "polyline") {
        entity.editor = new PolylineEditor(dataSource, entity, options);
        // entity.editor = control[type].getEditor(dataSource, entity, {
        //   dragIcon: dragIcon,
        // });
      }
      if (type == "polygon") {
        entity.editor = new PolygonExtrudedEditor(dataSource, entity, options);
        // entity.editor = control[type].getEditor(dataSource, entity, {
        //   dragIcon: dragIcon,
        // });
      }
    }

    if (options.onStartEditing && typeof options.onStartEditing == "function") {
      options.onStartEditing(entity);
    }
  };

  entity.stopEditing = function (noevent) {
    // console.log(entity.editor);
    var entity = this;

    //释放编辑器
    if (entity.editor) {
      entity.editor.destroy();
      entity.editor = null;
    }

    if (
      !noevent &&
      options.onStopEditing &&
      typeof options.onStopEditing == "function"
    ) {
      options.onStopEditing(entity);
    }
  };

  entity.changeEditing = function () {
    var entity = this;
    if (
      options.onChangeEditing &&
      typeof options.onChangeEditing == "function"
    ) {
      options.onChangeEditing(entity);
    }
  };

  entity.updatePositions = function (positions) {
    var entity = this;
    var type = entity.attribute.type;
    if (type == "ellipse") {
      if (!entity.attribute.style.clampToGround) {
        var height = Number(
          Cesium.Cartographic.fromCartesian(positions).height.toFixed(2)
        );
        entity.attribute.style.height = height;

        if (entity.ellipse.height) entity.ellipse.height.setValue(height);
        else entity.ellipse.height = height;

        if (entity.attribute.style.extrudedHeight) {
          var extrudedHeight =
            height + Number(entity.attribute.style.extrudedHeight);
          entity.ellipse.extrudedHeight.setValue(extrudedHeight);
        }
      }
    }
    control[type].setPositions(currentEntity, positions);
  };
}
// 线编辑
class PolylineEditor {
  constructor(dataSource, entity, options) {
    this.dataSource = dataSource;
    this.entity = entity;
    this.draggers = [];

    this.positions = entity._draw_positions;
    // entity.polyline.positions.isConstant = false;
    for (var i = 0; i < this.positions.length; i++) {
      var loc = this.positions[i];
      var dragger = createDragger(this.dataSource, {
        dragIcon: options.dragIcon || "",
        position: loc,
        onDrag: (dragger, position) => {
          this.positions[dragger.index] = position;
          this.entity._draw_positions = this.positions;
          this.entity.position = this.positions[this.positions.length - 1];
          this.entity.changeEditing();
        },
      });
      dragger.index = i;
      dragger.positions = this.positions;
      this.draggers.push(dragger);
    }
  }
  updateDraggers() {
    var positions = this.entity.polyline.positions.getValue();
    for (var i = 0; i < this.draggers.length; i++) {
      var position = positions[i];
      this.draggers[i].position = position;
    }
  }
  destroy() {
    //this.entity.polyline.positions.isConstant = true;
    console.log(this.draggers[i]);
    for (var i = 0; i < this.draggers.length; i++) {
      this.dataSource.entities.remove(this.draggers[i]);
    }
    this.draggers = [];
  }
}
class PolygonExtrudedEditor {
  constructor(dataSource, entity, options) {
    this.dataSource = dataSource;
    this.entity = entity;
    this.draggers = [];

    var positions = entity.polygon.hierarchy.getValue().positions;
    for (var i = 0; i < positions.length; i++) {
      var loc = positions[i];
      var dragger = createDragger(this.dataSource, {
        dragIcon: options.dragIcon,
        position: loc,
        clampToGround: true,
        onDrag: function onDrag(dragger, position) {
          dragger.positions[dragger.index] = position;
          entity.position = positions[this.positions.length - 1];
          entity.changeEditing();
        },
      });
      dragger.index = i;
      dragger.positions = positions;
      this.draggers.push(dragger);
    }
  }
  updateDraggers() {
    var positions = this.entity.polygon.hierarchy.getValue();
    for (var i = 0; i < this.draggers.length; i++) {
      var position = positions[i];
      this.draggers[i].position = position;
    }
  }

  destroy() {
    for (var i = 0; i < this.draggers.length; i++) {
      this.dataSource.entities.remove(this.draggers[i]);
    }
    this.draggers = [];
  }
}
function createDragger(dataSource, options) {
  //公开绘制相关的一些内置参数，方便外部控制
  let DraggerPixelSize= 12 //编辑点的像素大小
  let DrawPointColor= new Cesium.Color.fromCssColorString("#792ae0") //绘制的点
  let DrawTooltip= "修改 坐标位置"
  var dragger;
  if (options.dragger) {
    dragger = options.dragger;
  } else {
    var position = Cesium.defaultValue(
      options.position,
      Cesium.Cartesian3.ZERO
    );
    var heightReference = options.clampToGround
      ? Cesium.HeightReference.CLAMP_TO_GROUND
      : Cesium.HeightReference.NONE;
    if (window.viewer && viewer.scene.mode !== Cesium.SceneMode.SCENE3D)
      heightReference = Cesium.HeightReference.NONE;

    dragger = dataSource.entities.add({
      position: position,
      point: {
        scale: 1,
        color: options.color || DrawPointColor,
        pixelSize: DraggerPixelSize || 12,
        outlineColor: new Cesium.Color.fromCssColorString(
          "#ffffff"
        ).withAlpha(0.8),
        outlineWidth: 2,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.5),
        heightReference: heightReference,
      },
      tooltip: options.tooltip || DrawTooltip,
    });
  }

  dragger._isDragger = true;
  dragger.onDrag = Cesium.defaultValue(options.onDrag, null);
  dragger.horizontal = Cesium.defaultValue(options.horizontal, true);
  dragger.vertical = Cesium.defaultValue(options.vertical, false);
  dragger.verticalCtrl = Cesium.defaultValue(options.vertical, false);

  return dragger;
}