<template>
  <!-- Top Bar -->
  <NavigationHeader />
	<div class="w-full pt-20 pb-0 px-4 flex flex-col">
		<div class="max-w-md w-full self-center">
			<form
				v-if="isAuthenticated"
				class="flex flex-col w-full mb-10"
			>
				<!-- Profile Picture -->
				<div class="space-y-5 my-6">
					<div class="flex justify-center w-full">
						<div class="flex items-center flex-shrink-0 relative">
							<img
								v-if="currentImage"
								:src="currentImage"
								alt="profile picture"
								class="w-28 h-28 bg-gray-100 rounded-full object-cover"
							/>
							<ProfileImageSkeleton v-else />
							<label
								v-show="isEditing"
								:for="'upload-photo'"
								class="mt-2 absolute bottom-0 right-0"
							>
								<img
									v-if="isEditing"
									:src="icons.cameraIcon"
									alt="edit"
									class="w-8 h-8 px-0.5 pb-0.5 pt-1 bg-white shadow-md rounded-full"
								/>
							</label>
							<input
								v-show="isEditing"
								@change="onImageSelected"
								class="z-0 absolute opacity-0"
								type="file"
								name="photo"
								id="upload-photo"
							>
						</div>
					</div>
				</div>

				<!-- About Me Data -->
				<div class="flex justify-between items-end mb-6">
					<h2 class="text-xl font-bold self-end leading-3">
						{{localizationText.aboutMeHeader}}
					</h2>
					<!-- Edit Button -->
					<AsyncButton
						v-if="!isEditing"
						id="edit"
						:is-loading="submitting"
						:bg-color-class="'bg-gradient-to-r from-primary-400 to-accent-400'"
						@click="editToggle"
					>
						{{localizationText.editButton}}
					</AsyncButton>
					<!-- Save Button -->
					<AsyncButton
						v-else
						id="save"
						:is-loading="submitting"
						:form-has-errors="formHasErrors"
						:bg-color-class="'bg-gradient-to-r from-primary-400 to-accent-400'"
						@click="onSaveClicked"
					>
						{{localizationText.saveButton}}
					</AsyncButton>
				</div>

				<div class="flex space-x-3 justify-between">
					<!-- First Name-->
					<BaseTextInput
						type="text"
						class="mt-2 w-full"
						:label="localizationText.firstNameLabel"
						v-model="userViewModel.firstName"
						@update:modelValue="onFirstNameUpdated"
						:displayed-error-message="displayedErrors.firstName"
						:disabled="!isEditing"
					/>

					<!-- Last Name-->
					<BaseTextInput
						type="text"
						class="mt-2 w-full"
						:label="localizationText.lastNameLabel"
						v-model="userViewModel.lastName"
						@update:modelValue="onLastNameUpdated"
						:displayed-error-message="displayedErrors.lastName"
						:disabled="!isEditing"
					/>
				</div>

				<!-- Email Input-->
				<BaseTextInput
					type="email"
					class="mt-2"
					:label="localizationText.emailLabel"
					v-model="accountViewModel.email"
					@update:modelValue="onEmailUpdated"
					:displayed-error-message="displayedErrors.email"
					:disabled="!isEditing"
				/>

				<!-- phone input -->
				<div class="mt-2 flex flex-row space-x-3">
					<!-- Phone Country Code Input-->
					<CountryCodeSelector
						v-model="userViewModel.phoneNumberCountryCode"
						:disabled="!isEditing"
					/>

					<!-- Phone Number Input-->
					<BaseTextInput
						type="tel"
						class="flex-2"
						:label="localizationText.phoneNumberLabel"
						v-model="userViewModel.phoneNumber"
						@update:modelValue="onPhoneNumberUpdated"
						:displayed-error-message="displayedErrors.phone"
						:disabled="!isEditing"
					/>
				</div>

				<!-- Password Input-->
				<BaseTextInput
					type="password"
					class="mt-2"
					:label="localizationText.passwordLabel"
					v-model="accountViewModel.password"
					@update:modelValue="onPasswordUpdated"
					:displayed-error-message="displayedErrors.password"
					:disabled="!isEditing"
				/>

				<!-- Personal Data -->
				<div class="flex align-left items-center my-6 leading-3">
					<h2 class="text-xl font-bold">
						{{localizationText.personalDataHeader}}
					</h2>
				</div>

				<!-- Personal Goal/Measurement System -->
				<div class="flex w-min mb-2">
					<!-- Pick Measurement System -->
					<MeasurementSystemRadioButtons
						classz
						:label="localizationText.measurementTypeLabel"
						:items="measurementTypeOptions"
						v-model="userMeasurementSystem"
						@update:modelValue="onMeasurementTypeSelected($event, userViewModel.height, userViewModel.weight)"
						:disabled="!isEditing"
					/>
				</div>

				<!-- Height and Weight -->
				<div class="flex w-1/2">
				<!-- Height Metric & Imperial Inputs -->
					<BaseTextInput
						v-if="userMeasurementSystem.label === 'Metric'"
						type="number"
						class="mt-2"
						style="min-width: 5rem; width: 5rem"
						trailing-text="cm"
						:label="localizationText.heightLabel"
						v-model.number="displayHeight"
						@update:modelValue="onHeightUpdated"
						:displayed-error-message="displayedErrors.height"
						:disabled="!isEditing"
					/>
					<ImperialHeightInputs
						v-else
						class="mt-2 flex-2"
						style="min-width: 6rem; max-width: 6rem"
						:label="localizationText.heightLabel"
						v-model.number="displayHeight"
						@update:modelValue="onHeightUpdated"
						:displayed-error-message="displayedErrors.height"
						:disabled="!isEditing"
					/>

					<BaseTextInput
						type="number"
						class="mt-2 ml-3"
						style="min-width: 5rem; width: 5rem"
						:trailing-text="userMeasurementSystem.label === 'Metric' ? 'kg' : 'lbs'"
						:label="localizationText.weightLabel"
						v-model.number="displayWeight"
						@update:modelValue="onWeightUpdated"
						:displayed-error-message="displayedErrors.weight"
						:disabled="!isEditing"
					/>
				</div>

				<!-- Update Bio -->
				<Textarea
					class="mb-8"
					:label="localizationText.bioLabel"
					v-model="userViewModel.bio"
					@update:modelValue="onBioUpdated"
					:displayed-error-message="displayedErrors.bio"
					:disabled="!isEditing"
				/>
			</form>

			<div
          v-else
          class="my-16"
      >
				<h2>Sign In and Explore Your Potential</h2>
			</div>

			<div class="flex flex-col flex-auto md:max-h-64 justify-end mx-6">
				<button
					type="button"
					:class="[isAuthenticated ? 'bg-red-500 hover:bg-red-400' : 'bg-primary-400 hover:bg-primary-300', 'transition-color duration-200 max-w-sm mx-auto w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-white text-base font-medium focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm mx-6']"
					@click="isAuthenticated ? onSignOutClicked() : onSignInClicked()"
				>
					{{ isAuthenticated ? localizationText.signOutButton : localizationText.signInButton }}
				</button>
			</div>
			<div class="flex flex-col flex-auto w-full flex-grow justify-end mt-12">
				<p class="text-xs text-right font-light">
					App v{{ appVersion }}
				</p>
			</div>

		</div>
	</div>

</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {PersonalGoalGetAllOptions, PersonalGoalMetadata} from '@/services/profile/personal-goal/personal-goal.enum';
import ProfileImageSkeleton from '@/components/ui/loading-skeletons/profile-image-skeleton.vue';
import NavigationHeader from '@/components/ui/navigation-header/navigation-header.vue';
import CountryCodeSelector from '@/components/forms/inputs/selectors/country-code-selector/country-code-selector.vue'
import BaseTextInput from '@/components/forms/inputs/text/base-text-input/base-text-input.vue'
import Textarea from '@/components/forms/inputs/text/textarea/textarea.vue'
import SimpleNativeSelect from '@/components/forms/inputs/selectors/simple-native-select/simple-native-select.vue';
import MeasurementSystemRadioButtons
	from '@/views/account-screen/measurement-system-radio-buttons/measurement-system-radio-buttons.vue';
import AsyncButton from '@/components/ui/async-button/async-button.vue'
import {ISimpleNativeSelectItem} from '@/components/forms/inputs/selectors/simple-native-select/simple-native-select-item.interface';
import {AppNavbarSettings} from '@/components/ui/app-navbar/app-navbar-settings';
import {IconService} from '@/services/icon/icon.service';
import {Icon} from '@/services/icon/icon.enum';
import {UserService} from '@/services/user/user.service';
import {AuthService} from '@/services/auth/auth-service/auth.service';
import {ProfileService} from '@/services/profile/profile-service/profile.service';
import {NavigationRoute} from '@/router/navigation-route.enum';
import {NavigationHeaderService} from '@/components/ui/navigation-header/navigation-header.service';
import {INavigationHeaderSettings} from '@/components/ui/navigation-header/navigation-header-settings.class';
import {NavigationHeaderType} from '@/components/ui/navigation-header/navigation-header-type.enum';
import {UpdateUsersViewModel} from '@/views/account-screen/update-users.view-model';
import {UpdateAccountViewModel} from '@/views/account-screen/update-account.view-model';
import {SupportedLanguage} from '@/utilities/supported-language/supported-language.enum';
import {
	MeasurementSystem,
	MeasurementSystemMetadata
} from '@/services/profile/measurement-system/measurement-system.enum';
import ImperialHeightInputs from '@/views/account-screen/imperial-height-inputs/imperial-height-inputs.vue';
import {AlertService} from '@/services/alert/alert.service'
import {SimpleAlertItem} from '@/components/ui/alerts/alert-container/simple-alert-item.class'
import {SimpleAlertType} from '@/components/ui/alerts/simple-alert/models/simple-alert-type.enum'

export default defineComponent({
	name: 'AccountScreen',
	components: {
		ImperialHeightInputs,
		MeasurementSystemRadioButtons,
		ProfileImageSkeleton,
		AsyncButton,
		SimpleNativeSelect,
		NavigationHeader,
		BaseTextInput,
		Textarea,
		CountryCodeSelector
	},
	setup() {
		AppNavbarSettings.isVisible.value = true
		AppNavbarSettings.activeNavItem.value = AppNavbarSettings.getNavigationItems().account
		NavigationHeaderService.instance.updateSettings({type: NavigationHeaderType.base})

		const router = useRouter()
		const appVersion = process.env.VUE_APP_VERSION
		const isAuthenticated = ref(AuthService.Instance.isAuthenticated)
		const localizationText = buildLocalizationText()

		const accountViewModel = reactive(new UpdateAccountViewModel())
		const userViewModel = reactive(new UpdateUsersViewModel())
		const icons = {
			notificationIcon: IconService.getIcon(Icon.notification),
			accountIcon: IconService.getIcon(Icon.accountGradient),
			cameraIcon: IconService.getIcon(Icon.camera)
		}
		const submitting = ref(false)
		const submittingPicture = ref(false)
		const isEditing = ref(false)
		const changingProfilePicture = ref(false)
		const formHasErrors = ref(false)
		const newProfileImage = ref()
		const userId = ref('')
		const displayHeight = ref<number>(0)
		const displayWeight = ref<number>(0)
		const dbHeightCm = ref<number>(0)
		const dbHeightIn = ref<number>(0)
		const dbWeightKg = ref<number>(0)
		const dbWeightLbs = ref<number>(0)

		// Define Input Initial Values
		const currentImage = ref('')
		const username = ref(AuthService.Instance.authInfo?.email ?? '')
		const userMeasurementSystem = ref<ISimpleNativeSelectItem>({label: 'Metric', value: MeasurementSystem.metric})
		const measurementSystemOptions: Array<ISimpleNativeSelectItem> = [{label: 'Metric', value: MeasurementSystem.metric}, {label: 'Imperial', value: MeasurementSystem.imperial}]
		const personalGoal = ref<Array<string>>([PersonalGoalMetadata.default])

		// Set Placeholders for Inputs
		const currentUser = async () => {
			const getUser = await ProfileService.getCurrentUser()
			const user = UserService.FromDto(getUser.user)
			userId.value = user.id

			userViewModel.firstName = user.firstName ?? 'First Name'
			userViewModel.lastName = user.lastName ?? 'Last Name'
			userViewModel.bio = user.bio?.en ?? ''
			userViewModel.phoneNumber = user.phone?.replace(/\D/g, '') ?? 'Phone Number'
			personalGoal.value = user.personal_goal ?? [PersonalGoalMetadata.default]
			accountViewModel.email = getUser.email

			if (user.images) {
				const lastIndex = user.images.length - 1
				currentImage.value = user.images[lastIndex]?.url ?? icons.accountIcon
			}

			userMeasurementSystem.value.label = user.measurement_type?.split('').slice(49).join('') ?? ''
			userMeasurementSystem.value.value = user.measurement_type?.split('').slice(49).join('').toLowerCase()
			if (userMeasurementSystem.value.value === 'metric') {
				userViewModel.measurementSystem = MeasurementSystem.metric
			} else  {
				userViewModel.measurementSystem = MeasurementSystem.imperial
			}

			// Height/Weight that will remain unrounded
			dbHeightCm.value = user.height_cm ?? 0
			dbHeightIn.value = ProfileService.ConvertMeasurement(
				dbHeightCm.value,
				MeasurementSystem.metric as MeasurementSystem,
				MeasurementSystem.imperial as MeasurementSystem,
				ProfileService.ConversionFactors.height
			)
			dbWeightKg.value = user.weight_kg ?? 0
			dbWeightLbs.value = ProfileService.ConvertMeasurement(
				dbWeightKg.value,
				MeasurementSystem.metric as MeasurementSystem,
				MeasurementSystem.imperial as MeasurementSystem,
				ProfileService.ConversionFactors.weight
			)

			// Height/Weight initial rounding for display
			roundHeightForDisplay(dbHeightCm.value)
			roundWeightForDisplay(dbWeightKg.value)
		}
		// currentUser()
		onMounted(() => {
			console.log('mounted')
			currentUser()
		})

		// Keep unaltered input for Height and Weight
		const setHeightMeasurements = (heightInCm: number) => {
			dbHeightCm.value = heightInCm
			dbHeightIn.value = ProfileService.ConvertMeasurement(
				heightInCm,
				MeasurementSystem.metric as MeasurementSystem,
				MeasurementSystem.imperial as MeasurementSystem,
				ProfileService.ConversionFactors.height
			)
		}
		const setWeightMeasurements = (weightInKg: number) => {
			dbWeightKg.value = weightInKg
			dbWeightLbs.value = ProfileService.ConvertMeasurement(
				weightInKg,
				MeasurementSystem.metric as MeasurementSystem,
				MeasurementSystem.imperial as MeasurementSystem,
				ProfileService.ConversionFactors.weight
			)
		}

		// Rounds Height/Weight for display only
		const roundHeightForDisplay = (height: number) => {
			displayHeight.value = userViewModel.measurementSystem === MeasurementSystem.imperial ?
				Math.round(ProfileService.ConvertMeasurement(
					height as number,
					MeasurementSystemMetadata.default,
					userViewModel.measurementSystem,
					ProfileService.ConversionFactors.height
				)) : Math.round(height)
		}
		const roundWeightForDisplay = (weight: number) => {
			displayWeight.value = userViewModel.measurementSystem === MeasurementSystem.imperial ?
				Math.round(ProfileService.ConvertMeasurement(
					weight as number,
					MeasurementSystemMetadata.default,
					userViewModel.measurementSystem,
					ProfileService.ConversionFactors.weight
				)) : Math.round(weight)
		}

		// Personal Goal selector
		const getPersonalGoalOptions = PersonalGoalGetAllOptions()
		const selectedPersonalGoal = ref<ISimpleNativeSelectItem>(getPersonalGoalOptions[0])
		const personalGoalOptions = ref<Array<ISimpleNativeSelectItem>>(getPersonalGoalOptions)
		const onPersonalGoalSelected = (personalGoal: ISimpleNativeSelectItem) => {
			selectedPersonalGoal.value = personalGoal
			userViewModel.personalGoalTouched = true
			userViewModel.personalGoal = personalGoal.value
		}

		// Measurement Type selector
		const selectedMeasurementType = ref<ISimpleNativeSelectItem>(userMeasurementSystem.value)
		const measurementTypeOptions = ref<Array<ISimpleNativeSelectItem>>(measurementSystemOptions)
		const onMeasurementTypeSelected = (measurementType: ISimpleNativeSelectItem) => {
			if (selectedMeasurementType.value.value === measurementType.value) {
				return
			}
			userViewModel.measurementSystemTouched = true
			selectedMeasurementType.value = measurementType
			userMeasurementSystem.value = measurementType
			userViewModel.measurementSystem = measurementType.value as MeasurementSystem

			if (measurementType.value === 'metric') {
				displayHeight.value = Math.round(dbHeightCm.value)
				userViewModel.height = dbHeightCm.value
				displayWeight.value = Math.round(dbWeightKg.value)
				userViewModel.weight = dbWeightKg.value
			} else {
				displayHeight.value = Math.round(dbHeightIn.value)
				userViewModel.height = dbHeightIn.value
				displayWeight.value = Math.round(dbWeightLbs.value)
				userViewModel.weight = dbWeightLbs.value

			}
		}

		// Getters
		const displayedErrors = reactive({
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			phone: '',
			height: '',
			weight: '',
			bio: ''
		})

		//Methods
		// Inputs Updated and Error Handling
		const onFirstNameUpdated = () => {
			userViewModel.firstNameTouched = true
			updateFirstNameError()
			checkFormHasErrors()
		}
		const updateFirstNameError = () => {
			const results = userViewModel.validationResults.firstName
			const message = results[0] && userViewModel.firstNameTouched ? results[0].message : ''
			displayedErrors.firstName = message
		}
		const onLastNameUpdated = () => {
			userViewModel.lastNameTouched = true
			updateLastNameError()
			checkFormHasErrors()
		}
		const updateLastNameError = () => {
			const results = userViewModel.validationResults.lastName
			const message = results[0] && userViewModel.lastNameTouched ? results[0].message : ''
			displayedErrors.lastName = message
		}
		const onEmailUpdated = () => {
			accountViewModel.emailTouched = true
			updateEmailError()
			checkFormHasErrors()
		}
		const updateEmailError = () => {
			const results = accountViewModel.validationResults.username
			const message = results[0] && accountViewModel.emailTouched ? results[0].message : ''
			displayedErrors.email = message
		}
		const onCountryCodeUpdated = () => {
			userViewModel.phoneNumberCountryCodeTouched = true
		}
		const onPhoneNumberUpdated = () => {
			userViewModel.phoneNumberTouched = true
			updatePhoneError()
			checkFormHasErrors()
		}
		const updatePhoneError = () => {
			const results = userViewModel.validationResults.phoneNumber
			const message = results[0] && userViewModel.phoneNumberTouched ? results[0].message : ''
			displayedErrors.phone = message
		}
		const onPasswordUpdated = () => {
			accountViewModel.passwordTouched = true
			updatePasswordError()
			checkFormHasErrors()
		}
		const updatePasswordError = () => {
			const results = accountViewModel.validationResults.password
			const message = results[0] && accountViewModel.passwordTouched ? results[0].message : ''
			displayedErrors.password = message
		}
		const onBioUpdated = () => {
			userViewModel.bio = userViewModel.bio ?? ''
			userViewModel.bioTouched = true
			const results = userViewModel.validationResults.bio
			const message = results[0] && userViewModel.bioTouched ? results[0].message : ''
			displayedErrors.bio = message
		}
		const onHeightUpdated = () => {
			userViewModel.height = displayHeight.value
			userViewModel.heightTouched = true
			if (userViewModel.measurementSystem === MeasurementSystem.metric) {
				dbHeightCm.value = displayHeight.value
				dbHeightIn.value = ProfileService.ConvertMeasurement(
					displayHeight.value as number,
					MeasurementSystem.metric,
					MeasurementSystem.imperial,
					ProfileService.ConversionFactors.height
				)
			} else {
				dbHeightCm.value = ProfileService.ConvertMeasurement(
					displayHeight.value as number,
					MeasurementSystem.imperial,
					MeasurementSystem.metric,
					ProfileService.ConversionFactors.height
				)
				dbHeightIn.value = displayHeight.value
			}
			setHeightMeasurements(dbHeightCm.value)
			updateHeightError()
			checkFormHasErrors()
		}
		const updateHeightError = () => {
			const results = userViewModel.validationResults.height
			const message = results[0] && userViewModel.heightTouched ? results[0].message : ''
			displayedErrors.height = message
		}
		const onWeightUpdated = () => {
			userViewModel.weight = displayWeight.value
			userViewModel.weightTouched = true
			if (userViewModel.measurementSystem === MeasurementSystem.metric) {
				dbWeightKg.value = displayWeight.value
				dbWeightLbs.value = ProfileService.ConvertMeasurement(
					displayWeight.value as number,
					MeasurementSystem.metric,
					MeasurementSystem.imperial,
					ProfileService.ConversionFactors.weight
				)
			} else {
				dbWeightKg.value = ProfileService.ConvertMeasurement(
					displayWeight.value as number,
					MeasurementSystem.imperial,
					MeasurementSystem.metric,
					ProfileService.ConversionFactors.weight
				)
				dbWeightLbs.value = displayWeight.value
			}
			setWeightMeasurements(dbWeightKg.value)
			updateWeightError()
			checkFormHasErrors()
		}
		const updateWeightError = () => {
			const results = userViewModel.validationResults.weight
			const message = results[0] && userViewModel.weightTouched ? results[0].message : ''
			displayedErrors.weight = message
		}
		const checkFormHasErrors = () => {
			formHasErrors.value = !(accountViewModel.validationResults.isValid && userViewModel.validationResults.isValid)
		}
		checkFormHasErrors()

		// Editing/Save Methods
		const editToggle = () => {
			isEditing.value = !isEditing.value
		}
		const onImageSelected = ({target: {files}}: any) => {
			const file = files[0]
			newProfileImage.value = file
			currentImage.value = URL.createObjectURL(file)
		}
		const onSaveClicked = async () => {
			checkFormHasErrors()
			if(formHasErrors.value) {
				return
			}

			submitting.value = true
			try {
				if (newProfileImage.value) {
					await ProfileService.UploadUserImage({user_id: userId.value, image: newProfileImage.value})
				}
				await accountViewModel.submitForm()
				await userViewModel.submitForm()
				submitting.value = false
				isEditing.value = false
				await currentUser()
			} catch (error) {
				submitting.value = false
				isEditing.value = false
				console.error(error)
        AlertService.ShowSimpleAlert(new SimpleAlertItem(error.message ?? error, SimpleAlertType.error, 'Could not save'))
			}
		}

		// Sign In/Out
		const onSignInClicked = () => {
			router.push({path: NavigationRoute.signIn, query: {showNavigation: 'true'}})
		}
		const onSignOutClicked = async () => {
			try {
				await AuthService.Instance.signOut()
			} catch (err) {
				console.error(err)
        AlertService.ShowSimpleAlert(new SimpleAlertItem(err.message ?? err, SimpleAlertType.error, 'Could not sign out'))
			} finally {
				await router.push(NavigationRoute.home)
			}
		}

		return {
			userViewModel,
			accountViewModel,
			isAuthenticated,
			localizationText,
			appVersion,
			isEditing,
			changingProfilePicture,
			submitting,
			submittingPicture,
			icons,

			displayedErrors,
			formHasErrors,

			username,
			currentImage,
			newProfileImage,
			displayHeight,
			displayWeight,

			selectedPersonalGoal,
			personalGoalOptions,
			selectedMeasurementType,
			userMeasurementSystem,
			measurementTypeOptions,

			editToggle,
			onFirstNameUpdated,
			onLastNameUpdated,
			onEmailUpdated,
			onCountryCodeUpdated,
			onPhoneNumberUpdated,
			onPasswordUpdated,
			onPersonalGoalSelected,
			onMeasurementTypeSelected,
			onBioUpdated,
			onHeightUpdated,
			onWeightUpdated,
			onImageSelected,
			onSaveClicked,
			onSignInClicked,
			onSignOutClicked
		}
	},
})

interface LocalizationText {
	firstNameLabel: string
	lastNameLabel: string
	emailLabel: string
	phoneNumberLabel: string
	passwordLabel: string
	heightLabel: string
	weightLabel: string
	measurementTypeLabel: string
	personalGoalLabel: string
	bioLabel: string
	feetInchesDisplay: string

	aboutMeHeader: string
	personalDataHeader: string

	saveButton: string
	editButton: string
	signInButton: string
	signOutButton: string
}

const buildLocalizationText = (): LocalizationText => {
	const language = SupportedLanguage.enUS
	switch (language) {
		case SupportedLanguage.enUS:
			return {
				firstNameLabel: 'First Name',
				lastNameLabel: 'Last Name',
				emailLabel: 'Username',
				phoneNumberLabel: 'Phone Number',
				passwordLabel: 'Password',
				heightLabel: 'Height',
				weightLabel: 'Weight',
				measurementTypeLabel: 'Measurement System',
				personalGoalLabel: 'Personal Goal',
				bioLabel: 'Bio',
				feetInchesDisplay: `ft' in"`,

				aboutMeHeader: 'About Me',
				personalDataHeader: 'Personal Data',

				saveButton: 'Save',
				editButton: 'Edit',
				signInButton: 'Sign In',
				signOutButton: 'Sign Out'
			}
	}
}
</script>

<style scoped>
	/* Chrome, Safari, Edge, Opera */
.hideNumberArrow input::-webkit-outer-spin-button,
.hideNumberArrow input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
.hideNumberArrow input[type=number] {
	-moz-appearance: textfield;
}
</style>
