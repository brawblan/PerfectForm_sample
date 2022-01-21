import {PhoneData, SupportedCountry} from '@/utilities/supported-country/supported-country.enum';
import {ProfileService} from '@/services/profile/profile-service/profile.service';
import {PersonalGoal} from '@/services/profile/personal-goal/personal-goal.enum';
import {
  MeasurementSystem,
  MeasurementSystemMetadata
} from '@/services/profile/measurement-system/measurement-system.enum';
import {IUpdateUserRequest} from '@/services/profile/profile-service/update/update-user/update-user-request.interface';
import {CommonValidators} from '@/utilities/validation/common-validators.class';
import axios from 'axios';
import {IUpdateUserResponse} from '@/services/profile/profile-service/update/update-account/update-account-response.interface';
import {AlertService} from '@/services/alert/alert.service'
import {SimpleAlertItem} from '@/components/ui/alerts/alert-container/simple-alert-item.class'
import {SimpleAlertType} from '@/components/ui/alerts/simple-alert/models/simple-alert-type.enum'

interface Form {
  phoneNumberCountryCode: {
    value: PhoneData
    touched: boolean
  }
  firstName: {
    value: string
    touched: boolean
  }
  lastName: {
    value: string
    touched: boolean
  }
  phoneNumber: {
    value: string
    touched: boolean
  }
  bio: {
    value: string | null
    touched: boolean
  }
  height: {
    value: number | null
    touched: boolean
  }
  weight: {
    value: number | null
    touched: boolean
  }
  dateOfBirth: {
    value: Date | undefined
    touched: boolean
  }
  measurementSystem: {
    value: MeasurementSystem | null
    touched: boolean
  }
  personalGoal: {
    value: PersonalGoal | null,
    touched: boolean
  }
}

export class UpdateUsersViewModel {
  private _form: Form = {
    phoneNumberCountryCode: {
      value: {
        flag: '',
        internationalCode: '',
        country: SupportedCountry.us,
      },
      touched: false
    },
    phoneNumber: {
      value: '',
      touched: false
    },
    firstName: {
      value: '',
      touched: false
    },
    lastName: {
      value: '',
      touched: false
    },
    bio: {
      value: null,
      touched: false
    },
    height: {
      value: null,
      touched: false
    },
    weight: {
      value: null,
      touched: false
    },
    dateOfBirth: {
      value: undefined,
      touched: false
    },
    measurementSystem: {
      value: null,
      touched: false
    },
    personalGoal: {
      value: null,
      touched: false
    }
  }

  get phoneNumberCountryCode() {
    return this._form.phoneNumberCountryCode.value
  }

  set phoneNumberCountryCode(value: PhoneData) {
    this._form.phoneNumberCountryCode.value = value
  }

  get phoneNumberCountryCodeTouched() {
    return this._form.phoneNumberCountryCode.touched
  }

  set phoneNumberCountryCodeTouched(value: boolean) {
    this._form.phoneNumberCountryCode.touched = value
  }

  get phoneNumber() {
    return this._form.phoneNumber.value
  }

  set phoneNumber(value: string) {
    this._form.phoneNumber.value = value
  }

  get phoneNumberTouched() {
    return this._form.phoneNumber.touched
  }

  set phoneNumberTouched(value: boolean) {
    this._form.phoneNumber.touched = value
  }

  get fullPhoneNumber() {
    return this.phoneNumber ? `${this.phoneNumberCountryCode.internationalCode}${this.phoneNumber}` : undefined
  }

  get firstName() {
    return this._form.firstName.value
  }

  set firstName(value: string) {
    this._form.firstName.value = value
  }

  get firstNameTouched() {
    return this._form.firstName.touched
  }

  set firstNameTouched(value: boolean) {
    this._form.firstName.touched = value
  }

  get lastName() {
    return this._form.lastName.value
  }

  set lastName(value: string) {
    this._form.lastName.value = value
  }

  get lastNameTouched() {
    return this._form.lastName.touched
  }

  set lastNameTouched(value: boolean) {
    this._form.lastName.touched = value
  }

  get bio() {
    return this._form.bio.value
  }

  set bio(value: string | null) {
    this._form.bio.value = value
  }

  get bioTouched() {
    return this._form.bio.touched
  }

  set bioTouched(value: boolean) {
    this._form.bio.touched = value
  }

  get height() {
    return this._form.height.value
  }

  set height(value: number  | null) {
    this._form.height.value = value
  }

  get heightTouched() {
    return this._form.height.touched
  }

  set heightTouched(value: boolean) {
    this._form.height.touched = value
  }

  get weight() {
    return this._form.weight.value
  }

  set weight(value: number | null) {
    this._form.weight.value = value
  }

  get weightTouched() {
    return this._form.weight.touched
  }

  set weightTouched(value: boolean) {
    this._form.weight.touched = value
  }

  get dateOfBirth() {
    return this._form.dateOfBirth.value
  }

  set dateOfBirth(value: Date | undefined) {
    this._form.dateOfBirth.value = value
  }

  get dateOfBirthTouched() {
    return this._form.dateOfBirth.touched
  }

  set dateOfBirthTouched(value: boolean) {
    this._form.dateOfBirth.touched = value
  }

  get measurementSystem() {
    return this._form.measurementSystem.value
  }

  set measurementSystem(value: MeasurementSystem | null) {
    this._form.measurementSystem.value = value
  }

  get measurementSystemTouched() {
    return this._form.measurementSystem.touched
  }

  set measurementSystemTouched(value: boolean) {
    this._form.measurementSystem.touched = value
  }

  get personalGoal() {
    return this._form.personalGoal.value
  }

  set personalGoal(value: PersonalGoal | null) {
    this._form.personalGoal.value = value
  }

  get personalGoalTouched() {
    return this._form.personalGoal.touched
  }

  set personalGoalTouched(value: boolean) {
    this._form.personalGoal.touched = value
  }

  get validationResults() {
    const request: IUpdateUserRequest = this.buildRequest()
    const { firstName, lastName, phoneNumber, height, weight, dateOfBirth, bio, measurementSystem} = request

    const results = {
      isValid: true,
      firstName: new Array<Error>(),
      lastName: new Array<Error>(),
      phoneNumber: new Array<Error>(),
      height: new Array<Error>(),
      weight: new Array<Error>(),
      dateOfBirth: new Array<Error>(),
      bio: new Array<Error>()
    }

    if(!!firstName || firstName === '') {
      results.firstName = CommonValidators.ValidateName(firstName as string)
    }
    if (!!lastName || lastName === '') {
      results.lastName = CommonValidators.ValidateName(lastName as string)
    }
    // Phone number is optional for this request
    if (!!phoneNumber || phoneNumber?.length === 0) {
      results.phoneNumber = CommonValidators.ValidatePhoneNumber(phoneNumber)
    }
    if (!!height || height === 0) {
      const convertedHeight = ProfileService.ConvertMeasurement(
        height as number,
        measurementSystem as MeasurementSystem,
        MeasurementSystemMetadata.default,
        ProfileService.ConversionFactors.height
      )
      if (convertedHeight <= 0) {
        results.height.push(ProfileService.CommonErrors.negativeMeasurement)
      }
    }
    if (weight?.toString() === '' || (weight as number <= 0)) {
      results.weight.push(ProfileService.CommonErrors.negativeMeasurement)
    }
    if (!!bio || bio === '') {
      results.bio = UpdateUsersViewModel.ValidateBio(bio as string)
    }

    let errorMembers = [
      results.firstName,
      results.lastName,
      results.phoneNumber,
      results.height,
      results.weight,
      results.dateOfBirth,
      results.bio,
    ]
    for (const member of errorMembers) {
      if (member.length > 0) {
        results.isValid = false
        break
      }
    }
    return results
  }

  static ValidateBio = (bio: string): Array<Error> => {
    const errors = new Array<Error>()
    if (!bio) {
      errors.push(CommonValidators.Errors.empty)
    }

    return errors
  }

  private buildRequest = () => {
    const payload = {}
    if (this.phoneNumberTouched) {
    Object.assign(payload, {phoneNumber: this.phoneNumber})
    }
    if (this.firstNameTouched) {
      Object.assign(payload, {firstName: this.firstName})
    }
    if (this.lastNameTouched) {
      Object.assign(payload, {lastName: this.lastName})
    }
    if (this.bioTouched) {
      Object.assign(payload, {bio: this.bio})
    }
    if (this.heightTouched) {
      Object.assign(payload, {height: this.height})
    }
    if (this.weightTouched) {
      Object.assign(payload, {weight: this.weight})
    }
    if (this.measurementSystemTouched) {
      if (this.measurementSystem === 'metric') {
        Object.assign(payload, {measurementSystem: MeasurementSystem.metric})
      } else {
        Object.assign(payload, {measurementSystem: MeasurementSystem.imperial})
      }
    }
    if (this.personalGoalTouched) {
      Object.assign(payload, {personalGoal: this.personalGoal})
    }

    return payload
  }

  submitForm = async () => {
    const request: IUpdateUserRequest = this.buildRequest()
    const endpoint = '/users/edit'
    const {firstName, lastName, phoneNumber, height, weight, personalGoal, measurementSystem, bio} = request
    const user = await ProfileService.getCurrentUser()
    let formattedPhoneNumber
    if (!!phoneNumber) {
      formattedPhoneNumber = `${phoneNumber?.slice(0,3)}-${phoneNumber?.slice(3,6)}-${phoneNumber?.slice(6,10)}`
    }
    let convertedToMeasurementSystemEnum
    let convertedHeight
    let convertedWeight
    if(!!height) {
      if (measurementSystem === 'metric') {
        convertedHeight = height
      } else {
        convertedToMeasurementSystemEnum = MeasurementSystem.imperial
        convertedHeight = ProfileService.ConvertMeasurement(
          height as number,
          convertedToMeasurementSystemEnum,
          MeasurementSystemMetadata.default,
          ProfileService.ConversionFactors.height
        )
      }
    }
    if(!!weight) {
      if (measurementSystem === 'metric') {
        convertedWeight = weight
      } else {
        convertedToMeasurementSystemEnum = MeasurementSystem.imperial
        convertedWeight = ProfileService.ConvertMeasurement(
          weight as number,
          convertedToMeasurementSystemEnum,
          MeasurementSystemMetadata.default,
          ProfileService.ConversionFactors.weight
        )
      }
    }

    const payload = {
      user: {
        id: user.user.id,
        phone: formattedPhoneNumber,
        first_name: firstName,
        last_name: lastName,
        bio: bio?.length ? {
          en: bio,
          id: user.user.bio?.id
        } : undefined,
        height_cm: convertedHeight,
        weight_kg: convertedWeight,
        measurement_type: measurementSystem,
        personal_goal: personalGoal
      }
    }

    try {
      const response = await axios.post(endpoint, JSON.parse(JSON.stringify(payload))) as IUpdateUserResponse
      return response
      //  TODO: send success message
    } catch (error) {
      console.error(error)
      AlertService.ShowSimpleAlert(new SimpleAlertItem(error.message ?? error, SimpleAlertType.error, 'Error'))
      throw new Error(error?.response?.data?.errors?.detail
        ?? error?.message
        ?? ProfileService.CommonErrors.unknown
      )
    }
  }

}
