<template>
	<NavigationHeader />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NavigationHeader from '@/components/ui/navigation-header/navigation-header.vue';
import {IconService} from '@/services/icon/icon.service';
import {Icon} from '@/services/icon/icon.enum';
import router from '@/router';

const icons = {
	back: IconService.getIcon(Icon.chevronLeft),
	bookmark: IconService.getIcon(Icon.bookmarkFilled),
	bookmarkGradient: IconService.getIcon(Icon.bookmarkGradient),
  notification: IconService.getIcon(Icon.notification)
}
const onBackClicked = () => {
	router.back()
}

export default defineComponent({
	components: {NavigationHeader},
	setup() {
		return {
			icons,
			onBackClicked,
		}
	}
})

</script>
