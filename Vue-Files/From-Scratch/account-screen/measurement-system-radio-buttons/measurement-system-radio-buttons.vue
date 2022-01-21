<template>
	<div
		class="flex mb-2 mt-3 w-full"
	>
		<div
			v-for="(item, index) in items"
			class="w-full"
		>
			<label :for="item.label">
				<div
					:class="[
					modelValue.label === item.label ? 'bg-primary-500 text-white ' : 'bg-white text-black border border-gray-300 shadow-sm',
					disabled ? 'pointer-events-none' : '',
					index === 0 ? 'rounded-l' : 'rounded-r'
					]"
					class="text-base py-2 px-4 max-h-10"
					@click="onSelectionMade(item)"
				>
					{{item.label}}
				</div>
			</label>
			<input
				:class="[disabled ? 'ponter-events-none cursor-not-allowed' : '', 'hidden']"
				type="radio"
				name="measurement_system"
				:value="item.label"
				:disabled="disabled"
				>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref} from 'vue';
import {ISimpleNativeSelectItem} from '@/components/forms/inputs/selectors/simple-native-select/simple-native-select-item.interface';

interface Props {
	label: string
	items?: Array<ISimpleNativeSelectItem>
	modelValue: ISimpleNativeSelectItem
	disabled: boolean
}
const emittedEvents = {
	updateModelValue: 'update:modelValue'
}
export default defineComponent({
	name: 'MeasurementSystemRadioButtons',
	emits: [
		emittedEvents.updateModelValue
	],
	components: {},
	props: {
		modelValue: {
			type: Object as PropType<ISimpleNativeSelectItem>,
			required: true
		},
		label: {
			type: String,
			required: false,
			default: ''
		},
		items: {
			type: Array as PropType<Array<ISimpleNativeSelectItem>>,
			required: true
		},
		disabled: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	setup(props: Props, {emit}) {
		const onSelectionMade = (value: ISimpleNativeSelectItem) => {
			emit(emittedEvents.updateModelValue, value)
		}

		return {
			onSelectionMade
		}
	}
})
</script>

<style scoped>
</style>
