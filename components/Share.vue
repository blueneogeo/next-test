<template lang="pug">
	div
		a(@click='$emit("open")')
			.item-title {{ title }}
			.item-thumbnail 
				img(:src='thumbnail')
			slot

</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true
		},
		thumbnail: {
			type: String,
			required: false
		}
	}
}
</script>

<style scoped>

.item-thumbnail img {
  width: 30px;
  height: 30px;
}

</style>
