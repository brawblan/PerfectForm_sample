import {ProfileService} from '@/services/profile/profile-service/profile.service';
import {IUpdateAccountRequest} from '@/services/profile/profile-service/update/update-account/update-account-request.interface';
import {AuthService} from '@/services/auth/auth-service/auth.service';
import axios from 'axios';
import {CommonValidators} from '@/utilities/validation/common-validators.class';

interface Form {
  email: {
    value: string
    touched: boolean
  }
  password: {
    value: string
    touched: boolean
  }
}

export class UpdateAccountViewModel {
  private _form: Form = {
    email: {
      value: '',
      touched: false
    },
    password: {
      value: '',
      touched: false
    }
  }

  get email() {
    return this._form.email.value
  }

  set email(value: string) {
    this._form.email.value = value
  }

  get emailTouched() {
    return this._form.email.touched
  }

  set emailTouched(value: boolean) {
    this._form.email.touched = value
  }

  get password() {
    return this._form.password.value
  }

  set password(value: string) {
    this._form.password.value = value
  }

  get passwordTouched() {
    return this._form.password.touched
  }

  set passwordTouched(value: boolean) {
    this._form.password.touched = value
  }

  get validationResults() {
    const request: IUpdateAccountRequest = this.buildRequest()
    const {username, password} = request
    const results = {
      isValid: true,
      username: new Array<Error>(),
      password: new Array<Error | null>()
    }

    if (!!username || (username?.length === 0 && this.emailTouched)) {
      results.username = CommonValidators.ValidateEmail(username)
    }
    if (!!password) {
      results.password = ProfileService.ValidatePassword(password)
    }

    let errorMembers = [
      results.username,
      results.password
    ]

    for (const member of errorMembers) {
      if (member.length > 0) {
        results.isValid = false
        break
      }
    }

    return results
  }

  private buildRequest = () => {
    return {
      username: this.emailTouched ? this.email : '',
      password: this.password,
    }
  }

  submitForm = async () => {
    const request: IUpdateAccountRequest = this.buildRequest()
    let {username, password} = request
    const endpoint = '/accounts/edit'
    const id = AuthService.Instance.authInfo?.id
    let hashedPassword = null
    if(password !== undefined) {
      hashedPassword = AuthService.HashPassword(password)
    }

    const payload = {
      account: {
        id: id,
        email: username?.length ? username : undefined,
        hashed_password: hashedPassword?.length ? hashedPassword : undefined
      }
    }

    try {
      const response = await axios.post(endpoint, JSON.parse(JSON.stringify(payload)))
      return response
      //  TODO: add a success message?
    } catch (error) {
      throw new Error(error?.response?.data?.errors?.detail
        ?? error?.message
        ?? ProfileService.CommonErrors.unknown
      )
    }
  }
}
