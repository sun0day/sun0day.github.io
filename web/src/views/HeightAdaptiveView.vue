<script setup>
import { ref } from "vue";

const list = ref(new Array(100).fill(0).map((x, i) => `item${i}`))

</script>

<template>
  <div class="container">
  <header>
    Header - calc
  </header>
    <ul>
      <li v-for="item in list">
        {{ item }}
      </li>
    </ul>
  <footer>
    Footer
  </footer>
  </div>

  <div class="container">
  <header>
    Header - flex
  </header>
    <ul>
      <li v-for="item in list">
        {{ item }}
      </li>
    </ul>
  <footer>
    Footer
  </footer>
  </div>
</template>

<style>
#app {
  display: flex;
  overflow: hidden;
}

.container {
  width: 50%;
  height: 100vh;
}

.container:first-of-type ul {
  height: calc(100vh - 128px);
  background-color: bisque;
  color: blueviolet;
}

.container:last-of-type {
  display: inline-flex;
  flex-direction: column;
}

.container:last-of-type ul {
  flex: 1;
}

.container:last-of-type header, .container:last-of-type footer {
  border-left: 1px solid #cfcfcf;
}

ul {
  width: 100%;
  margin: 0;
  background-color: rebeccapurple;
  color: bisque;
  overflow-y: auto;
}

header {
  padding: 20px;
  border-bottom: 1px solid #efefef;
}
footer {
  padding: 20px;
  border-top: 1px solid #efefef;
}
</style>
