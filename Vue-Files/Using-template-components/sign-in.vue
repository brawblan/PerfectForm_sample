<template>
  <div>
    <div class="container sm:px-10">
      <div class="block">
        <!-- BEGIN: Sign In Form -->
        <div class="h-screen flex py-5 my-10">
          <div
            class="my-auto mx-auto bg-white dark:bg-dark-1 px-5 sm:px-8 py-8 rounded-md shadow-md w-full sm:w-3/4 lg:w-2/4"
          >
            <h2
              class="intro-x font-bold text-2xl xl:text-3xl text-center "
            >
              Sign In
            </h2>
            <div class="intro-x mt-8">
              <p class="text-primary-3 text-xs text-left mb-2 ml-2">
                {{ displayedErrors.failedLogin.length ? displayedErrors.failedLogin : ' ' }}
              </p>
              <input
                type="text"
                v-model="viewModel.username"
                @change="onUsernameUpdated"
                class="intro-x login__input form-control py-3 px-4 border-gray-300 block"
                placeholder="Email"
              />
              <p class="text-primary-3 text-xs text-left ml-2">
                {{ displayedErrors.username.length ? displayedErrors.username : ' ' }}
              </p>
              <input
                type="password"
                v-model="viewModel.password"
                @change="onPasswordUpdated"
                class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-2"
                placeholder="Password"
              />
              <p class="text-primary-3 text-xs text-left ml-2">
                {{ displayedErrors.password.length ? displayedErrors.password : ' ' }}
              </p>
            </div>
            <div
              class="intro-x w-max hover:cursor-pointer text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4"
              @click="onForgotPasswordClicked"
            >
              Forgot Password?
            </div>
            <div class="intro-x mt-5 text-center">
              <AsyncButton
                id="save"
                :is-loading="submitting"
                :form-has-errors="formHasErrors"
                @click="onSignInClicked"
              >
                Sign In
              </AsyncButton>
              <button
                class="btn btn-outline-secondary py-3 px-4 w-full mt-3 align-top"
                @click="clickSignUp"
              >
                Create Account
              </button>
            </div>
            <div
              class="intro-x mt-10 text-gray-700 dark:text-gray-600 text-center"
            >
              By signing in, you agree to our <br/>
              <a class="text-theme-1 dark:text-theme-10" href=""
              >Terms and Conditions</a
              >
              &
              <a class="text-theme-1 dark:text-theme-10" href=""
              >Privacy Policy</a
              >
            </div>
          </div>
        </div>
        <!-- END: Sign In Form -->
      </div>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import cash from 'cash-dom/dist/cash'
import AsyncButton from '@/components/async-button/async-button'
import {SignInScreenViewModel} from '@/views/sign-in/sign-in-screen.view-model'
import {NavigationRouteEnum} from '@/router/navigation-route-enum'
import {AccountType} from '@/services/helpers/account-type.enum'

class LoginAccountErrors {
	static unauthorized = 'You are not authorized to login to the Admin Panel'
	static incorrectInfo = 'Username and/or Password Incorrect'
}

export default defineComponent({
	components: {
		AsyncButton,
	},
	setup() {
		const router = useRouter()
		let viewModel = reactive(new SignInScreenViewModel())
		const navigationRoute = NavigationRouteEnum

		let displayedErrors = reactive({
			username: [],
			password: [],
			failedLogin: ''
		})
		const formHasErrors = ref(true)
		const submitting = ref(false)

		const onUsernameUpdated = () => {
			viewModel.usernameTouched = true
			updateUsernameError()
			checkFormHasErrors()
		}
		const updateUsernameError = () => {
			const results = viewModel.validationResults.username
			const message = results[0] && viewModel.usernameTouched ? results[0].message : ''
			displayedErrors.username = message
		}
		const onPasswordUpdated = () => {
			viewModel.passwordTouched = true
			updatePasswordError()
			checkFormHasErrors()
		}
		const updatePasswordError = () => {
			const results = viewModel.validationResults.password
			const message = results[0] && viewModel.passwordTouched ? results[0].message : ''
			displayedErrors.password = message
		}
		const checkFormHasErrors = () => {
			formHasErrors.value = !viewModel.validationResults.isValid
		}

		const onSignInClicked = async () => {
			if (formHasErrors.value) {
				return
			}
			submitting.value = true
			try {
				let login = await viewModel.submitForm()
				const loginAccountType = login.type.slice(51, login.type.length).toLowerCase()
				if (loginAccountType === AccountType.coach || loginAccountType === AccountType.admin) {
					submitting.value = false
					await onAuthInfoUpdated()
				} else {
					submitting.value = false
					displayedErrors.failedLogin = LoginAccountErrors.unauthorized
					formHasErrors.value = true
				}
			} catch (err) {
				formHasErrors.value = true
				submitting.value = false
				displayedErrors.failedLogin = LoginAccountErrors.incorrectInfo
				console.error(err)
			}
		}
		const onAuthInfoUpdated = () => {
			router.push(NavigationRouteEnum.home)
		}
		const clickSignUp = () => {
			router.push(NavigationRouteEnum.createAccount)
		}
    const onForgotPasswordClicked = () => {
      router.push(NavigationRouteEnum.requestPasswordReset)
    }

		onMounted(() => {
			cash('body')
				.removeClass('main')
				.removeClass('error-page')
				.addClass('login')
		})

		return {
			viewModel,
			navigationRoute,

			formHasErrors,
			submitting,
			displayedErrors,

			onUsernameUpdated,
			onPasswordUpdated,
			onSignInClicked,
			clickSignUp,
      onForgotPasswordClicked
		}
	}
})
</script>
