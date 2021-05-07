import * as THREE from 'three';
import { Vector2 } from 'three';
import { DoorTexture } from '../../enums/door_textures';
import { createCube } from '../../functions/three_js_helpers';
import { DatGuiHelper } from './../../classes/dat_gui_helper';
import { VanillaCanvas } from './../../classes/vanilla_canvas';
import { createSphere } from './../../functions/three_js_helpers';

enum Element {
  TEXTURE_CANVAS = 'intermediate-texture-canvas',
}

const UV_2 = 'uv2';

export class IntermediateTexturesExample {
  private readonly canvasElement = document.getElementById(
    Element.TEXTURE_CANVAS
  ) as HTMLCanvasElement;
  private readonly canvas = new VanillaCanvas(this.canvasElement, true);
  private readonly datGui: DatGuiHelper;

  // Textures
  private readonly textureLoader = new THREE.TextureLoader();
  // Used to colour the recesses of the door texture
  private readonly doorAmbientOcclusion = this.textureLoader.load(DoorTexture.AMBIENT_OCCLUSION);
  // Used to render 3D depth to the door texture
  private readonly doorHeight = this.textureLoader.load(DoorTexture.HEIGHT);
  // Add detail/depth to the material without the need for a high vertices/subdivison number on the mesh
  private readonly doorNormalMap = this.textureLoader.load(DoorTexture.DETAIL);
  private readonly doorRoughness = this.textureLoader.load(DoorTexture.ROUGHNESS);
  private readonly doorMetalness = this.textureLoader.load(DoorTexture.METALNESS);
  private readonly doorTexture = this.textureLoader.load(DoorTexture.COLOUR);
  private readonly doorAlpha = this.textureLoader.load(DoorTexture.ALPHA);

  // Meshes
  private readonly doorCube = createCube(
    this.canvas.scene,
    new THREE.MeshStandardMaterial({
      map: this.doorTexture,
      aoMap: this.doorAmbientOcclusion,
      aoMapIntensity: 1,
      displacementMap: this.doorHeight,
      displacementScale: 0.15,
      metalnessMap: this.doorMetalness,
      roughnessMap: this.doorRoughness,
      normalMap: this.doorNormalMap,
      // Set the detail strength of the normal map
      normalScale: new Vector2(1, 1),
      // Required when using alpha maps
      transparent: true,
      // My only note here is for hit detection does it actually crop the mesh or just hide it?
      alphaMap: this.doorAlpha,
    }),
    2,
    15
  );

  private readonly doorSphere = createSphere(
    this.canvas.scene,
    new THREE.MeshStandardMaterial({
      map: this.doorTexture,
      aoMap: this.doorAmbientOcclusion,
      aoMapIntensity: 1,
      displacementMap: this.doorHeight,
      displacementScale: 0.2,
    })
  );

  constructor() {
    if (!this.canvasElement) return;
    this.doorSphere.position.x = 3;
    console.log(this.doorCube);
    this.canvas.addSceneLighting();
    this.datGui = new DatGuiHelper();
    this.datGui.addAllControls(this.doorCube);
    this.setAmbientOcclusionOnDoor();
    this.tick();
  }

  /**
   * In order for the aoMap to work we need to set another set of uv coordinates in this case it falls
   * under the key name of uv2
   * We want a one to one mapping of the original colour texture and for the vertexes to be in sets of 2
   */
  // TODO(Munro): Move this to a helper function when you know more about AO
  setAmbientOcclusionOnDoor(): void {
    this.doorCube.geometry.setAttribute(
      UV_2,
      new THREE.BufferAttribute(this.doorCube.geometry.attributes.uv.array, 2) // The 2 here is the grouping for the vertices coordinates
    );
  }

  private tick(): void {
    if (this.canvas.renderer) {
      this.canvas.renderer.render(this.canvas.scene, this.canvas.perspectiveCamera);
    }
    requestAnimationFrame(this.tick.bind(this));
  }
}