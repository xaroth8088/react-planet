import THREE from 'three';

export default class Trackball {
    constructor(element, mesh) {
        this.element = element;
        this.buttonDown = false;
        this.mesh = mesh;
        this.lastX = 0;
        this.lastY = 0;
        this.element.addEventListener('mousedown', this.onMousedown.bind(this));
        window.addEventListener('mouseup', this.onMouseup.bind(this));
        window.addEventListener('mousemove', this.onMousemove.bind(this));
    }

    onMousedown(e) {
        this.buttonDown = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    onMouseup() {
        this.buttonDown = false;
    }

    onMousemove(e) {
        if (!this.buttonDown) {
            return;
        }
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.track(dx, dy);
    }

    track(dx, dy) {
        const tempMat = new THREE.Matrix4();
        // base this on the size of the canvas
        tempMat.makeRotationAxis(new THREE.Vector3(0, 1, 0), dx * 0.005);
        tempMat.multiply(this.mesh.matrix);
        const tempMat2 = new THREE.Matrix4();
        // base this on the size of the canvas
        tempMat2.makeRotationAxis(new THREE.Vector3(1, 0, 0), dy * 0.005);
        tempMat2.multiply(tempMat);
        this.mesh.rotation.setFromRotationMatrix(tempMat2);
    }

    release() {
        this.element.removeEventListener('mousedown', this.onMousedown.bind(this));
        window.removeEventListener('mouseup', this.onMouseup.bind(this));
        window.removeEventListener('mousemove', this.onMousemove.bind(this));
    }
}
