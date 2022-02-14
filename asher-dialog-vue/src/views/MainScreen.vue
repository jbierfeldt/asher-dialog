<template>
  <div class="container is-max-desktop">
    <audio :src="musicSrc" preload="auto" ref="bgAudio" loop autoplay></audio>
    <!-- <button @click="addMessage">asdf</button> -->
    <transition
      :duration="{ enter: 5000, leave: 5000 }"
      name="long-fade"
      mode="out-in"
    >
      <div class="screen-writing-container" key="a">
        <div class="dialog-container">
          <transition-group name="fade">
            <div
              v-for="(message, index) in oldMessages"
              :key="index"
              class="dialog-message old-message"
            >
              {{ message }}
            </div>
          </transition-group>
          <div class="dialog-message newest-message">
            <TypeWriter
              :array="newMessages"
              :delay="3000"
              @onTypingDone="onTypingDone"
              @onMessageDone="onMessageDone($event)"
            ></TypeWriter>
          </div>
        </div>
        <div
          class="response-wrapper"
          :style="{ visibility: showResponseContainer ? 'visible' : 'hidden' }"
        >
          <transition-group name="fade">
            <div class="response-container" v-if="showResponseContainer">
              <div
                class="response-option"
                v-for="(val, index) in responseOptions"
                :key="index"
              >
                <div @click="optionChoose(index)">> {{ val.mes }}</div>
              </div>
            </div>
            <div class="response-container" v-if="isEnded">
              <div @click="spotifyLink" class="response-option">
                > Listen on Spotify.
              </div>
              <div @click="websiteLink" class="response-option">
                > back to asherblank.com
              </div>
            </div>
            <div v-if="isEnded" class="made-by">
              Site:
              <a href="http://bierfeldt.me" target="_blank"
                >Jackson Bierfeldt</a
              >
            </div>
          </transition-group>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import TypeWriter from "@/components/TypeWriter.vue";
import DialogEngine, { ResponseEvent, Tree } from "@/lib/DialogEngine";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainScreen",
  components: { TypeWriter },
  computed: {
    showResponseContainer() {
      if (this.responseOptions && this.typingDone) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    addMessage() {
      this.newMessages = [] as string[];
      this.newMessages.push("New message");
    },
    optionChoose(index: number) {
      const audio = this.$refs.bgAudio as HTMLAudioElement;
      if (audio.paused) {
        audio.volume = 0;
        audio.play();
        this.fadeIn(audio);
        // for more seemless looping
        audio.addEventListener("timeupdate", function () {
          var buffer = 3;
          if (this.currentTime > this.duration - buffer) {
            this.currentTime = 0;
            this.play();
          }
        });
      }

      this.newMessages.forEach((m: string) => {
        this.oldMessages.push(m);
      });
      this.newMessages = [] as string[];
      this.typingDone = false;

      this.oldMessages.push(this.responseOptions[index].mes);
      this.responseOptions = [] as ResponseEvent[];
      if (this.currentCallback) {
        this.currentCallback(index);
      }
    },
    onMessageDone(index: number) {
      this.oldMessages.push(this.newMessages[index]);
    },
    onTypingDone() {
      this.typingDone = true;
      if (this.endCallback) {
        this.endCallback();
      }
    },
    displayHandler(message: string): void {
      this.newMessages.push(message);
    },
    inputHandler(responses: ResponseEvent[], cb: any): void {
      this.responseOptions = responses;
      this.currentCallback = cb;
    },
    endHandler(): void {
      this.endCallback = () => {
        console.log("the end");
        // this.newMessages.push("The Part, by Asher Blank. Out 2/11.");
        this.isEnded = true;
      };
    },
    spotifyLink(): void {
      window.open(
        "https://open.spotify.com/album/5ywv7RpLHsLXneY8L2SpN3?si=9OlWEdAzQiqVa24wB_6PMg",
        "_blank"
      );
    },
    websiteLink(): void {
      window.location.href = "https://asherblank.com";
    },
    fadeIn(audioElement: HTMLAudioElement): void {
      this.fadeInterval = setInterval(() => {
        let vol = audioElement.volume;

        if (vol < 1) {
          vol += 0.05;
          if (vol > 1) {
            audioElement.volume = 1;
          } else {
            audioElement.volume = vol;
          }
        } else {
          // Stop the setInterval when 100 is reached
          clearInterval(this.fadeInterval);
        }
      }, 200);
    },
  },
  created() {
    this.treeParser = new DialogEngine({
      displayHandler: this.displayHandler,
      inputHandler: this.inputHandler,
      endHandler: this.endHandler,
    });
    this.treeParser.loadTree(this.treeData as Tree);
    this.treeParser.startTree();
  },
  props: {
    treeData: Object,
  },
  data() {
    return {
      treeParser: new DialogEngine({
        displayHandler: undefined,
        inputHandler: undefined,
        endHandler: undefined,
      }),
      currentCallback: undefined as any,
      endCallback: undefined as any,
      dialogMessage: "",
      responseOptions: [] as ResponseEvent[],
      newMessages: [] as string[],
      oldMessages: [] as string[],
      typingDone: false,
      isEnded: false,
      musicSrc: require(`@/assets/thepart.mp3`),
      fadeInterval: 0,
    };
  },
});
</script>

<style lang="scss">
@import "bulma/sass/elements/container.sass";

.container {
  max-width: 768px;
  height: 100vh;
  display: flex;
  // border: 2px solid blue;
}

.screen-writing-container {
  top: 0;
  height: 86vh;
  font-size: 1.2rem;
  width: 100%;
  overflow: hidden;
  padding: 0.5em;
  // border: 2px solid green;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.dialog-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
  overflow: auto;
  // border: 2px solid orange;
}

.dialog-message {
  color: rgba(245, 245, 245, 0.6);
  margin-bottom: 1rem;
}
.dialog-message:nth-last-of-type(2) {
  margin-bottom: 3rem;
}

.newest-message {
  color: rgb(245, 245, 245);
  font-weight: 600;
  margin-bottom: 3rem;
}

.response-wrapper {
  // border: 2px solid pink;
  height: 30%;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.response-option {
  cursor: pointer;
}
.response-option:not(:last-of-type) {
  margin-bottom: 1rem;
}

.hero-container {
  display: flex;
  flex: 1;
  // border: 2px solid orange;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 244, 244);
  box-shadow: 6px 6px 8px -2px rgb(255 255 255 / 50%);
  border-radius: 6px;
}

.fade-enter-active {
  transition: opacity 2s ease;
}

.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.long-fade-enter-active {
  transition: opacity 5s ease;
}

.long-fade-leave-active {
  transition: opacity 5s ease;
}

.long-fade-enter-from,
.long-fade-leave-to {
  opacity: 0;
}

.made-by {
  color: rgb(245, 245, 245);
  padding: 1em;
  width: 100%;
  background-color: rgba(10, 10, 10, 0.8);
  position: fixed;
  top: 0px;
  left: 0px;
}

.made-by a:visited {
  color: rgb(245, 245, 245);
}
</style>
