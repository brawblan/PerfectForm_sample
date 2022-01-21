import {ExerciseManagementService} from '@/services/content-management/exercise-management/exercise-management.service';

export class CreateExerciseViewModel {
  _form = {
    title: {
      value: '',
      touched: false
    },
    description: {
      value: '',
      touched: false
    },
    video: {
      value: '',
      touched: false
    },
    images: {
      value: '',
      touched: false
    },
    equipment: {
      value: [],
      touched: false
    },
    entryType: {
      value: [],
      touched: false
    },
  };

  get title() {
    return this._form.title.value;
  }

  set title(value) {
    this._form.title.value = value;
  }

  get titleTouched() {
    return this._form.title.touched;
  }

  set titleTouched(value) {
    this._form.title.touched = value;
  }
  
  get description() {
    return this._form.description.value;
  }

  set description(value) {
    this._form.description.value = value;
  }

  get descriptionTouched() {
    return this._form.description.touched;
  }

  set descriptionTouched(value) {
    this._form.description.touched = value;
  }
  
  get video() {
    return this._form.video.value;
  }

  set video(value) {
    this._form.video.value = value;
  }

  get videoTouched() {
    return this._form.video.touched;
  }

  set videoTouched(value) {
    this._form.video.touched = value;
  }
  
  get images() {
    return this._form.images.value;
  }

  set images(value) {
    this._form.images.value = value;
  }

  get imagesTouched() {
    return this._form.images.touched;
  }

  set imagesTouched(value) {
    this._form.images.touched = value;
  }

  get equipment() {
    return this._form.equipment.value;
  }

  set equipment(value) {
    this._form.equipment.value = value;
  }

  get equipmentTouched() {
    return this._form.equipment.touched;
  }

  set equipmentTouched(value) {
    this._form.equipment.touched = value;
  }

  get entryType() {
    return this._form.entryType.value;
  }

  set entryType(value) {
    this._form.entryType.value = value;
  }

  get entryTypeTouched() {
    return this._form.entryType.touched;
  }

  set entryTypeTouched(value) {
    this._form.entryType.touched = value;
  }

  get validationResults() {
    const request = ExerciseManagementService.ValidateCreateExerciseRequest(this.buildInfoRequest())
    return request;
  }

  buildInfoRequest = () => {
    return {
      title: this.title,
      description: this.description,
      equipment: this.equipment,
      entryType: this.entryType
    };
  };

  submitForm = async () => {
    const request = this.buildInfoRequest();
    const message = await ExerciseManagementService.SubmitNewExercise(request);
    return message;
  };
}
