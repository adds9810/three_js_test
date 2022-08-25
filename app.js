import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";

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

let wheelNum = 0;
let addNum = 0;
let minNum = 0;
let maxNum = 50;
let standard;
let fullScroll = 120;
let light = new THREE.AmbientLight(0xffffff, 1.5); //조명
scene.add(light);

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

document.getElementById("wrap").classList.add("eacth");
let content = document.querySelectorAll("#wrap .content");
for (let n = 0; n < content.length; n++) {
  content[n].style.display = "none";
}
content[0].style.display = "block";

// event
document.addEventListener("wheel", function (e) {
  let starScale;
  if (e.deltaY > 0) {
    wheelNum++;
  } else {
    wheelNum--;
  }
  if (wheelNum < 0) {
    wheelNum = 0;
  } else if (wheelNum > fullScroll) {
    wheelNum = fullScroll;
  }

  if (wheelNum > maxNum / 2) {
    starScale = 0.00001;
  } else {
    starScale = 0.01;
  }
  particlesmaterial.size = starScale;
  if (addNum >= maxNum) {
    renderer.setClearColor(new THREE.Color("#AFFF28"), 1);
  } else {
    renderer.setClearColor(new THREE.Color("#21282a"), 1);
  }
});

let mouseX = 0;
let mouseY = 0;

/**
 * Animate
 */

const clock = new THREE.Clock();

const animate = () => {
  window.requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  particlesMesh.rotation.y = -1 * (elapsedTime * 0.1);

  if (mouseX > 0) {
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
    particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);
  }

  renderer.render(scene, camera);
};

animate();

let loader1 = new GLTFLoader(); //gltf 파일은 GLTFLoader 로 가져와야됨

loader1.load("/material/planet.gltf", function (gltf) {
  const gltfScene = gltf.scene;
  gltfScene.scale.x = 0;
  gltfScene.scale.y = 0;
  gltfScene.scale.z = 0;
  scene.add(gltfScene);
  window.addEventListener("resize", () => {
    gltfScene.scale.x = 0.15;
    gltfScene.scale.y = 0.15;
    gltfScene.scale.z = 0.15;
  });
  document.addEventListener("wheel", function (e) {
    if (!document.getElementById("wrap").classList.contains("view")) {
      gltfScene.rotation.x += 0.1;
      gltfScene.rotation.y += 0.1;
      gltfScene.rotation.z += 0.1;

      addNum = wheelNum;
      if (e.deltaY > 0) {
        standard = addNum <= maxNum;
      } else {
        standard = addNum > minNum;
      }
      if (addNum > maxNum) {
        addNum = maxNum;
      } else if (addNum < minNum) {
        addNum = minNum;
      }

      let addScale = addNum * 100 * 0.0001;
      if (!standard) {
        addScale = 0;
      }
      gltfScene.scale.x = addScale;
      gltfScene.scale.y = addScale;
      gltfScene.scale.z = addScale;

      if (addNum >= maxNum) {
        gltfScene.scale.x = 0;
        gltfScene.scale.y = 0;
        gltfScene.scale.z = 0;
        gltfScene.position.set(-1, -1, -1);
      } else {
        gltfScene.position.set(0, 0, 0);
      }
    }
  });
});

let loader3 = new GLTFLoader();
loader3.load("/material/gallay.gltf", function (gltf) {
  const gltfScene = gltf.scene;
  gltfScene.scale.x = 0;
  gltfScene.scale.y = 0;
  gltfScene.scale.z = 0;
  gltfScene.rotation.x = 1;
  gltfScene.rotation.y = 0;
  gltfScene.rotation.z = 0;
  gltfScene.position.set(0, 0, 0);

  let fullNum = 20;
  window.addEventListener("resize", () => {
    gltfScene.scale.x = 0.15;
    gltfScene.scale.y = 0.15;
    gltfScene.scale.z = 0.15;
  });
  document.addEventListener("wheel", function (e) {
    if (!document.getElementById("wrap").classList.contains("view")) {
      let startNum = maxNum + 5;
      let addNum2 = wheelNum;
      let minNum2 = startNum;
      let maxNum2 = maxNum * 2;
      let standard2;

      if (e.deltaY > 0) {
      } else {
        standard2 = addNum2 > minNum2;
      }
      if (addNum2 > maxNum2) {
        addNum2 = maxNum2;
      } else if (addNum2 < minNum2) {
        addNum2 = minNum2;
        content[0].style.display = "block";
        content[1].style.display = "none";
      } else if (addNum2 >= minNum2) {
        document.getElementById("wrap").classList.add("gallery");
        document.getElementById("wrap").classList.remove("eacth");
        content[0].style.display = "none";
        content[1].style.display = "block";
        scene.add(gltfScene);
        console.log("1");
      } else {
        content[0].style.display = "block";
        content[1].style.display = "none";
        console.log("0");
      }

      let addNum3 = addNum2 - startNum;
      if (addNum3 >= fullNum) {
        addNum3 = fullNum;
      }
      let addScale2 = addNum3 * 100 * 0.0001;
      console.log(addScale2);

      gltfScene.scale.x = addScale2;
      gltfScene.scale.y = addScale2;
      gltfScene.scale.z = addScale2;
    }
  });

  document.addEventListener("mousemove", function (event) {
    if (
      !document.getElementById("wrap").classList.contains("fixed") &&
      !document.getElementById("wrap").classList.contains("view") &&
      document.getElementById("wrap").classList.contains("gallery") &&
      wheelNum - maxNum - 5 >= fullNum
    ) {
      gltfScene.rotation.x = event.clientY * 0.001;
      gltfScene.rotation.y = event.clientX * 0.001;
      // gltfScene.rotation.x = (event.clientX / sizes.width) * 2 - 1;
      // gltfScene.rotation.y = (event.clientY / sizes.height) * 2 - 1;

      // camera.position.x = 40 * Math.sin(default_value);
      // camera.position.z = 40 * Math.cos(default_value);
      // default_value += add;
    }
  });

  document
    .getElementById("viewBth")
    .addEventListener("click", function (event) {
      content[1].style.display = "none";
      content[2].style.display = "block";
      document.getElementById("wrap").classList.add("view");
      gltfScene.rotation.x = 0.001;
      gltfScene.rotation.y = 0.001;
      gltfScene.rotation.z = 0.001;
      gltfScene.scale.x = 1;
      gltfScene.scale.y = 1;
      gltfScene.scale.z = 1;
    });
  document.addEventListener("input", function (event) {
    const rotateX = document.getElementById("rotateX").value || 0.001;
    const rotateY = document.getElementById("rotateY").value || 0.001;
    const rotateZ = document.getElementById("rotateZ").value || 0.001;
    const scaleX = document.getElementById("scaleX").value || 1;
    const scaleY = document.getElementById("scaleY").value || 1;
    const scaleZ = document.getElementById("scaleZ").value || 1;
    const positionX = document.getElementById("positionX").value || 0;
    const positionY = document.getElementById("positionY").value || -1;
    const positionZ = document.getElementById("positionZ").value || 0;
    gltfScene.rotation.x = rotateX;
    gltfScene.rotation.y = rotateY;
    gltfScene.rotation.z = rotateZ;
    gltfScene.scale.x = scaleX;
    gltfScene.scale.y = scaleY;
    gltfScene.scale.z = scaleZ;

    gltfScene.position.set(positionX, positionY, positionZ);
    console.log(
      `rotateX : ${rotateX}, rotateY: ${rotateY},rotateZ :${rotateZ}, scaleX : ${scaleX}, scaleY : ${scaleY}, scaleZ : ${scaleZ}, positionX : ${positionX}, positionY : ${positionY}, positionZ : ${positionZ}`
    );
  });

  for (let i = 1; i < document.querySelectorAll(".tab li a").length + 1; i++) {
    let rotateX = 0.001,
      rotateY = 0.001,
      rotateZ = 0.001,
      scaleX = 1,
      scaleY = 1,
      scaleZ = 1,
      positionX = 0,
      positionY = -1,
      positionZ = 0;

    document
      .querySelector(".tab li:nth-child(" + i + ") a")
      .addEventListener("click", function () {
        switch (i) {
          case 1:
            rotateX = 0.001;
            rotateY = 3.14;
            rotateZ = 0;
            scaleX = 1;
            scaleY = 1;
            scaleZ = 1;
            positionX = -0.5;
            positionY = -1;
            positionZ = 1.5;
            break;
          case 2:
            rotateX = 0.001;
            rotateY = 1.57;
            rotateZ = 0.001;
            scaleX = 1;
            scaleY = 1;
            scaleZ = 1;
            positionX = 0;
            positionY = -1;
            positionZ = 3;
            break;
          case 3:
            rotateX = 0;
            rotateY = -0.3;
            rotateZ = 0;
            scaleX = 1;
            scaleY = 1;
            scaleZ = 1;
            positionX = -2;
            positionY = -1.2;
            positionZ = 1.1;
            break;
          case 4:
            rotateX = 0;
            rotateY = 0;
            rotateZ = 0;
            scaleX = 1;
            scaleY = 1;
            scaleZ = 1;
            positionX = 2.5;
            positionY = -1.2;
            positionZ = 2;
            break;
          case 5:
            rotateX = 0;
            rotateY = 4.7;
            rotateZ = 0;
            scaleX = 1;
            scaleY = 1;
            scaleZ = 1;
            positionX = 0;
            positionY = -1.1;
            positionZ = 3.8;
            break;
        }
        gltfScene.rotation.x = rotateX;
        gltfScene.rotation.y = rotateY;
        gltfScene.rotation.z = rotateZ;
        gltfScene.scale.x = scaleX;
        gltfScene.scale.y = scaleY;
        gltfScene.scale.z = scaleZ;

        gltfScene.position.set(positionX, positionY, positionZ);

        document.getElementById("rotateX").value = rotateX;
        document.getElementById("rotateY").value = rotateY;
        document.getElementById("rotateZ").value = rotateZ;
        document.getElementById("scaleX").value = scaleX;
        document.getElementById("scaleY").value = scaleY;
        document.getElementById("scaleZ").value = scaleZ;
        document.getElementById("positionX").value = positionX;
        document.getElementById("positionY").value = positionY;
        document.getElementById("positionZ").value = positionZ;
      });
  }
});

document.addEventListener("click", function (event) {
  if (!document.getElementById("wrap").classList.contains("fixed")) {
    document.getElementById("wrap").classList.add("fixed");
  } else {
    document.getElementById("wrap").classList.remove("fixed");
  }
});

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
