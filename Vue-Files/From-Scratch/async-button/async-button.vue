<template>
	<div>
		<button
			type="button"
			:class="[formHasErrors || isLoading ? 'cursor-not-allowed pointer-events-none opacity-50 hover:bg-primary-600' : '', bgColorClass, 'select-none w-full flex justify-center py-2 px-4 border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-primary-500']"
		>
			<slot
				v-if="!isLoading"
			/>
			<div
				v-else
				:class="[bgColorClass, 'flex items-center justify-center']"
			>
				<div class="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
			</div>
		</button>
	</div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';

export default defineComponent({
	name: 'AsyncButton',
	props: {
		isLoading: {
			type: Boolean,
			required: true,
		},
		formHasErrors: {
			type: Boolean,
			required: false,
		},
		bgColorClass: {
			type: String,
			required: false,
			default: 'bg-primary-500'
		}
	},
	setup(props) {

		return {

		}
	}
})
</script>

<style>

</style>
