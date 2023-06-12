<script setup lang="ts"></script>
<template>
	<router-view></router-view>
</template>

<style>
.origin-button-class {
	font-size: 14px;
	width: 120px;
	height: 32px;
	border: 1px solid #ffffff;
	border-radius: 2px;
}

.bubble_box {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 500px;
	height: 300px;
	background: #111845a6;
	box-sizing: border-box;
	overflow: hidden;
	box-shadow: 0 20px 50px rgb(23, 32, 90);
	border: 2px solid #2a3cad;
	color: white;
	padding: 20px;
}
.bubble_box:before {
	content: "";
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.1);
	transition: 0.5s;
	pointer-events: none;
}
.bubble_box:hover:before {
	left: -50%;
	transform: skewX(-5deg);
}

.bubble_box .content {
	position: absolute;
	top: 15px;
	left: 15px;
	right: 15px;
	bottom: 15px;
	border: 1px solid #f0a591;
	padding: 20px;
	text-align: center;
	box-shadow: 0 5px 10px rgba(9, 0, 0, 0.5);
}
.bubble_box span {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: block;
	box-sizing: border-box;
}

.bubble_box span:nth-child(1) {
	transform: rotate(0deg);
}

.bubble_box span:nth-child(2) {
	transform: rotate(90deg);
	width: 490px;
	height: 500px;
}

.bubble_box span:nth-child(3) {
	transform: rotate(180deg);
}

.bubble_box span:nth-child(4) {
	transform: rotate(270deg);
	width: 480px;
	height: 480px;
}

.bubble_box span:before {
	content: "";
	position: absolute;
	width: 100%;
	height: 2px;
	background: #50dfdb;
	animation: animate 4s linear infinite;
}

@keyframes animate {
	0% {
		transform: scaleX(0);
		transform-origin: left;
	}
	50% {
		transform: scaleX(1);
		transform-origin: left;
	}
	50.1% {
		transform: scaleX(1);
		transform-origin: right;
	}

	100% {
		transform: scaleX(0);
		transform-origin: right;
	}
}
</style>
