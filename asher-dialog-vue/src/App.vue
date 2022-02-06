<template>
  <MainScreen :treeData="treeData" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import MainScreen from "./views/MainScreen.vue";
import treeData from "./tree.json";

export default defineComponent({
  name: "App",
  components: { MainScreen },
  computed: {},
  methods: {},
  data() {
    return {
      treeData: treeData,
    };
  },
});
</script>

<style lang="scss">
body {
  display: flex;
  height: 100vh;
  margin: 0;
}

html {
  font-size: 18px;
}

#app {
  flex: 1;
  font-family: Courier, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: whitesmoke;
  background-color: rgba(15, 15, 15, 0.95);
  height: 100vh;
}
</style>
