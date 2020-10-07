<template>
<div class="loading_container" v-show="loading">
	<div class="line_loader">
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</div>
</div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      loading:false,
    }
  },
  created() {
    var that = this;
    this.bus.$on('loading', function(data) {
      that.loading = data;
    });
  },

  methods: {
  	
  }
}
</script>
