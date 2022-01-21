<template>
	<MyContentNavHeader />
	<div class="flex flex-col justify-center h-screen">
		<h3
			class="justify-center text-2xl flex font-semibold mb-4"
		>
			Sign In To Display Your Content
		</h3>
		<div class="flex justify-center items-baseline space-x-1">
			<button
				@click="onSignInClicked"
				class="text-blue-600 text-lg font-bold"
			>
				Sign In
			</button>
			<p class="text-sm text-gray-400">to add plans and appointments</p>
		</div>
	</div>
</template>

<script lang="ts">
import NavigationHeader from '@/components/ui/navigation-header/navigation-header.vue'
import MyContentNavHeader from '@/views/my-content-screen/my-content-nav-header.vue'
import {defineComponent} from 'vue'
import {NavigationRoute} from '@/router/navigation-route.enum'
import router from '@/router'

export default defineComponent({
	components: {NavigationHeader, MyContentNavHeader},
	setup() {
		const onSignInClicked = () => {
			navigateToRoute(NavigationRoute.signIn)
		}
		const navigateToRoute = (route: NavigationRoute) => {
			router.push(route)
		}
		return {
			onSignInClicked
		}
	}
})
</script>
