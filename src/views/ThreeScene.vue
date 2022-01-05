<template>
	<div id="container"></div>
</template>

<script>
	import * as THREE from "three";
	import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
	import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
	// import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

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
				const ambientLight = new THREE.AmbientLight(0xffffff, 1);
				this.scene.add(ambientLight);
				// 创建聚光灯
				const spotLight = new THREE.SpotLight(0xffffff);
				spotLight.position.set(-40, 60, -10);
				spotLight.castShadow = true;
				this.scene.add(spotLight);
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
				});
				this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染区域尺寸
				this.renderer.shadowMap.enabled = true; // 显示阴影
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
				// this.renderer.setClearColor(0x3f3f3f, 1); // 设置背景颜色
				element.appendChild(this.renderer.domElement);
			},
			createMesh() {
				// const bgGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
				// const bgMaterial = new THREE.MeshBasicMaterial({
				//     color:'0xffffff'
				// });
				// const plain = new THREE.Mesh(bgGeometry, bgMaterial);
				// this.scene.add(plain);

				const geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
				let texture = THREE.ImageUtils.loadTexture("/image/ground.png");
				texture.wrapS = THREE.RepeatWrapping; //重复平铺
				texture.wrapT = THREE.RepeatWrapping; //重复平铺
				texture.repeat.set(4, 4); //重复次数
				const material = new THREE.MeshBasicMaterial({
					map: texture,
					// side: THREE.DoubleSide,
				});
				const cube = new THREE.Mesh(geometry, material);
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
				cubeMesh.position.set(-7.5, 7.5, 2.5); //设置立方体的坐标
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
				planeMesh.position.set(-7.5, 5.99, 2.5);
				planeMesh.rotateX(Math.PI / 2);
				this.scene.add(planeMesh);
			},
			addCars() {
				let fbxLoader = new FBXLoader();
				fbxLoader.load(
					"/models/cars/koenigsegg-agera/uploads_files_2792345_Koenigsegg.fbx",
					(object) => {
						console.log("object", object);
						const mesh = object.children[2].clone();
						mesh.scale.set(0.1,0.1,0.1);
						mesh.rotateX(Math.PI / 2);
						mesh.rotateY(-Math.PI / 2);
						var box = new THREE.Box3().setFromObject(mesh);
						mesh.position.set(7.5,7.5, 0.47);
						mesh.material[0].emissive.setHex( 0xff0000 );
						mesh.material[1].emissive.setHex( 0x00ff00 );
						mesh.material[2].emissive.setHex( 0xffffff );
						mesh.material[3].emissive.setHex( 0xffffff );
						mesh.material[4].emissive.setHex( 0x000000 );
						this.scene.add(mesh);
						object.traverse(function (child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow = true;
							}
						});
					}
				);
			},
			render() {
				if (this.controls) {
					this.controls.update();
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
				this.controls.minDistance = 30;
				this.controls.maxDistance = 70;
				// this.controls.autoRotate = true;
				this.controls.autoRotateSpeed = 1;
			},
		},
	};
</script>

<style></style>
