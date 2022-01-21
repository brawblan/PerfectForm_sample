<template>
  <!-- BEGIN: Wizard Layout -->
  <div class="intro-y box py-8">
    <!-- BEGIN: Step Header -->
    <div
      class="wizard flex flex-col lg:flex-row justify-center px-5 sm:px-20"
    >
      <div
        class="intro-x lg:text-center flex items-center lg:block flex-1 z-10"
      >
        <button
          class="w-10 h-10 rounded-full btn"
          :class="isStepOne ? 'btn-primary' : 'bg-gray-200 text-gray-600'"
          @click="goToStepOne()"
        >
          1
        </button>
        <div
          class="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto"
          :class="isStepOne ? 'font-medium' : 'text-gray-700'"
        >
          Exercise Details
        </div>
      </div>
      <div
        class="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10"
      >
        <button
          class="w-10 h-10 rounded-full btn"
          :class="!isStepOne ? 'btn-primary' : 'bg-gray-200 text-gray-600'"
          :disabled="formHasErrors"
          @click="goToStepTwo()"
        >
          2
        </button>
        <div
          class="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto"
          :class="!isStepOne ? 'font-medium' : 'text-gray-700'"
        >
          Preview Exercise
        </div>
      </div>
      <div
        class="wizard__line hidden lg:block w-5/12 bg-gray-200 dark:bg-dark-1 absolute mt-5"
      ></div>
    </div>
    <!-- END: Step Header -->
    <div
      class="px-4 sm:px-20 mt-4 pt-4 border-t border-gray-200 dark:border-dark-5"
    >
      <div class="font-medium text-base">Create New Exercise</div>
      <div class="grid grid-cols-12 gap-4 gap-y-5 mt-5">
        <!-- Create Exercise -->
        <template
          v-if="isStepOne"
        >
          <div class="flex flex-col gap-4 intro-y col-span-12 sm:col-span-6">
            <!-- Exercise Name Input -->
            <div class="intro-y col-span-12 sm:col-span-6">
              <label
                for="exerciseName"
                class="form-label"
              >
                Exercise Name
              </label>
              <input
                id="exerciseName"
                type="text"
                class="form-control"
                v-model="viewModel.title"
                @input="onTitleUpdated"
              />
              <p class="text-theme-6 text-xs text-left mt-2">
                {{ displayedErrors.title.length ? displayedErrors.title : '' }}&nbsp;
              </p>
            </div>
            <!-- Description Input -->
            <div class="intro-y col-span-12 sm:col-span-6">
              <label
                for="exerciseDescription"
                class="form-label"
              >
                Description
              </label>
              <div
                class="preview"
                id="exerciseDescription"
              >
                <ClassicEditor
                  v-model="viewModel.description"
                  @update:modelValue="onDescriptionUpdated"
                />
              </div>
              <p class="text-theme-6 text-xs text-left mt-2">
                {{ displayedErrors.description.length ? displayedErrors.description : '' }}&nbsp;
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-4 intro-y col-span-12 sm:col-span-6">
            <!-- Video Input -->
            <div>
              <div class="intro-y form-control flex gap-2 items-center mt-5">
                <label
                  for="howToVideo"
                  class="btn btn-primary"
                >
                  Video
                </label>
                <input
                  id="howToVideo"
                  type="file"
                  class="form-control"
                  @change="onVideoUploaded"
                  hidden
                />
                <div class="h-full max-h-11 overflow-y-auto">
                  <div v-if="!videoList.length">
                    Select video
                  </div>
                  <div
                    v-else
                    v-for="video of videoList"
                    :key="video.file.name"
                    class="flex gap-4"
                  >
                    {{video.file.name}}
                    <a
                      v-if="videoList.length"
                      class="flex items-center text-theme-6"
                      href="javascript:;"
                      data-toggle="modal"
                      data-target="#delete-confirmation-modal"
                      @click="(setMediaToDelete(video))"
                    >
                      <Trash2Icon class="w-4 h-4 mr-1" /> Delete
                    </a>
                  </div>
                </div>
              </div>
              <p class="text-theme-6 text-xs text-left mt-2">
                {{ displayedErrors.video.length ? displayedErrors.video : '' }}&nbsp;
              </p>
            </div>
            <!-- Image Input -->
            <div>
              <div class="intro-y form-control flex gap-2 items-center">
                <label
                  for="howToImages"
                  class="btn btn-primary"
                >
                  Images
                </label>
                <input
                  id="howToImages"
                  type="file"
                  class="form-control"
                  multiple="true"
                  @change="onImagesUploaded"
                  hidden
                />
                <div class="h-full max-h-11 overflow-y-auto pr-4">
                  <div v-if="!imageList.length">
                    Select 1 or more images
                  </div>
                  <div
                    v-else
                    v-for="image of imageList"
                    :key="image.file.name"
                    class="flex gap-4"
                  >
                    {{image.file.name}}
                    <a
                      class="flex items-center text-theme-6"
                      href="javascript:;"
                      data-toggle="modal"
                      data-target="#delete-confirmation-modal"
                      @click="setMediaToDelete(image)"
                    >
                      <Trash2Icon class="w-4 h-4 mr-1"/>
                      Delete
                    </a>
                  </div>
                </div>
              </div>
              <p class="text-theme-6 text-xs text-left mt-2">
                {{ displayedErrors.images.length ? displayedErrors.images : '' }}&nbsp;
              </p>
            </div>
            <!-- Equipment Input -->
            <div class="intro-y col-span-12 sm:col-span-6">
              <div class="preview">
                <label class="form-label">Equipment</label>
                <TomSelect
                  :config="tomSelectConfig"
                  class="w-full"
                  multiple
                >
                </TomSelect>
              </div>
              <p class="text-theme-6 text-xs text-left mt-2">
                {{ displayedErrors.equipment.length ? displayedErrors.equipment : '' }}&nbsp;
              </p>
            </div>
            <!-- Entry Type Input -->
            <div class="intro-y col-span-12 sm:col-span-6">
              <label
                class="form-label"
              >
                Entry Type(s)
              </label>
              <div class="flex flex-col justify-between sm:flex-row form-control">
                <div class="form-check mr-2">
                  <input
                    id="checkbox-load"
                    class="form-check-input"
                    type="checkbox"
                    value="load"
                    v-model="viewModel.entryType"
                    @change="onEntryTypeSelected"
                  />
                  <label
                    class="form-check-label"
                    for="checkbox-load"
                  >
                    Load
                  </label>
                </div>
                <div class="form-check mr-2 mt-2 sm:mt-0">
                  <input
                    id="checkbox-reps"
                    class="form-check-input"
                    type="checkbox"
                    value="reps"
                    v-model="viewModel.entryType"
                    @change="onEntryTypeSelected"
                  />
                  <label
                    class="form-check-label"
                    for="checkbox-reps"
                  >
                    Reps
                  </label>
                </div>
                <div class="form-check mr-2 mt-2 sm:mt-0">
                  <input
                    id="checkbox-time"
                    class="form-check-input"
                    type="checkbox"
                    value="time"
                    v-model="viewModel.entryType"
                    @change="onEntryTypeSelected"
                  />
                  <label
                    class="form-check-label"
                    for="checkbox-time"
                  >
                    Time
                  </label>
                </div>
                <div class="form-check mr-2 mt-2 sm:mt-0">
                  <input
                    id="checkbox-rounds"
                    class="form-check-input"
                    type="checkbox"
                    value="rounds"
                    v-model="viewModel.entryType"
                    @change="onEntryTypeSelected"
                  />
                  <label
                    class="form-check
                    -label"
                    for="checkbox-rounds"
                  >
                    Rounds
                  </label>
                </div>
                <div class="form-check mr-2 mt-2 sm:mt-0">
                  <input
                    id="checkbox-score"
                    class="form-check-input"
                    type="checkbox"
                    value="score"
                    v-model="viewModel.entryType"
                    @change="onEntryTypeSelected"
                  />
                  <label
                    class="form-check-label"
                    for="checkbox-score"
                  >
                    Score
                  </label>
                </div>
              </div>
              <p class="text-theme-6 text-xs text-left mt-2">
                {{ displayedErrors.entryType.length ? displayedErrors.entryType : '' }}&nbsp;
              </p>
            </div>
          </div>
        </template>

        <!-- Preview Exercise -->
        <template
          v-if="!isStepOne"
        >
          <!-- Left Side -->
          <div class="flex flex-col gap-4 mr-6 intro-y col-span-12 sm:col-span-6">
            <div
              v-if="viewModel.video.length"
              class="form-control"
            >
              <video
                class="mb-2 rounded-md object-contain"
                controls
              >
                <source
                  v-if="viewModel.video[0].file.type === 'video/mp4'"
                  :src="viewModel.video[0].videoURL"
                  type="video/mp4"
                >
                <source
                  v-else-if="viewModel.video[0].file.type === 'video/ogg'"
                  :src="viewModel.video[0].videoURL"
                  type="video/ogg"
                >
                <source
                  v-else-if="viewModel.video[0].file.type === 'video/webm'"
                  :src="viewModel.video[0].videoURL"
                  type="video/webm"
                >
              </video>
              <div class="modal-body p-0">
                <div class="p-5 text-center">
                  <div
                    v-if="isSubmitting"
                  >
                    Uploading Video
                  </div>
                  <div
                    v-else
                  >
                    Save Exercise to upload video
                  </div>
                  <div
                    v-if="isSubmitting"
                    class="progress h-4 rounded mt-3"
                  >
                    <div
                      class="progress-bar bg-theme-1 rounded"
                      :style="`width: ${(/\d/).test(videoUploadInfo.detail) ? Math.round(videoUploadInfo.detail) : 0}%`"
                      role="progressbar"
                      :aria-valuenow="videoUploadInfo.detail"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {{(/\d/).test(videoUploadInfo.detail) ? `${Math.round(videoUploadInfo.detail)}%` : ''}}
                    </div>
                  </div>
                </div>
                <div class="flex justify-center pb-8 gap-4 text-center">
                  <button
                    type="button"
                    class="btn btn-warning w-24"
                    :class="!uploadInfo ? 'cursor-not-allowed opacity-50 hover:bg-primary-600' : ''"
                    @click="uploadInfo ? pauseVideoUpload(uploadInfo) : ''"
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    class="btn btn-success w-24"
                    :class="!uploadInfo ? 'cursor-not-allowed opacity-50 hover:bg-primary-600' : ''"
                    @click="uploadInfo ? resumeVideoUpload(uploadInfo) : ''"
                  >
                    Resume
                  </button>
                  <a
                    type="button"
                    class="btn btn-danger w-24"
                    :class="!uploadInfo ? 'cursor-not-allowed opacity-50 hover:bg-primary-600' : ''"
                    href="javascript:;"
                    data-toggle="modal"
                    data-target="#delete-upload-modal"
                    @click="uploadInfo ? pauseVideoUpload(uploadInfo) : ''"
                  >
                    <button>
                      Abort
                    </button>
                  </a>
                </div>
              </div>
            </div> <!-- video -->
            <div
              v-else
              class="form-control text-center"
            >
              No video added.
            </div> <!-- no video -->
            <hr>
            <div
              class="form-control flex items-baseline"
            >
              <h3
                class="font-normal text-base mr-2"
              >
                Exercise Title:
              </h3>
              <h2
                class="font-bold text-lg"
              >
                {{viewModel.title}}
              </h2>
            </div> <!-- title -->
            <div
              class="form-control"
            >
              <h3
                class="font-normal text-base mb-2"
              >
                Exercise Description:
              </h3>
              <div v-html="viewModel.description"></div>
            </div> <!-- description -->
          </div>
          <!-- Right Side -->
          <div class="flex flex-col gap-4 intro-y col-span-12 sm:col-span-6">
            <div
              class="form-control"
              :class="viewModel.images.length > 2 && 'pt-3 px-8 pb-8'"
            >
              <TinySlider
                v-if="viewModel.images.length"
                :options="{
                  controls: true,
                  nav: true,
                  autoplay: false,
                  items: 2
                }"
              >
                <div
                  v-for="image in viewModel.images"
                  :key="image"
                  class="px-2"
                >
                  <div class="h-full bg-gray-200 rounded-md">
                    <img
                      class="h-full flex items-center justify-center object-contain"
                      :src="image.imageURL"
                      alt="exercise image"
                    >
                  </div>
                </div>
              </TinySlider>
              <div
                v-else
                class="text-center"
              >
                No image(s) added.
              </div>
            </div> <!-- images -->
            <hr>
            <div
              class="form-control flex items-baseline"
            >
              <h3
                class="font-normal text-base mr-2"
              >
                Entry Type:
              </h3>
              <span
                v-for="(entry, index) in viewModel.entryType"
                :key="entry + index"
                class="py-1 px-2 mx-1 flex items-center rounded-full text-xs bg-gray-200 text-gray-600 truncate"
              >
                {{entry}}
              </span>
            </div> <!-- entry type -->
            <div
              class="form-control"
            >
              <h3
                class="font-normal text-base mb-2"
              >
                Required Equipment:
              </h3>
              <div class="flex flex-wrap items-baseline gap-2">
                <span
                  v-for="(item, index) in viewModel.equipment"
                  :key="item + index"
                  class="py-1 px-2 mx-1 flex items-center rounded-full text-xs bg-gray-200 text-gray-600 truncate"
                >
                  {{`${item.charAt(0).toUpperCase()}${item.slice(1)}`}}
                </span>
              </div>
            </div> <!-- equipment -->
          </div>
        </template>

        <!-- Edit/Preview/Mobile Preview/Submit Buttons -->
        <div
          class="intro-y col-span-12 flex items-center justify-between mt-5"
        >
          <div>
            <button
              class="btn w-24"
              :class="isStepOne ? 'btn-secondary' : 'btn-primary'"
              @click="goToStepOne()"
            >
              Edit
            </button>
            <button
              class="btn w-24 ml-2"
              :class="!isStepOne ? 'btn-secondary' : 'btn-primary'"
              :disabled="formHasErrors"
              @click="goToStepTwo()"
            >
              Preview
            </button>
          </div>

          <div
            v-show="!isStepOne"
            class="flex gap-2"
          >
            <a
              href="javascript:;"
              data-toggle="modal"
              data-target="#mobile-preview-modal"
            >
              <button
                class="btn btn-primary w-full"
              >
                Mobile Preview
              </button>
            </a>
            <AsyncButton
              :isLoading="isSubmitting"
              @click="submitExercise"
            >
              Save Exercise
            </AsyncButton>
          </div>
        </div>

      </div>
    </div>
  </div>
  <!-- END: Wizard Layout -->
  <!-- BEGIN: Delete Confirmation Modal -->
  <div
    id="delete-confirmation-modal"
    class="modal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="p-5 text-center">
            <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3" />
            <div class="text-3xl mt-5">Are you sure?</div>
            <div class="text-gray-600 mt-2">
              Do you really want to delete these records? <br />This process
              cannot be undone.
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button
              type="button"
              data-dismiss="modal"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger w-24"
              data-dismiss="modal"
              @click="removeMedia(mediaToDelete)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Delete Confirmation Modal -->
  <!-- BEGIN: Delete Video Upload Modal -->
  <div
    v-if="viewModel.video.length"
    id="delete-upload-modal"
    class="modal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="p-5 text-center">
            <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3" />
            <div class="text-3xl mt-5">Are you sure?</div>
            <div class="text-gray-600 mt-2">
              Do you really want to cancel this upload? <br />
              This process cannot be undone. <br />
              This will finish creating your exercise. <br />
              You can edit this exercise and add a video.
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button
              type="button"
              data-dismiss="modal"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger w-24"
              data-dismiss="modal"
              @click="abortVideoAndCreateExercise(uploadInfo)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Delete Video Upload Modal -->
  <!-- BEGIN: Mobile Preview Modal -->
  <div
    id="mobile-preview-modal"
    class="modal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div
            v-if="viewModel.video.length"
          >
            <video
              class="mb-2 object-contain"
              controls
            >
              <source
                v-if="viewModel.video[0].file.type === 'video/mp4'"
                :src="viewModel.video[0].videoURL"
                type="video/mp4"
              >
              <source
                v-else-if="viewModel.video[0].file.type === 'video/ogg'"
                :src="viewModel.video[0].videoURL"
                type="video/ogg"
              >
              <source
                v-else-if="viewModel.video[0].file.type === 'video/webm'"
                :src="viewModel.video[0].videoURL"
                type="video/webm"
              >
            </video>
          </div> <!-- video -->
          <div
            v-else
            class="form-control text-center"
          >
            No video added.
          </div> <!-- no video -->

          <!-- Info Header -->
          <div class="max-w-3xl m-3 flex flex-auto flex-col">
            <div class="flex flex-auto">
              <h2 class="text-xl font-black">
                {{ viewModel.title }}
              </h2>
            </div>
          </div>

          <hr>

          <!-- Instructions -->
          <div class="max-w-3xl flex flex-auto flex-col m-3">
            <div class="flex flex-auto">
              <p class="font-light text-xs text-left mb-2">
                Instructions
              </p>
            </div>
            <div class="flex flex-auto">
              <p v-html="viewModel.description" class="font-normal text-sm text-left"></p>
            </div>
          </div>

          <hr>

          <div
            :class="viewModel.images.length > 2 && 'pt-3 px-8 pb-8'"
          >
            <TinySlider
              v-if="viewModel.images.length"
              :options="{
                  autoplay: false,
                  controls: true,
                  items: 2,
                  nav: false,
                  responsive: {
                    640: {
                      edgePadding: 20,
                      gutter: 20,
                      items: 2
                    },
                    700: {
                      gutter: 30
                    },
                    900: {
                      items: 2
                    }
                  }
                }"
            >
              <div
                v-for="image in viewModel.images"
                :key="image"
                class="px-2"
              >
                <div class="h-full bg-gray-200 rounded-md">
                  <img
                    class="h-full flex items-center justify-center object-contain"
                    :src="image.imageURL"
                    alt="exercise image"
                  >
                </div>
              </div>
            </TinySlider>
            <div
              v-else
              class="form-control text-center"
            >
              No image(s) added.
            </div>
          </div>

          <div
            v-if="viewModel.equipment.length"
            class="flex flex-wrap m-3 gap-2"
          >
            <span
              v-for="piece in viewModel.equipment"
              :key="piece"
              class="inline-flex align-middle px-2.5 py-0.5 rounded-md text-sm font-medium bg-theme-1 text-white">
              {{ piece }}
            </span>
          </div>

          <div class="px-5 pb-8 text-center">
            <button
              type="button"
              class="btn btn-danger w-24"
              data-dismiss="modal"
              @click="abortVideoAndCreateExercise(uploadInfo)"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Mobile Preview Modal -->

  <SuccessModal
    successTitle="Exercise Created!"
    successMessage="Add it to a lesson or create more."
  />

</template>

<script>
import {defineComponent, ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {CreateExerciseViewModel} from './create-exercise.view-model'
import {MuxService} from '@/services/mux/mux.service'
import {IdTypeEnum} from '@/services/_models/id-types/id-types-enum.class'
import {NavigationRouteEnum} from '@/router/navigation-route-enum'
import TextEditor from '@/components/wysiwyg-editor/Main.vue'
import TomSelect from '@/components/tom-select/Main.vue'
import TinySlider from '@/components/tiny-slider/Main.vue'
import AsyncButton from '@/components/async-button/async-button.vue'
import SuccessModal from '@/components/notification-modals/success-modal.vue'
import Toastify from 'toastify-js'
import cash from 'cash-dom/dist/cash'
import {ImageManagementService} from '@/services/image/image-management/image-management.service'

const EmittedEvents = {
  valueUpdated: 'update:modelValue'
}
class ErrorMessages {
  static videoError = 'Must be in video format.'
  static imageError = 'Must be in an image format. Video(s) not added.'
  static noDuplicates = 'No duplicate images allowed.'
}

export default defineComponent({
  name: 'CreateExercise',
  components: {
    TomSelect,
    TextEditor,
    TinySlider,
    AsyncButton,
    SuccessModal
  },
  emits: [EmittedEvents.valueUpdated],
  setup({emit}) {
    const router = useRouter()
    const viewModel = reactive(new CreateExerciseViewModel())
    const displayedErrors = reactive({
      title: [],
      description: [],
      video: [],
      images: [],
      equipment: [],
      entryType: []
    })
    const isSubmitting = ref(false)
    const formHasErrors = ref(true)
    const isStepOne = ref(true)
    const tomSelectConfig = {
      placeholder: 'Select or Type Equipment Needed',
      persist: true,
      createOnBlur: true,
      create: true,
      valueField: 'id',
      labelField: 'title',
      searchField: 'title',
      sortField: 'title',
      options: [
        ...viewModel.equipment,
        {id: 'Dumbbells', title: 'Dumbbells'},
        {id: 'Jump rope', title: 'Jump Rope'},
        {id: 'Squat rack', title: 'Squat Rack'},
        {id: 'Stop watch', title: 'Stop Watch'},
        {id: 'Treadmill', title: 'Treadmill'}
      ],
      onChange: (e) => addEquipmentNeeded(e)
    }
    const videoList = ref([])
    const imageList = ref([])
    const mediaToDelete = ref()
    const videoUploadInfo = ref(0)
    const uploadInfo = ref()
    const muxUploadId = ref('')

    const onTitleUpdated = () => {
      viewModel.titleTouched = true
      updateTitleError()
      checkFormHasErrors()
    }
    const updateTitleError = () => {
      const results = viewModel.validationResults.title
      const message = !results ? '' : results[0] && viewModel.titleTouched ? results[0].message : ''
      displayedErrors.title = message
    }
    const onDescriptionUpdated = () => {
      viewModel.descriptionTouched = true
      updateDescriptionError()
      checkFormHasErrors()
    }
    const updateDescriptionError = () => {
      const results = viewModel.validationResults.description
      const message = !results ? '' : results[0] && viewModel.descriptionTouched ? results[0].message : ''
      displayedErrors.description = message
    }
    const onVideoUploaded = ({target: {files}}) => {
      viewModel.videoTouched = true
      Object.values(files).forEach((file) => {
        if(file.type.split('/')[0] !== 'video') {
          displayedErrors.video = ErrorMessages.videoError
        } else {
          const videoURL = URL.createObjectURL(file)
          displayedErrors.video = ''
          videoList.value = []
          videoList.value.push({videoURL, file})
          viewModel.video = videoList.value
        }
      })
    }
    const onImagesUploaded = ({target: {files}}) => {
      viewModel.imagesTouched = true
      Object.values(files).forEach((file) => {
        if (file.type.split('/')[0] !== 'image') {
          displayedErrors.images = ErrorMessages.imageError
        } else {
          const imageURL = URL.createObjectURL(file)
          displayedErrors.images = ''
          imageList.value.push({imageURL, file})
          viewModel.images = imageList.value
        }
        // TODO: filter for duplicates
      })
    }
    const addEquipmentNeeded = (equipment) => {
      viewModel.equipmentTouched = true
      viewModel.equipment = equipment
      updateAddEquipmentNeededError()
      checkFormHasErrors()
    }
    const updateAddEquipmentNeededError = () => {
      const results = viewModel.validationResults.equipment
      const message = !results ? '' : results[0] && viewModel.equipmentTouched ? results[0].message : ''
      displayedErrors.equipment = message
    }
    const onEntryTypeSelected = () => {
      viewModel.entryTypeTouched = true
      updateEntryTypeSelectedError()
      checkFormHasErrors()
    }
    const updateEntryTypeSelectedError = () => {
      const results = viewModel.validationResults.entryType
      const message = !results ? '' : results[0] && viewModel.entryTypeTouched ? results[0].message : ''
      displayedErrors.entryType = message
    }
    const checkFormHasErrors = () => {
      formHasErrors.value = !(viewModel.validationResults.isValid)
    }

    const setMediaToDelete = (media) => {
      mediaToDelete.value = media
    }
    const removeMedia = (media) => {
      if (media.file.type.includes('video')) {
        videoList.value = []
        viewModel.video = videoList.value
      }
      if (media.file.type.includes('image')) {
        return imageList.value.map((image, index) => {
          image.imageURL === media.imageURL ? imageList.value.splice(index, 1) : image
        })
      }

      mediaToDelete.value = ''
    }
    const goToStepOne = () => {
      isStepOne.value = true
    }
    const goToStepTwo = () => {
      isStepOne.value = false
    }
    const changeModelValue = (value) => {
      emit(EmittedEvents.valueUpdated, value)
    }

    // UpChunck Instance Methods
    const pauseVideoUpload = (upload) => {
      console.log('pausing upload')
      upload.abort()
    }
    const resumeVideoUpload = (upload) => {
      console.log('resuming upload')
      upload.resume()
    }
    const cancelVideoUpload = (upload) => {
      console.log('aborting upload')
      upload.abort()
      MuxService.CancelVideoUpload(muxUploadId.value)
      videoUploadInfo.value = 0
      uploadInfo.value = null
      videoList.value = []
      viewModel.video = ''
      isSubmitting.value = false
    }
    const abortVideoAndCreateExercise = (upload) => {
      cancelVideoUpload(upload)
      onExerciseCreated()
      isSubmitting.value = false
    }

    const submitExercise = async () => {
      isSubmitting.value = true
      const submitVideoImages = async () => {
        await viewModel.submitForm()
          .then((res) => {
            if (viewModel.images.length) {
              viewModel.images.map((image) => {
                ImageManagementService.UploadImage(image.file, res.id)
              })
              !viewModel.video.length && onExerciseCreated()
            }
            if (viewModel.video.length) {
              return MuxService.GetUploadUrl(IdTypeEnum.exerciseId, res.id)
            } else {
              isSubmitting.value = false
            }
          })
          .then(({mux_upload_id, upload_url}) => {
            if (viewModel.video.length) {
              muxUploadId.value = mux_upload_id
              uploadInfo.value = MuxService.UploadVideoToMux(upload_url, viewModel.video[0].file)
              uploadInfo.value.on('error', err => {
                console.error('💥 🙀', err.detail);
                videoUploadInfo.value = err.detail
              });
              uploadInfo.value.on('progress', progress => videoUploadInfo.value = progress);
              uploadInfo.value.on('success', () => {
                console.log("Wrap it up, we're done here. 👋")
                videoUploadInfo.value = 'Upload Complete!'
                isSubmitting.value = false
                onExerciseCreated()
              })
            } else {
              return null
            }
          })
      }
      try {
        if (viewModel.video.length || viewModel.images.length) {
          submitVideoImages()
        }
        if (!viewModel.video.length && !viewModel.images.length) {
          await viewModel.submitForm()
          isSubmitting.value = false
          onExerciseCreated()
        }
        successNotificationToggle()
      } catch (error) {
        console.error(error)
        isSubmitting.value = false
      }
    }
    const onExerciseCreated = () => {
      router.push(NavigationRouteEnum.exerciseManagement)
    }
    const successNotificationToggle = () => {
      Toastify({
        node: cash('#success-notification-content')
          .clone()
          .removeClass('hidden')[0],
        duration: -1,
        newWindow: true,
        close: true,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true
      }).showToast()
    }

    return {
      viewModel,
      isSubmitting,
      formHasErrors,
      isStepOne,
      tomSelectConfig,
      displayedErrors,
      videoList,
      imageList,
      mediaToDelete,
      videoUploadInfo,
      uploadInfo,

      onTitleUpdated,
      onDescriptionUpdated,
      onVideoUploaded,
      onImagesUploaded,
      addEquipmentNeeded,
      onEntryTypeSelected,

      setMediaToDelete,
      removeMedia,
      goToStepOne,
      goToStepTwo,
      changeModelValue,

      pauseVideoUpload,
      resumeVideoUpload,
      cancelVideoUpload,
      abortVideoAndCreateExercise,

      submitExercise,
      onExerciseCreated,

      successNotificationToggle
    }
  }
})
</script>

<style scoped>

</style>