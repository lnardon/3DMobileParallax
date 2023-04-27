// IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

//SCENE
const scene = new THREE.Scene();

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setClearColor(0x131313);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  15,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.z = 65;

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

//LIGHTS
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 20, 25);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 70;
scene.add(spotLight);
const spotLight2 = new THREE.SpotLight(0xffffff);
spotLight2.position.set(0, -10, -25);
spotLight2.castShadow = true;
spotLight2.shadow.mapSize.width = 1024;
spotLight2.shadow.mapSize.height = 1024;
spotLight2.shadow.camera.near = 500;
spotLight2.shadow.camera.far = 4000;
spotLight2.shadow.camera.fov = 70;
scene.add(spotLight2);

// Load gltf scene
const loader = new GLTFLoader();
loader.load(
  "./Shapes.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function handleParallax(x, y, z) {
  if(Math.abs(x) > 2){
    scene.children[2].children[0].position.x = lerp(scene.children[2].children[0].position.x,scene.children[2].children[0].position.x + (x/21), 0.01)
  }
  if(Math.abs(y) > 2){
    scene.children[2].children[0].position.y = lerp(scene.children[2].children[0].position.y,scene.children[2].children[0].position.y + (y/19), 0.03)
  }
  if(Math.abs(z) > 2){
    scene.children[2].children[0].position.z = lerp(scene.children[2].children[0].position.z,scene.children[2].children[0].position.z + (z/23), 0.01)
  }
}

//RENDER LOOP
requestAnimationFrame(render);
function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.addEventListener("devicemotion", (e) => {
  // document.getElementById("logs").innerText = `${e.rotationRate.alpha} - ${e.rotationRate.beta} - ${e.rotationRate.gamma}`
  handleParallax(e.rotationRate.beta,e.rotationRate.alpha,e.rotationRate.gamma);
});

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);
