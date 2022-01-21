<template>
	<NavigationHeader header="Appointments" />
	<div
		class="flex flex-col"
	>
		<div class="flex flex-col justify-center h-full">
			<div
				class="bg-gray-300 text-left pl-4 text-gray-500"
			>
				Today
			</div>
			<div
				class="flex justify-between px-4 items-center text-left my-4"
			>
				<div
					class="flex items-center space-x-4"
				>
					<div>06:00PM</div>
					<div>
						<div
							class="text-lg"
						>
							Coach Name
						</div>
						<div
							class="text-sm text-gray-400"
						>
							Starting Now
						</div>
					</div>
				</div>
				<div>
					<button
						class="rounded-lg bg-primary-400 text-white font-bold px-4 py-1"
					>
						Join
					</button>
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-center h-full">
			<div
				class="bg-gray-300 text-left pl-4 text-gray-500"
			>
				06.Jan.21
			</div>
			<div
				class="flex justify-between px-4 items-center text-left my-4"
			>
				<div
					class="flex items-center space-x-4"
				>
					<div>06:00PM</div>
					<div>
						<div
							class="text-lg"
						>
							Coach Name
						</div>
						<div
							class="text-sm text-gray-400"
						>
							Starting after 2hr
						</div>
					</div>
				</div>
				<div>
					<button
						class="rounded-lg bg-gray-300 text-white font-bold px-4 py-1"
					>
						Join
					</button>
				</div>
			</div>
		</div>
	</div>
	<div
		class="text-9xl transform -rotate-90 text-primary-to-accent-gradient opacity-50 relative -top-10 z-10"
	>
		Coming Soon!
	</div>
</template>

<script lang="ts">
import NavigationHeader from '@/components/ui/navigation-header/navigation-header.vue'
import {defineComponent} from 'vue'

export default defineComponent({
	components: {NavigationHeader}
})
</script>
