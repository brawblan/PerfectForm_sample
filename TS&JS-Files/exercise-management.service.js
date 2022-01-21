import {CommonValidators} from '@/services/helpers/validators/common-validators.class';
import axios from 'axios'

export class ExerciseManagementService {
  static GetExercisesByCurrentAccount = async (pageNumber) => {
    const endpoint = '/exercises'
    const payload = {
      page: {
        page: pageNumber,
        page_size: 16
      }
    }

    try {
      const response = (await axios.post(endpoint, payload)).data
      return response
    } catch (error) {
      console.error(error)
    }
  }
  
  static ValidateCreateExerciseRequest = (request) => {
    const results = {
      isValid: true,
      title: [],
      description: []
    }
    const { title, description } = request
    results.title = CommonValidators.ValidateTextField(title)
    results.description = CommonValidators.ValidateTextField(description)

    results.isValid =
      results.title.length === 0 &&
      results.description.length === 0 
    return results
  }

  static SubmitNewExercise = async (request) => {
    const {title, description, equipment, entryType} = request
    const endpoint = '/exercises/create'

    const payload = {
      exercise: {
        description: {
          en: description
        },
        equipment: equipment,
        name: {
          en: title
        },
        entry_types: entryType
      }
    }

    try {
      const response = (await axios.post(endpoint, payload)).data
      return response
    } catch (error) {
      console.error(error)
    }
  }

  static EditExercise = async (request) => {
    const {title, description, equipment, entryTypes, id} = request
    const endpoint = '/exercises/edit'

    const payload = {
      exercise: {
        id,
        description: description,
        equipment: equipment,
        name: title,
        entry_types: entryTypes
      }
    }
    console.log(payload)

    try {
      const response = (await axios.post(endpoint, payload)).data
      return response
    } catch (error) {
      console.error(error)
    }
  }
}

