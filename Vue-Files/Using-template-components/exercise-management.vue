<template>
  <div class="pos__ticket box md:p-6 p-2 mt-5">
    <div class="intro-y items-center h-10">
      <h2 class="text-lg font-medium truncate mr-5">
        All Exercises
      </h2>
    </div>
    <div class="flex flex-wrap justify-center gap-6 mt-5">
      <div
        v-for="exercise in exerciseList"
        :key="exercise"
      >
        <ExerciseCard
          :exercise="exercise"
          @click="setSelectedExercise(exercise)"
        />
      </div>
    </div>

    <PaginatorWithCenteredButtons
      :paginationData="paginationData"
      @page-selected="onPageSelected($event)"
    />
  </div>
  <ViewExerciseSlideOver
    :exercise="selectedExercise"
  />
  <AddToLessonSlideOver
    :exercise="selectedExercise"
  />
  <EditExerciseSlideOver
    :exercise="selectedExercise"
  />
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {NavigationRouteEnum} from '@/router/navigation-route-enum'
import {ExerciseManagementService} from '@/services/content-management/exercise-management/exercise-management.service'
import CreateExercise from './create-exercise.vue'
import ExerciseCard from '@/components/content-cards/exercise-card.vue'
import PaginatorWithCenteredButtons from '@/components/paginator/paginator-with-centered-buttons/paginator-with-centered-buttons.vue'
import ViewExerciseSlideOver from '@/components/slide-over-overlay/view-exercise-slide-over.vue'
import AddToLessonSlideOver from '@/components/slide-over-overlay/add-to-lesson-slide-over.vue'
import EditExerciseSlideOver from '@/components/slide-over-overlay/edit-exercise/edit-exercise-slide-over.vue'
import {EditExerciseViewModel} from '@/components/slide-over-overlay/edit-exercise/edit-exercise.view-model'

export default defineComponent({
  name: 'ExerciseManagement',
  components: {
    CreateExercise,
    ExerciseCard,
    PaginatorWithCenteredButtons,
    ViewExerciseSlideOver,
    AddToLessonSlideOver,
    EditExerciseSlideOver
  },
  setup() {
    const hasExercises = ref(true)
    const router = useRouter()
    const exerciseList = ref([])
    const paginationData = ref([])
    const selectedExercise = ref(new EditExerciseViewModel())

    const clickToCreateExercise = () => {
      router.push(NavigationRouteEnum.createExercise)
    }
    const setSelectedExercise = (exercise) => {
      selectedExercise.value = exercise
    }
    const onPageSelected = (data) => {
      const newPage = data.page_number + 1
      ExerciseManagementService.GetExercisesByCurrentAccount(newPage).then((res) => {
        exerciseList.value = res.data
        paginationData.value = res.pagination
      })
    }

    onMounted(() => {
      ExerciseManagementService.GetExercisesByCurrentAccount(1).then((res) => {
        exerciseList.value = res.data
        paginationData.value = res.pagination
      })
    })

    return {
      hasExercises,
      exerciseList,
      paginationData,
      selectedExercise,

      clickToCreateExercise,
      setSelectedExercise,
      onPageSelected
    }
  }
})
</script>