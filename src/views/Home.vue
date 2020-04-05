<template>
  <div id="home">
    <div id="container">
      <div
        class="buddy"
        v-for="(user,index) in users"
        :key="index"
        @touchstart="OnTouchStart($event)"
        @touchmove="OnTouchMove($event, index, user.url)"
        @touchend="OnTouchEnd()"
      >
        <div class="avatar" :style="{'background': 'url('+user.url+')'}"></div>
        <p class="user-name">{{user.name}}さん</p>
      </div>
    </div>
    <div class="flex between buttons">
      <img src="../assets/cross.png" class="btn btn01" @click="nodeBtn" />
      <img src="../assets/person.png" class="btn btn02" @click="$router.push('About')" />
      <img src="../assets/heart.png" class="btn btn03" @click="likeBtn" />
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      isActive1: false,
      isActive2: false,
      users: [],
      // 擬似的にindexを取得、末尾Btn関数にて使用
      usersLen: null,
      swipe: {
        flag: false,
        threshold: 10,
        start: {
          x: 0
        },
        current: {
          x: 0
        },
        distance: {
          x: 0
        }
      }
    };
  },
  methods: {
    OnTouchStart: function(e) {
      this.swipe.flag = true;
      this.swipe.start.x = e.touches[0].pageX;
    },
    OnTouchMove: function(e, index, url) {
      this.swipe.current.x = e.touches[0].pageX;
      this.swipe.distance.x = this.swipe.current.x - this.swipe.start.x;
      if (
        this.swipe.flag &&
        this.swipe.distance.x > 0 &&
        this.swipe.distance.x >= this.swipe.threshold
      ) {
        // 右スワイプ後の処理を記述
        this.swipe.flag = false;
        this.rotateRight(e);
        this.addLikes(index, url);
      }
      if (
        this.swipe.flag &&
        this.swipe.distance.x < 0 &&
        this.swipe.distance.x >= this.swipe.threshold * -1
      ) {
        // 左スワイプ後の処理を記述
        this.swipe.flag = false;
        this.rotateLeft(e);
        this.deleteLikes(url);
      }
    },
    OnTouchEnd: function() {
      this.swipe.flag = false;
    },
    rotateRight(e) {
      e.currentTarget.className = "buddy rotateright";
    },
    rotateLeft(e) {
      e.currentTarget.className = "buddy rotateleft";
    },
    likeBtn() {
      const e = document.querySelector(
        ".buddy:nth-child(" + this.usersLen + ")"
      );
      e.classList.add("rotateright");

      const url = this.users[this.usersLen - 1].url;
      this.addLikes(this.usersLen, url);

      this.usersLen -= 1;
    },
    nodeBtn() {
      const e = document.querySelector(
        ".buddy:nth-child(" + this.usersLen + ")"
      );
      e.classList.add("rotateleft");

      const url = this.users[this.usersLen - 1].url;
      this.deleteLikes(url);

      this.usersLen -= 1;
    },
    async addLikes(index, url) {
      console.log(index);
      var db = firebase.firestore();
      const data = await db
        .collection("likes")
        .where("url", "==", url)
        .where("email", "==", this.$store.state.user.email)
        .get();
      if (data.empty == true) {
        await db.collection("likes").add({
          email: this.$store.state.user.email,
          url: url,
          name: this.users[index - 1].name
        });
      }
    },
    async deleteLikes(url) {
      var db = firebase.firestore();
      const data = await db
        .collection("likes")
        .where("url", "==", url)
        .where("email", "==", this.$store.state.user.email)
        .get();
      if (!data.empty == true) {
        await db
          .collection("likes")
          .doc(data.docs[0].id)
          .delete();
      }
    }
  },
  async created() {
    var db = firebase.firestore();
    await db
      .collection("people")
      .get()
      .then(query => {
        query.forEach(doc => {
          var data = doc.data();
          this.users.push(data);
        });
      });
    this.usersLen = this.users.length;
  },
  mounted() {}
};
</script>

<style scoped>
#home {
  background: #000;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.user-name {
  margin-top: 40px;
  background: #000;
}
.buttons {
  width: 50%;
  margin: 0 auto;
}
.btn {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  border: none;
}
/* tinderスライド描画 */
#container {
  width: 80%;
  padding: 100px 0;
  margin: auto !important;
  display: block;
  height: 500px;
  position: relative;
  list-style-type: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.buddy {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 20px 0;
  width: 100%;
  height: 560px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  cursor: hand;
}
.rotateleft {
  opacity: 0;
  transform: rotate(30deg) scale(1);
  transition: 1s;
  margin-left: -400px;
  cursor: e-resize;

  z-index: 10;
}
.rotateright {
  opacity: 0;
  transform: rotate(-30deg) scale(1);
  transition: 1s;
  margin-left: 400px;

  cursor: w-resize;
  z-index: 10;
}
.avatar {
  background: #222;
  width: 100%;
  height: 540px;
  background-size: cover !important;
  background-position: center;
  background-repeat: no-repeat;
}
.like {
  border-radius: 5px;
  padding: 5px 10px;
  border: 2px solid green;
  color: green;
  text-transform: uppercase;
  font-size: 15px;
  position: absolute;
  top: 50px;
  right: 40px;
  text-shadow: none;
}
.dislike {
  border-radius: 5px;
  padding: 5px 10px;
  border: 2px solid red;
  color: red;
  text-transform: uppercase;
  font-size: 15px;
  position: absolute;
  top: 50px;
  left: 40px;
  text-shadow: none;
}
</style>