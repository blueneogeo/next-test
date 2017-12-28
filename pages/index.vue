<template lang='pug'>
  .homepage

    .login(v-if='!loggedIn')
      form(@submit.prevent='login')
        input(type='text' placeholder='username' v-model='username')
        input(type='password' v-model='password')
        input(type='submit' value='Log in')
      .errormessage {{ errorMessage }}

    .browse(v-if='loggedIn')

      .navbar
        button(@click='logout') Logout

      .channels
        h1 Channels
        ul
          li(v-for='channel in sortedChannels' v-bind:key='channel.id')
            a(@click='selectChannel(channel)') {{ channel.id }} {{ channel.name }}

      .channel(v-if='selectedChannel')
        h1 {{ selectedChannel.name }}
        ul
          share(
              v-for='share in shares'
              v-bind:key='share.id'
              @open='openArticle(share.item)'
              :title='share.item.title'
              :thumbnail='share.item.thumbnail'
          )
</template>

<script>
import Logo from "~/components/Logo.vue";
import Share from "~/components/Share.vue";
import { NineXAPI } from "~/assets/ninex-api.js";

const API_BASE_URL = "https://api.nineconnections.com";
const API_SIGN_IN_URL = "https://auth.nineconnections.com";
const baseAPI = NineXAPI(API_BASE_URL, API_SIGN_IN_URL);

export default {

  mounted() {
    console.log("base url: ", this.apiBaseUrl);
    this.loggedIn = this.authenticate();
    if (this.loggedIn) {
      this.loadChannels();
      const selected_channel_data = localStorage.getItem("selected_channel");
      if (selected_channel_data) {
        this.selectedChannel = JSON.parse(selected_channel_data);
        this.selectChannel(this.selectedChannel);
      }
    }
  },

  methods: {

    login() {
      this.errorMessage = "";
      baseAPI.login(
        this.username,
        this.password,
        token => {
          localStorage.setItem("access_token", token.access_token);
          console.log(localStorage.getItem("access_token"));
          this.loggedIn = this.authenticate();
        },
        error => {
          this.errorMessage = JSON.parse(error.responseText).message;
        }
      );
    },

    logout() {
      localStorage.removeItem("access_token");
      this.loggedIn = false;
    },

    authenticate() {
      const token = localStorage.getItem("access_token");
      if (!token) return false;
      this.api = baseAPI.authorize("Bearer " + token);
      return true;
    },

    loadChannels() {
      this.api.getChannelsList(
        channels => {
          console.log(channels);
          this.channels = channels;
        },
        error => {
          console.error(error);
        }
      );
    },

    selectChannel(channel) {
      console.log("selected channel", channel);
      this.selectedChannel = channel;
      localStorage.setItem("selected_channel", JSON.stringify(channel));
      this.api.getChannelShares(
        channel.id,
        shares => {
          console.log(shares);
          this.shares = shares;
        },
        error => {
          console.error(error);
        }
      );
    },

    openArticle(item) {
      window.open(item.url);
    }

  },

  computed: {

    sortedChannels() {
      return this.channels.sort((channel1, channel2) => {
        if (channel1.id < channel2.id) return 1;
        if (channel1.id > channel2.id) return -1;
        return 0;
      });
    }

  },

  data() {
    return {
      loggedIn: false,
      username: "",
      password: "",
      errorMessage: "",
      api: null,
      channels: [],
      selectedChannel: null,
      shares: []
    };
  },

  components: {
    Logo,
    Share
  }
}
</script>

<style>
.navbar {
  text-align: right;
}

.channels {
  height: 100%;
  width: 50%;
  overflow: hidden;
  float: left;
}

.channel {
  height: 100%;
  width: 50%;
  overflow: hidden;
  float: right;
}
</style>
