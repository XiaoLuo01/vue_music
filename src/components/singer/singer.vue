<template>
  <div class="singer" ref="singer">
    <ListView @select="selectSinger" :data="singers" ref="list"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList, getSingerDetail } from "@/api/singer"
import Singer from "@/common/js/singer"
import { ERR_OK } from "@/api/config"
import ListView from "@/base/listview/listview"
import {mapMutations} from 'vuex'
import { playlistMixin } from "@/common/js/mixin"

const HOT_NAME = "热门"
const HOT_SINGER_LEN = 10

export default {
  data() {
    return {
      singers: []
    }
  },
  mixins: [playlistMixin],
  components: {
    ListView
  },
  created() {
    this._getSingerList()
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 提交mutations
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }

        const key = item.Findex // 字母
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
      })

      // 转换map为有序列表
      let hot = []
      let ret = []
      for(let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)){
          ret.push(val)
        } else if(val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      // 排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
