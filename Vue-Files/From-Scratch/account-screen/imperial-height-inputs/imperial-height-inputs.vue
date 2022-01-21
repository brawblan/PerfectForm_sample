<template>
	<div>
		<div
			class="relative leading-none border border-gray-300 rounded-sm px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary-600 focus-within:border-primary-600"
		>
			<label
				:for="label"
				class="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900">
				{{ label }}
			</label>
			<div class="flex">
				<div class="relative p-0">
					<input
						type="number"
						:name="label"
						id="feet"
						v-model="imperialFeetValue"
						autocomplete="false"
						class="w-1/2 border-0 p-0 text-left text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
						:disabled="disabled"
						@input="changeFeetValue($event.target.value)"
						@change="changeModelValue(imperialHeightInInches)"
					/>
					<div class="absolute inset-y-0 right-0 mr-1 flex items-center pointer-events-none">
						<span class="text-gray-500 sm:text-sm">
							ft
						</span>
					</div>
				</div>

				<div class="relative p-0">
					<input
						type="number"
						:name="label"
						id="inches"
						v-model="imperialInchesValue"
						autocomplete="false"
						class="w-1/2 border-0 mr-2 p-0 text-left text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
						:disabled="disabled"
						@input="changeInchesValue($event.target.value)"
						@change="changeModelValue(imperialHeightInInches)"
					/>
					<div class="absolute inset-y-0 -right-0.5 flex items-center pointer-events-none">
						<span class="text-gray-500 sm:text-sm">
							in
						</span>
					</div>
				</div>
			</div>

		</div>
		<p
			v-if="(displayedErrorMessage?.trim().length !== 0)"
			class="text-red-500 text-xs text-left"
		>
			{{ displayedErrorMessage }}&nbsp;
		</p>
	</div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'

export const EmittedEvents = {
	valueUpdated: 'update:modelValue'
}

interface Props {
	label?: string
	modelValue: string | number
	disabled?: boolean
}

export default defineComponent({
	name: 'ImperialHeightInputs',
	props: {
		label: {
			type: String,
			required: false,
			default: ''
		},
		modelValue: {
			type: [String, Number],
			required: true,
			default: ''
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
	},
	emits: [EmittedEvents.valueUpdated],
	setup(props: Props, {emit}) {
		const displayedErrorMessage = ref('')
		let errors = new Array<Error>()

		const initialFeet = Math.floor((props.modelValue as number) / 12)
		const initialInches = Number(((((props.modelValue as number) / 12) - initialFeet) * 12).toFixed(0))
		const imperialFeetValue = ref(initialFeet)
		const imperialInchesValue = ref(initialInches < 10 ? Number(`0${initialInches}`): initialInches)
		const imperialHeightInInches = ref(Number((imperialFeetValue.value * 12) + imperialInchesValue.value))

		const changeFeetValue = (value: number) => {
			if(value > 9 || value <= 0) {
				errors.push(new Error('Invalid Height'))
				displayedErrorMessage.value = errors[0].message
				imperialHeightInInches.value = 0
			} else {
				errors = []
				displayedErrorMessage.value = ''
				imperialFeetValue.value = value
				imperialHeightInInches.value = Number(imperialFeetValue.value) * 12 + Number(imperialInchesValue.value)
			}
		}
		const changeInchesValue = (value: number) => {
			if(value > 11.9 || value < 0 || !value) {
				errors.push(new Error('Invalid Height'))
				displayedErrorMessage.value = errors[0].message
				imperialHeightInInches.value = 0
			} else {
				errors = []
				displayedErrorMessage.value = ''
				imperialInchesValue.value = value
				imperialHeightInInches.value = Number(imperialFeetValue.value) * 12 + Number(imperialInchesValue.value)
			}
		}
		const changeModelValue = (value: number) => {
			emit(EmittedEvents.valueUpdated, value)
		}

		return {
			imperialFeetValue,
			imperialInchesValue,
			imperialHeightInInches,

			displayedErrorMessage,

			changeFeetValue,
			changeInchesValue,
			changeModelValue
		}
	}
})
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}
</style>
