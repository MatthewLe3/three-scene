<template>
	<div id="container"></div>
</template>

<script>
	import * as THREE from "three";
	import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
	import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
	import * as dat from "dat.gui";
	const gui = new dat.GUI();

	var controls = new (function () {
		this.color0 = [255, 0, 0];
		this.color1 = [0, 0, 0];
		this.color2 = [158, 147, 147];
		this.color3 = [198, 198, 198];
		this.color4 = [0, 0, 0];
		this.color5 = [36, 37, 40];
		this.color6 = [255, 0, 90];
		this.color7 = [0, 128, 255];
	})();

	// 汽车的control
	var carControl = gui.addFolder("跑车");

	carControl.addColor(controls, "color0").name("尾翼");
	carControl.addColor(controls, "color1").name("挡风玻璃");
	carControl.addColor(controls, "color2").name("进气口");
	carControl.addColor(controls, "color3").name("雨刷");
	carControl.addColor(controls, "color4").name("车身");
	carControl.addColor(controls, "color5").name("车胎");
	carControl.open();

	export default {
		data() {
			return {
				scene: null,
				light: null,
				fov: 60,
				camera: null,
				renderer: null,
				labelRenderer: null,
				container: null,
				controls: null,
				tickerNum: 0,
				carMesh: null,
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				// 创建场景
				this.createScene();
				// 创建光源
				this.createLight();
				// 创建相机
				this.createCamera();
				// 创建渲染器
				this.createRender();
				// 创建网格
				this.createMesh();
				// 添加建筑
				this.addBuildings();
				// 添加车模型
				this.addCars();
				// 添加房屋模型
				this.addBuildingsModel();
				// 添加动画人物
				this.addAnimation();
				// 添加路灯
				this.addLamtern();
				// 渲染
				this.render();

				// 控件
				this.createControls();
			},
			createScene() {
				this.scene = new THREE.Scene();
				this.scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
			},
			createLight() {
				// 环境光
				const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
				this.scene.add(ambientLight);
				// 创建聚光灯
				const spotLight = new THREE.SpotLight(0xffffff, 0.6);
				// const pointLight = new THREE.PointLight(0xffffff, 1);
				const targetObject = new THREE.Object3D();
				spotLight.position.set(-8.4, -1, 2);
				targetObject.position.set(-8.4, -1, 0);

				this.scene.add(targetObject);
				spotLight.target = targetObject;
				spotLight.castShadow = true;
				this.scene.add(spotLight);

				const coneGeometry = new THREE.ConeGeometry(3.5, 2, 50);
				
				const coneMaterial = new THREE.MeshLambertMaterial({
					color: 0xffff00,
					transparent: true,
					opacity: 0.4,
					// depthTest: true,
				});
				const cone = new THREE.Mesh(coneGeometry, coneMaterial);
				cone.position.set(-8.4, -1, 1.01);
				cone.rotateX(Math.PI / 2);
				this.scene.add(cone);
			},
			createCamera() {
				this.camera = new THREE.PerspectiveCamera(
					35,
					window.innerWidth / window.innerHeight,
					0.1,
					1000
				);
				this.camera.position.set(0, -30, 40); // 设置相机位置
				this.camera.lookAt(this.scene.position);
				this.camera.up.set(0, 0, 1);
				this.camera.lookAt(new THREE.Vector3(10, 0, 0)); // 设置相机方向
				this.scene.add(this.camera);
			},
			createRender() {
				const element = document.getElementById("container");
				this.renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true,
					logarithmicDepthBuffer: true,
				});
				this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染区域尺寸
				this.renderer.shadowMap.enabled = true; // 显示阴影
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
				// this.renderer.setClearColor(0x3f3f3f, 1); // 设置背景颜色
				element.appendChild(this.renderer.domElement);
			},
			createMesh() {
				const bgGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
				const bgMaterial = new THREE.MeshLambertMaterial({
					color: 0xeeefff,
					side: THREE.DoubleSide,
				});
				const plain = new THREE.Mesh(bgGeometry, bgMaterial);
				plain.position.z = -0.01;
				this.scene.add(plain);

				const geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
				let texture = THREE.ImageUtils.loadTexture("/image/ground.png");
				let texture2 = THREE.ImageUtils.loadTexture(
					"/models/lamtern/Fiberglass0014_S.jpg"
				);
				texture.wrapS = THREE.RepeatWrapping; //重复平铺
				texture.wrapT = THREE.RepeatWrapping; //重复平铺
				texture.repeat.set(4, 4); //重复次数

				texture2.wrapS = THREE.RepeatWrapping; //重复平铺
				texture2.wrapT = THREE.RepeatWrapping; //重复平铺
				texture2.repeat.set(4, 4); //重复次数
				// MeshBasicMaterial 不受光照影响
				// MeshLambertMaterial 对光照有反应，用于创建暗淡的不发光的物体
				// MeshPhongMaterial 对光照有反应，用于创建金属类明亮物体
				const material = new THREE.MeshPhongMaterial({
					color: 0xafc0ca,
					map: texture,
					bumpMap: texture2,
					bumpScale: 0.03,
					side: THREE.DoubleSide,
					depthTest: true,
				});
				const cube = new THREE.Mesh(geometry, material);
				cube.receiveShadow = true;
				this.scene.add(cube);
			},
			addBuildings() {
				let cubeGeometry = new THREE.BoxGeometry(3, 3, 5);
				let cubeMat = new THREE.MeshLambertMaterial({
					//创建材料
					color: 0xb0a69a,
					wireframe: false,
				});
				let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMat);
				cubeMesh.position.set(-7.5, 7.5, 2.55); //设置立方体的坐标
				cubeMesh.receiveShadow = true;
				this.scene.add(cubeMesh);

				let texture = THREE.ImageUtils.loadTexture(
					"/image/building.png"
				);
				texture.wrapS = THREE.RepeatWrapping; //重复平铺
				texture.wrapT = THREE.RepeatWrapping; //重复平铺
				texture.repeat.set(2, 5); //重复次数
				let plane = new THREE.PlaneGeometry(3, 5, 1, 1);
				let planeMaterial = new THREE.MeshLambertMaterial({
					map: texture,
				});
				let planeMesh = new THREE.Mesh(plane, planeMaterial);
				planeMesh.receiveShadow = true;
				planeMesh.position.set(-7.5, 5.99, 2.5);
				planeMesh.rotateX(Math.PI / 2);
				this.scene.add(planeMesh);
			},
			addCars() {
				let fbxLoader = new FBXLoader();
				fbxLoader.load(
					"/models/cars/koenigsegg-agera/uploads_files_2792345_Koenigsegg.fbx",
					(object) => {
						this.carMesh = object.children[2].clone();
						this.carMesh.scale.set(0.1, 0.1, 0.1);
						this.carMesh.rotateX(Math.PI / 2);
						this.carMesh.rotateY(-Math.PI / 2);
						this.carMesh.position.set(7.5, 7.5, 0.47);

						this.scene.add(this.carMesh);
						object.traverse(function (child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow = true;
								if (child.children) {
									child.children.forEach((c) => {
										c.castShadow = true;
										c.receiveShadow = true;
									});
								}
							}
						});
					}
				);
			},
			addBuildingsModel() {
				let fbxLoader = new FBXLoader();
				fbxLoader.load(
					"/models/buildings/cottage_fbx.fbx",
					(object) => {
						object.traverse(function (child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow = true;
							}
						});
						const geometry = object.children[1].geometry;
						var material = new THREE.MeshPhongMaterial({
							color: 0xff5533,
							specular: 0x111111,
							shininess: 200,
						});
						var buildMesh = new THREE.Mesh(geometry, material);
						buildMesh.position.set(-2.5, 7.5, 1);
						buildMesh.scale.set(1.5, 1.0, 1.0);
						buildMesh.rotateZ(Math.PI);
						this.scene.add(buildMesh);
					}
				);
			},
			addAnimation() {
				let fbxLoader = new FBXLoader();
				fbxLoader.load("/models/animation/Walking.fbx", (object) => {
					this.person = object;

					this.person.traverse(function (child) {
						if (child.isMesh) {
							child.castShadow = true;
							child.receiveShadow = true;
						}
					});

					this.person.castShadow = true;
					this.person.scale.set(0.01, 0.01, 0.01);
					this.person.position.set(-9, 0, 0.01);
					this.person.rotateX(Math.PI / 2);
					this.person.rotation.y = Math.PI / 2;
					this.person.xRange = [-9, 9];

					const count = 1000;
					const range =
						(this.person.xRange[1] - this.person.xRange[0]) / count;

					let arr = [];
					for (let i = 0; i < count; i++) {
						arr.push(this.person.xRange[0] + i * range);
					}
					this.person.xStepArr = arr;

					this.mixer = new THREE.AnimationMixer(this.person);
					const playerRun = this.mixer.clipAction(
						this.person.animations[0]
					);
					playerRun.play();
					// 获取渲染的时间间隔
					this.clock = new THREE.Clock();
					this.scene.add(this.person);
				});
			},
			addLamtern() {
				let fbxLoader = new FBXLoader();
				fbxLoader.load("/models/lamtern/streetlamp.fbx", (object) => {
					this.lamtern = object;
					let texture1 = THREE.ImageUtils.loadTexture(
						"/models/lamtern/Fiberglass0014_S.jpg"
					);
					let texture2 = THREE.ImageUtils.loadTexture(
						"/models/lamtern/MetalBase0121_9_S.jpg"
					);
					let texture3 = THREE.ImageUtils.loadTexture(
						"/models/lamtern/MetalBase0123_S.jpg"
					);

					this.lamtern.traverse(function (child) {
						if (child.isMesh) {
							child.castShadow = true;
							child.receiveShadow = true;
							child.material.map = texture3;
							child.material.lightMap = texture1;
						}
					});
					this.lamtern.receiveShadow = true;
					this.lamtern.castShadow = true;
					this.lamtern.scale.set(0.2, 0.2, 0.2);
					this.lamtern.position.set(-8, -1, 0.01);
					this.lamtern.rotateX(Math.PI / 2);

					this.scene.add(this.lamtern);
				});
			},
			render() {
				if (this.controls) {
					this.controls.update();
				}
				if (this.carMesh) {
					for (let i = 0; i < this.carMesh.material.length; i++) {
						this.carMesh.material[i].emissive.r =
							controls["color" + i][0] / 255;
						this.carMesh.material[i].emissive.g =
							controls["color" + i][1] / 255;
						this.carMesh.material[i].emissive.b =
							controls["color" + i][2] / 255;
					}
				}
				if (this.mixer) {
					this.tickerNum++;
					this.mixer.update(this.clock.getDelta());

					const remainder =
						this.tickerNum % this.person.xStepArr.length;
					const integer = Math.floor(
						this.tickerNum / this.person.xStepArr.length
					);
					if (integer % 2 == 0) {
						this.person.rotation.y = Math.PI / 2;
						this.person.position.set(
							this.person.xStepArr[remainder],
							0,
							0.01
						);
					} else {
						this.person.rotation.y = -Math.PI / 2;
						this.person.position.set(
							this.person.xStepArr[
								this.person.xStepArr.length - remainder
							],
							0,
							0.01
						);
					}
				}

				this.renderer.render(this.scene, this.camera);
				requestAnimationFrame(this.render);
			},
			createControls() {
				this.controls = new OrbitControls(
					this.camera,
					this.renderer.domElement
				);
				this.controls.enablePan = false;
				this.controls.maxZoom = 2;
				this.controls.minDistance = 10;
				this.controls.maxDistance = 70;
				this.controls.autoRotate = true;
				this.controls.autoRotateSpeed = 1;

				// OrbitControls
				var orbitControl = gui.addFolder("OrbitControls");
				orbitControl
					.add(this.controls, "autoRotate", [false, true])
					.onChange((e) => {
						this.controls.autoRotate = JSON.parse(e);
					});
				orbitControl.open();
			},
		},
	};
</script>

<style></style>
