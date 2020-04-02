<template>
  <div class="home">
    <p>homepage</p>
    <div id="container">
      <div class="buddy" v-for="(user,index) in users" :key="index">
        <div class="avatar" style="display: block;" :style="{'background': 'url('+user.url+')'}"></div>
        <p class="user-name">{{user.name}}さん</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  background: #000;
  height: 100vh;
  width: 100vw;
}
.user-name {
  margin-top: 40px;
}
/* tinderスライド描画 */
#container {
  width: 500px;
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
.buddy:first-child {
  display: block;
}
.buddy {
  display: none;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 20px;
  width: 360px;
  height: 560px;
  top: 50px;
  left: 50px;
  position: absolute;
  cursor: hand;
}
.rotate-left {
  transform: rotate(30deg) scale(0.8);
  transition: 1s;
  margin-left: 400px;
  cursor: e-resize;
  opacity: 0;
  z-index: 10;
}
.rotate-right {
  transform: rotate(-30deg) scale(0.8);
  transition: 1s;
  opacity: 0;
  margin-left: -400px;
  cursor: w-resize;
  z-index: 10;
}
.avatar {
  background: #222;
  width: 340px;
  height: 540px;
  display: block;
  margin-top: 10px;
  margin-left: 10px;
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

/* ーーーーーーーーーーーーーーーーーーーーーーーーーー */
</style>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      users: []
    };
  },
  methods: {
    get() {
      var db = firebase.firestore();
      db.collection("people")
        .get()
        .then(query => {
          query.forEach(doc => {
            var data = doc.data();
            this.users.push(data);
          });
        });
    }
  },
  created() {
    this.get();
  }
};
</script>
