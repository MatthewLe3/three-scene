<template>
	<div id="container"></div>
</template>

<script>
	import * as THREE from "three";
	import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
	import * as dat from "dat.gui";

	const sceneWidth = window.innerWidth;
	const sceneHeight = window.innerHeight;

	export default {
		data() {
			return {
				scene: null,
				light: null,
				camera: null,
				fov: 60,
				renderer: null,
				boxTextureList: [
					"left",
					"right",
					"top",
					"bottom",
					"front",
					"back",
				],
				box: null,
				timer: null,
				controls: null,
				tipsList: [
					{
						x: 12,
						y: 6,
						z: -148,
						index: 0,
					},
					{
						x: -152,
						y: 1,
						z: -133,
						index: 1,
					},
				],
				tipsSpriteList: [],
			};
		},
		mounted() {
			this.element = document.getElementById("container");
			this.init();
			this.gui();
			window.addEventListener("resize", this.onResize, false);
			window.addEventListener("click", this.onMouseClick, false);
		},
		destroyed() {
			cancelAnimationFrame(this.timer);
		},
		methods: {
			init() {
				// 创建场景
				this.createScene();
				// 创建光源
				this.createLight();
				// 创建相机
				this.createCamera();
				// 添加天空盒
				this.addBox();
				// 添加标记点
				this.addTips();
				// 添加控制器
				this.addControls();
				// 创建渲染器
				this.createRender();
				// 渲染
				this.render();
			},
			createScene() {
				this.scene = new THREE.Scene();
				this.scene.background = new THREE.Color(0x101010);
			},
			createLight() {
				// 环境光
				// const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
				// this.scene.add(ambientLight);
			},
			createCamera() {
				this.camera = new THREE.PerspectiveCamera(
					45,
					sceneWidth / sceneHeight,
					0.1,
					1000
				);
				// 0, -30, 40
				this.camera.position.set(0, 0, 50); // 设置相机位置
				// this.camera.lookAt(this.scene.position);
				// this.camera.up.set(0, 0, 1);
				// this.camera.lookAt(new THREE.Vector3(10, 0, 0)); // 设置相机方向
				// this.scene.add(this.camera);
			},
			addBox() {
				let sphereGeometry = new THREE.SphereGeometry(16, 50, 50);
				sphereGeometry.scale(16, 16, -16);
				let texture = new THREE.TextureLoader().load(
					"/image/livingRoom.jpg"
				);
				let sphereMaterial = new THREE.MeshBasicMaterial({
					map: texture,
				});
				this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
				this.scene.add(this.sphere);
			},
			addTips() {
				let texture = new THREE.TextureLoader().load(`/image/tips.png`);
				let material = new THREE.SpriteMaterial({map: texture});
				this.tipsSpriteList = [];
				this.tipsList.forEach((item) => {
					let sprite = new THREE.Sprite(material);
					sprite.scale.set(2, 2, 2);
					sprite.position.set(item.x, item.y, item.z);
					sprite.item = item;
					this.scene.add(sprite);
					this.tipsSpriteList.push(sprite);
				});
			},
			addControls() {
				this.controls = new OrbitControls(this.camera, this.element);
				this.controls.minDistance = 1;
				this.controls.maxDistance = 100;
				this.controls.enablePan = false;
				this.controls.zoomSpeed = 5.0;
				this.controls.rotateSpeed = -0.5;
			},
			createRender() {
				this.renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true,
					logarithmicDepthBuffer: true,
				});
				this.renderer.setSize(sceneWidth, sceneHeight); // 设置渲染区域尺寸
				this.element.appendChild(this.renderer.domElement);
			},
			render() {
				if (this.controls) {
					this.controls.update();
				}
				this.renderer.render(this.scene, this.camera);
				this.timer = requestAnimationFrame(this.render);
			},
			onResize() {
				this.camera.aspect = sceneWidth / sceneHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(sceneWidth, sceneHeight);
			},
			onMouseClick(e) {
				e.preventDefault();
				let raycaster = new THREE.Raycaster();
				let mouse = new THREE.Vector2();
				mouse.x = (e.clientX / this.element.clientWidth) * 2 - 1;
				mouse.y = -(e.clientY / this.element.clientHeight) * 2 + 1;
				raycaster.setFromCamera(mouse, this.camera);
				let intersects = raycaster.intersectObjects(
					this.tipsSpriteList,
					true
				);
				if (intersects.length > 0) {
					console.log("点击了", intersects[0].object.item.index);
				}
			},
			gui() {
				const gui = new dat.GUI();

				var tipControl = gui.addFolder("tip");
				tipControl
					.add(this.tipsList[0], "x", -200, 50, 1)
					.onChange((e) => {
						this.tipsList[0].x = e;
						this.scene.children[1].position.set(
							this.tipsList[0].x,
							this.tipsList[0].y,
							this.tipsList[0].z
						);
					});
				tipControl
					.add(this.tipsList[0], "y",-200, 50, 1)
					.onChange((e) => {
						this.tipsList[0].y = e;
						this.scene.children[1].position.set(
							this.tipsList[0].x,
							this.tipsList[0].y,
							this.tipsList[0].z
						);
					});
				tipControl
					.add(this.tipsList[0], "z", -200, 50, 1)
					.onChange((e) => {
						this.tipsList[0].z = e;
						this.scene.children[1].position.set(
							this.tipsList[0].x,
							this.tipsList[0].y,
							this.tipsList[0].z
						);
					});

				tipControl
					.add(this.tipsList[1], "x", -200, 50, 1)
					.onChange((e) => {
						this.tipsList[1].x = e;
						this.scene.children[2].position.set(
							this.tipsList[1].x,
							this.tipsList[1].y,
							this.tipsList[1].z
						);
					});
				tipControl
					.add(this.tipsList[1], "y", -200, 50, 1)
					.onChange((e) => {
						this.tipsList[1].y = e;
						this.scene.children[2].position.set(
							this.tipsList[1].x,
							this.tipsList[1].y,
							this.tipsList[1].z
						);
					});
				tipControl
					.add(this.tipsList[1], "z", -200, 50, 1)
					.onChange((e) => {
						this.tipsList[1].z = e;
						this.scene.children[2].position.set(
							this.tipsList[1].x,
							this.tipsList[1].y,
							this.tipsList[1].z
						);
					});

				tipControl.open();
			},
		},
	};
</script>

<style lang="less">
	#container {
		width: 100%;
		height: 100%;
	}
</style>
