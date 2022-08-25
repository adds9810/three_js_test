import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";

let scrollNum = 0;

// Scene
const scene = new THREE.Scene();
//size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 1);
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#canvas"),
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color("#21282a"), 1);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let wheelNum = 0;
let light = new THREE.AmbientLight(0xffffff, 1.5); //조명
scene.add(light);

let loader1 = new GLTFLoader(); //gltf 파일은 GLTFLoader 로 가져와야됨

let addNum = 0;
let minNum = 0;
let maxNum = 85;
let standard;
loader1.load("/material/planet.gltf", function (gltf) {
  const gltfScene = gltf.scene;
  scene.add(gltfScene);
  gltfScene.position.x = 1;
  gltfScene.scale.x = 0;
  gltfScene.scale.y = 0;
  gltfScene.scale.z = 0;
  // function animate() {
  //   requestAnimationFrame(animate); //1초에 60번 실행됨.

  //   //회전
  //   gltfScene.rotation.x += 0.01;
  //   gltfScene.rotation.y += 0.01;
  //   gltfScene.rotation.z += 0.01;
  //   renderer.render(scene, camera);
  // }
  // animate();
  window.addEventListener("resize", () => {
    gltfScene.scale.x = 0.15;
    gltfScene.scale.y = 0.15;
    gltfScene.scale.z = 0.15;
    gltfScene.position.x = 0;
  });
  document.addEventListener("wheel", function (e) {
    gltfScene.rotation.x += 0.05;
    gltfScene.rotation.y += 0.05;
    gltfScene.rotation.z += 0.05;

    if (e.deltaY > 0) {
      standard = addNum <= maxNum;
      addNum++;
    } else {
      standard = addNum > minNum;
      addNum--;
    }
    if (addNum > maxNum) {
      addNum = maxNum;
    } else if (addNum < minNum) {
      addNum = minNum;
    }
    if (standard) {
      let addScale = addNum * 100 * 0.0001;
      gltfScene.scale.x = addScale;
      gltfScene.scale.y = addScale;
      gltfScene.scale.z = addScale;
      console.log(addNum);
    }
    if (addNum >= 76) {
      gltfScene.scale.x = 0;
      gltfScene.scale.y = 0;
      gltfScene.scale.z = 0;
      gltfScene.position.set(-1, -1, -1);
    } else {
      gltfScene.position.set(1, 0, 0);
    }
  });
});
let loader3 = new GLTFLoader();
loader3.load("/material/gallay.gltf", function (gltf) {
  const gltfScene = gltf.scene;
  scene.add(gltfScene);
  gltfScene.position.x = 1;
  gltfScene.scale.x = 0;
  gltfScene.scale.y = 0;
  gltfScene.scale.z = 0;
  window.addEventListener("resize", () => {
    gltfScene.scale.x = 0.15;
    gltfScene.scale.y = 0.15;
    gltfScene.scale.z = 0.15;
  });
  document.addEventListener("wheel", function (e) {
    gltfScene.rotation.x += 0.05;
    gltfScene.rotation.y += 0.05;
    gltfScene.rotation.z += 0.05;

    if (e.deltaY > 0) {
      standard = addNum <= maxNum;
      addNum++;
    } else {
      standard = addNum > minNum;
      addNum--;
    }
    if (addNum > maxNum) {
      addNum = maxNum;
    } else if (addNum < minNum) {
      addNum = minNum;
    }
    if (standard) {
      let addScale = addNum * 100 * 0.0001;
      gltfScene.scale.x = addScale;
      gltfScene.scale.y = addScale;
      gltfScene.scale.z = addScale;
      console.log(addNum);
    }
    if (addNum >= 76) {
      gltfScene.scale.x = 0;
      gltfScene.scale.y = 0;
      gltfScene.scale.z = 0;
      gltfScene.position.set(-1, -1, -1);
    } else {
      gltfScene.position.set(1, 0, 0);
    }
  });
});

//particle
const particlesGeometry = new THREE.BufferGeometry();
const loader2 = new THREE.TextureLoader();
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.height = 100;
canvas.width = 100;
ctx.fillStyle = "#fff";
ctx.beginPath();
ctx.arc(50, 50, 25, 0, 2 * Math.PI);
ctx.fill();
let img = canvas.toDataURL("image/png");
const star = loader2.load(img);
const particlesmaterial = new THREE.PointsMaterial({
  size: 0.01,
  map: star,
  transparent: true,
});
const particlesCnt = 2000;
const posArray = new Float32Array(particlesCnt * 3);
// xyz,xyz,xyz , xyz
for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const particlesMesh = new THREE.Points(particlesGeometry, particlesmaterial);
scene.add(particlesMesh);

//mouse
//document.addEventListener("mousemove", animateParticles);
console.log(particlesmaterial.size);
document.addEventListener("wheel", function (e) {
  let addScale;

  if (e.deltaY > 0) {
    wheelNum++;
  } else if (addNum > 75) {
    addScale = 0;
  } else {
    wheelNum--;
  }
  if (wheelNum > 40) {
    addScale = 0.00001;
  } else {
    addScale = 0.01;
  }
  particlesmaterial.size = addScale;
  console.log(wheelNum);
  if (addNum >= 70) {
    renderer.setClearColor(new THREE.Color("#E8FF35"), 1);
  } else {
    renderer.setClearColor(new THREE.Color("#21282a"), 1);
  }
});

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
}

/**
 * Animate
 */

const clock = new THREE.Clock();

const animate = () => {
  window.requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  // Update objects
  //sphere.rotation.y = 0.5 * elapsedTime;
  particlesMesh.rotation.y = -1 * (elapsedTime * 0.1);

  if (mouseX > 0) {
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
    particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);
  }

  renderer.render(scene, camera);
};

animate();
