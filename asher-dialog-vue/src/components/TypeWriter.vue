<template>
  <div class="typed-text">
    <slot></slot>
    <span class="typed">{{ typeValue }}</span>
    <span :class="caret + ' ' + { typing: typeStatus }">&nbsp;</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";

export default defineComponent({
  name: "TypeWriter",
  components: {},
  computed: {},
  emits: ["onTypingDone", "onMessageDone"],
  methods: {
    typewriter() {
      if (this.array) {
        if (this.charIndex < this.array[this.arrayIndex].length) {
          if (!this.typeStatus) this.typeStatus = true;
          this.typeValue += this.array[this.arrayIndex].charAt(this.charIndex);
          this.charIndex += 1;
          setTimeout(this.typewriter, this.typeSpeed);
        } else if (this.array[this.arrayIndex + 1]) {
          this.$emit("onMessageDone", this.arrayIndex);
          this.charIndex = 0;
          this.typeValue = "";
          this.arrayIndex++;
          setTimeout(this.typewriter, this.delay);
        } else {
          this.typeStatus = false;
          this.$emit("onTypingDone");
        }
      }
    },
  },
  props: {
    array: {
      type: Array as () => Array<any>,
      required: false,
    },
    typeSpeed: {
      type: Number,
      default: 100, //125
    },
    start: {
      type: Number,
      default: 0,
    },
    caret: {
      type: String,
      default: "cursor",
    },
    delay: {
      type: Number,
      default: 1000,
    },
  },
  created() {
    setTimeout(this.typewriter, this.start);

    watch(
      () => this.array,
      () => {
        console.log("changed", this.array);
        this.charIndex = 0;
        this.typeValue = "";
        setTimeout(this.typewriter, this.delay);
      }
    );
  },
  data() {
    return {
      typeValue: "",
      typeStatus: false,
      arrayIndex: 0,
      charIndex: 0,
    };
  },
});
</script>

<style lang="scss">
.is-typed span.typed {
  color: black;
}

.typed-text span.cursor {
  display: inline-block;
  width: 3px;
  background-color: white;
  animation: blink 1s infinite;
}

.typed-text span.underscore {
  display: inline-flex;
  width: 10px;
  height: 1px;
  align-items: flex-end;
  background-color: white;
  animation: blink 1s infinite;
}

.typed-text span.cursor.typing {
  animation: none;
}

@keyframes blink {
  49% {
    background-color: white;
  }
  50% {
    background-color: transparent;
  }
  99% {
    background-color: transparent;
  }
}
</style>
