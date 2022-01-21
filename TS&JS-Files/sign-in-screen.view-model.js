import { AuthService } from '@/services/auth/auth-service/auth.service';
import { ValidateSignInRequest } from '@/services/auth/auth-service/sign-in/sign-in-request.interface';

export class SignInScreenViewModel {
  _form = {
    username: {
      value: '',
      touched: false
    },
    password: {
      value: '',
      touched: false
    }
  };

  get username() {
    return this._form.username.value;
  }

  set username(value) {
    this._form.username.value = value;
  }

  get usernameTouched() {
    return this._form.username.touched;
  }

  set usernameTouched(value) {
    this._form.username.touched = value;
  }

  get password() {
    return this._form.password.value;
  }

  set password(value) {
    this._form.password.value = value;
  }

  get passwordTouched() {
    return this._form.password.touched;
  }

  set passwordTouched(value) {
    this._form.password.touched = value;
  }

  get validationResults() {
    return ValidateSignInRequest(this.buildRequestFromForm());
  }

  submitForm = async () => {
    return await AuthService.Instance.signIn(this.buildRequestFromForm());
  };

  buildRequestFromForm = () => {
    const { username, password } = this._form;
    return {
      username: username.value,
      password: password.value
    };
  };
}
