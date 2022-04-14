
const SceneClass = Phaser.Scene;
export const isSceneObject = function (object) {
    return (object instanceof SceneClass);
}
export const getSceneObject = function (object) {
    if ((object == null) || (typeof (object) !== 'object')) {
        return null;
    } else if (isSceneObject(object)) { // object = scene
        return object;
    } else if (object.scene && isSceneObject(object.scene)) { // object = game object
        return object.scene;
    } else if (object.parent && object.parent.scene && isSceneObject(object.parent.scene)) { // parent = bob object
        return object.parent.scene;
    }
}


export class ComponentBase {
    constructor(parent) {
        this.parent = parent;  // gameObject or scene
        this.scene = getSceneObject(parent);
        this.isShutdown = false;

        // Register callback of parent destroy event, also see `shutdown` method
        if (this.parent && (this.parent === this.scene)) { // parent is a scene
            this.scene.sys.events.once('shutdown', this.onSceneDestroy, this);
        } else if (this.parent && this.parent.once) { // bob object does not have event emitter
            this.parent.once('destroy', this.onParentDestroy, this);
        }
    }

    shutdown() {
        if (this.isShutdown) {
            return;
        }

        // parent might not be shutdown yet
        if (this.parent && (this.parent === this.scene)) { // parent is a scene
            this.scene.sys.events.off('shutdown', this.onSceneDestroy, this);
        } else if (this.parent && this.parent.once) { // bob object does not have event emitter
            this.parent.off('destroy', this.onParentDestroy, this);
        }

        this.parent = undefined;
        this.scene = undefined;
        this.isShutdown = true;
    }

    destroy() {
        this.shutdown();
    }

    onSceneDestroy() {
        this.destroy(true);
    }

    onParentDestroy(parent, fromScene) {
        this.destroy(fromScene);
    }

}