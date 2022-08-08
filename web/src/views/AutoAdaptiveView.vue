<script setup>
import { ref } from "vue";

const baseWidth = 750;
const dpr = ref(Math.ceil(window.devicePixelRatio || 1));
const scale = ref(parseFloat(1 / dpr.value).toFixed(2));
let tid;

function init() {
  const metaEl = document.getElementsByTagName("meta")[0];
  metaEl.setAttribute("name", "viewport");
  metaEl.setAttribute(
    "content",
    "initial-scale=" +
      scale.value +
      ", maximum-scale=" +
      scale.value +
      ", minimum-scale=" +
      scale.value +
      ", user-scalable=no"
  );
  document.body.style.fontSize = 20 * dpr.value + "px";

  window.addEventListener(
    "resize",
    function () {
      clearTimeout(tid);
      tid = setTimeout(refreshRem);
    },
    false
  );

  refreshRem();
}

function refreshRem() {
  document.documentElement.style.fontSize =
    window.innerWidth / 100  + "px";
}

function px2rem(px) {
  return (px * 100  / baseWidth)+ "rem";
}

function px2vw(px) {
  return (px * 100 / baseWidth) + "vw";
}

init();
</script>

<template>
  <div>
    <h1>dpr={{ dpr }} scale={{ scale }} baseWidth=750px</h1>
    <div class="container">
    <div
      class="rem"
      :style="{
        width: px2rem(200),
        height: px2rem(60),
        lineHeight: px2rem(60),
      }"
    >
      rem: 200px
    </div>
    <div
      class="vw"
      :style="{ width: px2vw(200), height: px2vw(60), lineHeight: px2vw(60) }"
    >
      vw: 200px
    </div>
    </div>
  </div>
</template>

<style>
h1 {
  padding-bottom: 14px;
  font-size: inherit;
  border-bottom: 1px solid #cfcfcf;
}

.container {
  text-align: center;
}

.rem,
.vw {
  display: inline-block;
  min-width: fit-content;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.rem {
  margin-right: 20px;
  margin-bottom: 20px;
  border: 1px solid coral;
}

.vw {
  border: 1px solid cadetblue;
}
</style>
