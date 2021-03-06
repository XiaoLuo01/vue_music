import { mapGetters,mapMutations, mapActions  } from "vuex"
import { playMode } from "@/common/js/config"
import { shuffle } from "@/common/js/util"

export const playlistMixin = {
  computed: {
    ...mapGetters(["playList"])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playlist(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error("component must implement handlePlayList method")
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
          ? "icon-loop"
          : "icon-random"
    },
    ...mapGetters(["sequenceList", "currentSong", "playList", 'mode', 'favoriteList'])
  },
  methods: {
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setSequenceList: "SET_SEQUENCE_LIST"
    }),
    ...mapActions([
        'saveFavoriteList',
        'deleteFavoriteList'
      ]),
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
        if (this.isFavorite(song)) {
          this.deleteFavoriteList(song)
        } else {
          this.saveFavoriteList(song)
        }
      },
      getFavoriteIcon(song) {
        if (this.isFavorite(song)) {
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      isFavorite(song) {
        const index = this.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        return index > -1
      },
  }
}


export const searchMixin = {
    data() {
      return {
        query: '',
        refreshDelay: 120
      }
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      onQueryChange(query) {
        this.query = query
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory'
      ])
    }
  }
