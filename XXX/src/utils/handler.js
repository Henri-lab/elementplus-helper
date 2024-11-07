/*
 * @Author: XC
 * @Date: 2024-07-15 11:11:57
 * @LastEditors: XC
 * @LastEditTime: 2024-07-24 10:26:35
 * @FilePath: \RuoYi-Vue3-3.8.6\src\utils\handler.js
 * @Description: 鼠标事件
 */
import bus from '@/utils/bus'
// 点击事件
class eventCortol {
  constructor(option) {
    this.viewer = option.viewer;
    // this.createEditSelectHandler()
  }
  
  createDrawPolylineHandler(entity, positions, drawOkCalback) {
    // this.destroyEditHandler()
    // Adds a point to the positions list.
    let $this = this;
    let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.lastPointTemporary = false;
    handler.setInputAction(function (event) {
      let cartesian = $this.getCurrentMousePosition(
        $this.viewer.scene,
        event.position,
        entity
      );
      if (cartesian) {
        if (handler.lastPointTemporary) {
          positions.pop();
        }
        if (entity.attribute && entity.attribute.addHeight)
          //在绘制点基础自动增加高度
          cartesian = drawutils.getPositionsWithHeight(
            cartesian,
            entity.attribute.addHeight
          );
        console.log(positions,'positions');
        positions.push(cartesian);

        handler.lastPointTemporary = false;
        if (entity.attribute && entity.attribute.minMaxPoints) {
          if (
            (positions.length == entity.attribute.minMaxPoints.min &&
              positions.length == entity.attribute.minMaxPoints.max) ||
            (entity.attribute.minMaxPoints.isSuper && positions.length == 4)
          ) {
            entity.inProgress = false;
            handler.destroy();
            $this.drawHandler = null;
            $this.pickedEntity = entity;
            // this.setCursor();

            entity.stopDrawing();
            entity.startEditing();
            // drawOkCalback && drawOkCalback(entity);
          }
        }
        // entity.changeDrawing();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Replaces the last point in the list with the point under the mouse.
    handler.setInputAction(function (event) {
      if (event.endPosition) {
        let cartesian = $this.getCurrentMousePosition(
          $this.viewer.scene,
          event.endPosition,
          entity
        );
        if (cartesian) {
          if (handler.lastPointTemporary) {
            positions.pop();
          }
          positions.push(cartesian);
          handler.lastPointTemporary = true;
          //   entity.moveDrawing();
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (event) {
      entity.inProgress = false;
      handler.destroy();
      $this.drawHandler = null;
      $this.pickedEntity = entity;
      //   this.setCursor();

      positions.pop(); //必要代码 消除双击带来的多余经纬度

      entity.stopDrawing();
      bus.emit('busEntity', { entity: entity, type: 'line' },)
      //   entity.startEditing();
      //   drawOkCalback && drawOkCalback(entity);
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    //记录最近一次值
    this.drawHandler = handler;

    return handler;
  }
  createDrawPolylineHandler1(entity, positions, drawOkCalback) {
    // this.destroyEditHandler()
    // Adds a point to the positions list.
    let $this = this;
    let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.lastPointTemporary = false;
    handler.setInputAction(function (event) {
      let cartesian = $this.getCurrentMousePosition(
        $this.viewer.scene,
        event.position,
        entity
      );
      if (cartesian) {
        if (handler.lastPointTemporary) {
          positions.pop();
        }
        if (entity.attribute && entity.attribute.addHeight)
          //在绘制点基础自动增加高度
          cartesian = drawutils.getPositionsWithHeight(
            cartesian,
            entity.attribute.addHeight
          );
        positions.push(cartesian);
        if (positions.length >=2) {
          entity.inProgress = false
          handler.destroy()
          $this.drawHandler = null
          bus.emit('busEntity', { entity: entity ,type:'line'},)
          $this.pickedEntity = entity
          //   this.setCursor();

          // positions.pop() //必要代码 消除双击带来的多余经纬度

          entity.stopDrawing()
        }

        handler.lastPointTemporary = false;
        if (entity.attribute && entity.attribute.minMaxPoints) {
          if (
            (positions.length == entity.attribute.minMaxPoints.min &&
              positions.length == entity.attribute.minMaxPoints.max) ||
            (entity.attribute.minMaxPoints.isSuper && positions.length == 4)
          ) {
            entity.inProgress = false;
            handler.destroy();
            $this.drawHandler = null;
            $this.pickedEntity = entity;
            // this.setCursor();

            entity.stopDrawing();
            entity.startEditing();
            // drawOkCalback && drawOkCalback(entity);
          }
        }
        // entity.changeDrawing();
      }
    
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Replaces the last point in the list with the point under the mouse.
    handler.setInputAction(function (event) {
      if (event.endPosition) {
        let cartesian = $this.getCurrentMousePosition(
          $this.viewer.scene,
          event.endPosition,
          entity
        );
        if (cartesian) {
          if (handler.lastPointTemporary) {
            positions.pop();
          }
          positions.push(cartesian);
          handler.lastPointTemporary = true;
          //   entity.moveDrawing();
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (event) {
      entity.inProgress = false;
      handler.destroy();
      $this.drawHandler = null;
      $this.pickedEntity = entity;
      //   this.setCursor();

      positions.pop(); //必要代码 消除双击带来的多余经纬度

      entity.stopDrawing();
      //   entity.startEditing();
      //   drawOkCalback && drawOkCalback(entity);
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    //记录最近一次值
    this.drawHandler = handler;

    return handler;
  }
  createDrawPolygonHandler(entity, positions, drawOkCalback) {
    let $this = this;

    entity.inProgress = false;
    let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    // Adds a point to the positions list.
    handler.lastPointTemporary = false;
    handler.setInputAction(function (event) {
      let cartesian = $this.getCurrentMousePosition(
        $this.viewer.scene,
        event.position,
        entity
      );
      if (cartesian) {
        if (handler.lastPointTemporary) {
          positions.pop();
        }
        positions.push(cartesian);

        if (entity.attribute.style.extrudedHeight) {
          //存在extrudedHeight高度设置时
          let maxHight = drawutils.getMaxHeightForPositions(positions);
          entity.polygon.extrudedHeight =
            maxHight + Number(entity.attribute.style.extrudedHeight);
        }

        handler.lastPointTemporary = false;
        // entity.changeDrawing();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Replaces the last point in the list with the point under the mouse.
    handler.setInputAction(function (event) {
      if (event.endPosition) {
        let cartesian = $this.getCurrentMousePosition(
          $this.viewer.scene,
          event.endPosition,
          entity
        );
        if (cartesian) {
          if (handler.lastPointTemporary) {
            positions.pop();
          }
          positions.push(cartesian);

          if (entity.attribute.style.extrudedHeight) {
            //存在extrudedHeight高度设置时
            let maxHight = drawutils.getMaxHeightForPositions(positions);
            entity.polygon.extrudedHeight =
              maxHight + Number(entity.attribute.style.extrudedHeight);
          }

          handler.lastPointTemporary = true;
          //   entity.moveDrawing();
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (event) {
      entity.inProgress = false;
      handler.destroy();
      $this.drawHandler = null;
      //   $this.setCursor();
      $this.pickedEntity = entity;

      positions.pop(); //必要代码 消除双击带来的多余经纬度
      entity.stopDrawing();
      bus.emit('busEntity', { entity: entity, type: 'face' },)
      //   entity.startEditing();
      //   drawOkCalback && drawOkCalback(entity);
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    //记录最近一次值
    this.drawHandler = handler;

    return handler;
  }
  destroyDrawHandler() {
    if (this.drawHandler) {
      this.drawHandler.destroy();
      this.drawHandler = null;
    }
  }
  getCurrentMousePosition(scene, position, noPickEntity) {
    let cartesian;
    //在模型上提取坐标
    let pickedObject = scene.pick(position);
    if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
      //pickPositionSupported :判断是否支持深度拾取,不支持时无法进行鼠标交互绘制

      if (
        noPickEntity == null ||
        (noPickEntity &&
          pickedObject.id !== noPickEntity &&
          pickedObject.primitive !== noPickEntity)
      ) {
        let cartesian = scene.pickPosition(position);
        if (Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let height = cartographic.height; //模型高度
          if (height >= 0) return cartesian;

          //不是entity时，支持3dtiles地下
          if (!Cesium.defined(pickedObject.id) && height >= -500)
            return cartesian;
        }
      }
    }

    //测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
    //1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
    //2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
    //注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。

    //提取鼠标点的地理坐标
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      //三维模式下
      let pickRay = scene.camera.getPickRay(position);
      cartesian = scene.globe.pick(pickRay, scene);
    } else {
      //二维模式下
      cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
    }
    return cartesian;
  }
  // 编辑
  /**
   * 【编辑】 绑定左键单击事件[选中激活编辑+单击空白处取消编辑]
   */
  createEditSelectHandler(calback) {
    let that = this;
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    handler.setInputAction(function (e) {
      let picked = that.viewer.scene.pick(e.position);
      let pickedEntity = null;
      if (Cesium.defined(picked)) {
        let id = Cesium.defaultValue(picked.id, picked.primitive.id);
        if (id instanceof Cesium.Entity) {
          let inProgress = Cesium.defaultValue(id.inProgress, false);
          console.log(inProgress)
          if (!inProgress) {
            pickedEntity = id;
          }
        }
      }
      that.pickedEntity = pickedEntity;
      console.log(pickedEntity,'pickedEntity');
      calback(pickedEntity); //回调
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this.selectHandler = handler;
  }

  /**
   * 【编辑】将协助选择和拖动编辑绑定的拖动到，实体对象
   * Initialize the utility handler that will assist in selecting and manipulating Dragger billboards.
   */
  createEditDraggerHandler() {
    const draggerHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    draggerHandler.dragger = null;

    let that = this;
    // Left down selects a dragger
    draggerHandler.setInputAction(function (click) {
      let pickedObject = that.viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject)) {
        let entity = pickedObject.id;
        if (entity && Cesium.defaultValue(entity._isDragger, false)) {
          // Resize the dragger.
          if (entity.billboard) {
            entity.billboard.scale_src = entity.billboard.scale.getValue();
            entity.billboard.scale._value = entity.billboard.scale_src * 1.2;
          }

          draggerHandler.dragger = entity;
          that.viewer.scene.screenSpaceCameraController.enableRotate = false;
          that.viewer.scene.screenSpaceCameraController.enableTilt = false;
          that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
          that.viewer.scene.screenSpaceCameraController.enableInputs = false;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // Left down selects a dragger
    draggerHandler.setInputAction(
      function (click) {
        let pickedObject = that.viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject)) {
          let entity = pickedObject.id;
          if (entity && Cesium.defaultValue(entity._isDragger, false)) {
            // Resize the dragger.
            if (entity.billboard) {
              entity.billboard.scale_src = entity.billboard.scale._value;
              entity.billboard.scale._value = entity.billboard.scale_src * 1.2;
            }

            draggerHandler.dragger = entity;
            that.viewer.scene.screenSpaceCameraController.enableRotate = false;
            that.viewer.scene.screenSpaceCameraController.enableTilt = false;
            that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
            that.viewer.scene.screenSpaceCameraController.enableInputs = false;
          }
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_DOWN,
      Cesium.KeyboardEventModifier.CTRL
    );

    // Mouse move drags the draggers and calls their onDrag callback.
    draggerHandler.setInputAction(function (event) {
      if (draggerHandler.dragger) {
        if (draggerHandler.dragger.horizontal) {
          let hit;
          if (draggerHandler.dragger.model) {
            //点
            //在模型上提取坐标
            let scene = that.viewer.scene;
            let pickobject = scene.pick(event.endPosition);
            if (
              Cesium.defined(pickobject) &&
              pickobject.id == draggerHandler.dragger
            ) {
              let pickRay = scene.camera.getPickRay(event.endPosition); //提取鼠标点的地理坐标
              hit = scene.globe.pick(pickRay, scene);
            }
          }

          if (hit == null)
            hit = that.getCurrentMousePosition(
              that.viewer.scene,
              event.endPosition,
              that.pickedEntity
            );

          if (hit) {
            draggerHandler.dragger.position = hit;
            if (draggerHandler.dragger.onDrag) {
              draggerHandler.dragger.onDrag(draggerHandler.dragger, hit);
            }
          }
        }

        if (draggerHandler.dragger.vertical) {
          let dy = event.endPosition.y - event.startPosition.y;
          let position = draggerHandler.dragger.position.getValue();
          let tangentPlane = new Cesium.EllipsoidTangentPlane(position);

          scratchBoundingSphere.center = position;
          scratchBoundingSphere.radius = 1;

          let metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(
            scratchBoundingSphere,
            that.viewer.scene.frameState.context.drawingBufferWidth,
            that.viewer.scene.frameState.context.drawingBufferHeight
          );

          let zOffset = new Cesium.Cartesian3();

          Cesium.Cartesian3.multiplyByScalar(
            tangentPlane.zAxis,
            -dy * metersPerPixel,
            zOffset
          );
          let newPosition = Cesium.Cartesian3.clone(position);
          Cesium.Cartesian3.add(position, zOffset, newPosition);

          draggerHandler.dragger.position = newPosition;
          if (draggerHandler.dragger.onDrag) {
            draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    let scratchBoundingSphere = new Cesium.BoundingSphere();

    // Mouse move drags the draggers and calls their onDrag callback.
    draggerHandler.setInputAction(
      function (event) {
        if (draggerHandler.dragger && draggerHandler.dragger.verticalCtrl) {
          let dy = event.endPosition.y - event.startPosition.y;
          let position = draggerHandler.dragger.position.getValue();
          let tangentPlane = new Cesium.EllipsoidTangentPlane(position);

          scratchBoundingSphere.center = position;
          scratchBoundingSphere.radius = 1;

          let metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(
            scratchBoundingSphere,
            that.viewer.scene.frameState.context.drawingBufferWidth,
            that.viewer.scene.frameState.context.drawingBufferHeight
          );

          let zOffset = new Cesium.Cartesian3();

          Cesium.Cartesian3.multiplyByScalar(
            tangentPlane.zAxis,
            -dy * metersPerPixel,
            zOffset
          );
          let newPosition = Cesium.Cartesian3.clone(position);
          Cesium.Cartesian3.add(position, zOffset, newPosition);

          draggerHandler.dragger.position = newPosition;
          if (draggerHandler.dragger.onDrag) {
            draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
          }
        }
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      Cesium.KeyboardEventModifier.CTRL
    );

    // Left up stops dragging.
    draggerHandler.setInputAction(function () {
      if (draggerHandler.dragger) {
        if (draggerHandler.dragger.billboard) {
          draggerHandler.dragger.billboard.scale._value =
            draggerHandler.dragger.billboard.scale_src;
        }

        draggerHandler.dragger = null;
        that.viewer.scene.screenSpaceCameraController.enableRotate = true;
        that.viewer.scene.screenSpaceCameraController.enableTilt = true;
        that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        that.viewer.scene.screenSpaceCameraController.enableInputs = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // Left up stops dragging.
    draggerHandler.setInputAction(
      function () {
        if (draggerHandler.dragger) {
          if (draggerHandler.dragger.billboard) {
            draggerHandler.dragger.billboard.scale._value =
              draggerHandler.dragger.billboard.scale_src;
          }

          draggerHandler.dragger = null;
          that.viewer.scene.screenSpaceCameraController.enableRotate = true;
          that.viewer.scene.screenSpaceCameraController.enableTilt = true;
          that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
          that.viewer.scene.screenSpaceCameraController.enableInputs = true;
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_UP,
      Cesium.KeyboardEventModifier.CTRL
    );

    this.draggerHandler = draggerHandler;
  }

  /**
   * 【编辑】 释放编辑相关事件
   */
  destroyEditHandler() {
    if (this.selectHandler) {
      this.selectHandler.destroy();
      this.selectHandler = null;
    }

    if (this.draggerHandler) {
      this.draggerHandler.destroy();
      this.draggerHandler = null;
    }
  }
}
export default eventCortol;
