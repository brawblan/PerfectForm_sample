<template>
	<div class="flex flex-col h-full mt-4">
		<SimpleNativeSelect
			class="h-20 w-32 ml-4"
			v-model="selectedOption"
			:items="options"
			label="Bookmarks"
			@update:modelValue="onBookmarkOptionSelected($event)"
		>
		</SimpleNativeSelect>
		<div
			v-if="selectedOption.value === BookmarkType.plans"
      class="m-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-3"
		>
      <PlanSummaryListCard
          v-if="bookmarkedPlans.length"
          v-for="plan of bookmarkedPlans"
          :summary="plan"
          :show-bookmark="true"
          @click="onPlanSelected(plan.id)"
          class="mb-3"
      >
      </PlanSummaryListCard>
			<div
				v-else
				class="flex justify-center items-center h-80"
			>
				No bookmarked plans
			</div>
		</div>
		<div
			v-else
      class="m-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-3"
        >
      <CoachSummaryCard
          v-if="bookmarkedCoaches.length"
          v-for="coach of bookmarkedCoaches"
          :coach="coach"
          :show-bookmark="true"
          @click="onCoachSelected(coach.id)"
          class="mb-3"
      >
      </CoachSummaryCard>
			<div
				v-else
				class="flex justify-center items-center h-80"
			>
				No bookmarked coaches
			</div>
		</div>

	</div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import {Bookmark} from '@/services/bookmark/models/bookmark.class'
import {ISimpleNativeSelectItem} from '@/components/forms/inputs/selectors/simple-native-select/simple-native-select-item.interface'
import MyContentNavHeader from '@/views/my-content-screen/my-content-nav-header.vue'
import SimpleNativeSelect from '@/components/forms/inputs/selectors/simple-native-select/simple-native-select.vue'
import {NavigationRoute} from '@/router/navigation-route.enum'
import {useRouter} from 'vue-router'
import {BookmarkService} from '@/services/bookmark/bookmark.service'
import {SimpleAlertItem} from '@/components/ui/alerts/alert-container/simple-alert-item.class'
import {AlertService} from '@/services/alert/alert.service'
import {SimpleAlertType} from '@/components/ui/alerts/simple-alert/models/simple-alert-type.enum'
import PlanSummaryListCard from '@/components/cards/plan-summary-list-card/plan-summary-list-card.vue'
import {PlanSummary} from '@/services/plan/models/plan-summary.class'
import {CoachSummary} from '@/services/coach/models/coach-summary.class'
import CoachSummaryCard from '@/components/cards/coach-summary-card/coach-summary-card.vue'

export default defineComponent({
	components: {
    CoachSummaryCard,
    PlanSummaryListCard,
		MyContentNavHeader,
		SimpleNativeSelect
	},
	setup() {
	  const router = useRouter()
		enum BookmarkType {
			plans = 'plans',
			coaches = 'coaches'
		}
    const bookmarkedPlans = ref<Array<PlanSummary>>([])
    const bookmarkedCoaches = ref<Array<CoachSummary>>([])
		const options: Array<ISimpleNativeSelectItem> = [
			{
				label: 'Plans',
				value: BookmarkType.plans
			},
			{
				label: 'Coaches',
				value: BookmarkType.coaches
			}
		]
    const mostRecentCategoryKey = 'bookmarkedContentScreen_mostRecentCategoryKey'
    const selectedOption =
        ref<ISimpleNativeSelectItem>(
            options.find(x => x.value === localStorage.getItem(mostRecentCategoryKey))
            ?? options[0]
        )
		const onBookmarkOptionSelected = (option: ISimpleNativeSelectItem) => {
			selectedOption.value = option
      localStorage.setItem(mostRecentCategoryKey, option.value)
		}
    const onPlanSelected = (id: string) => {
      router.push({path: NavigationRoute.planDetails, query: {id}})
    }
    const onCoachSelected = (id: string) => {
      router.push({path: NavigationRoute.coachDetails, query: {id}})
    }
    onMounted(() => {
      loadBookmarks()
    })
    const loadBookmarks = () => {
      loadBookmarkedPlans()
      loadBookmarkedCoaches()
    }
    const loadBookmarkedPlans = async () => {
	    try {
        bookmarkedPlans.value = (await BookmarkService.GetBookmarkedPlans()).map(bookmark => {
          const plan = bookmark.exercisePlan
          if (!plan) {
            return undefined
          }

          return new PlanSummary(
              plan.id,
              plan.bannerImage,
              plan.categories,
              plan.name.en ?? '',
              plan.rating,
              plan.price,
              plan.coach,
              plan.completed,
              undefined,
              plan.weeksLong,
              plan.difficultyType,
              plan.coach.profileImageUrl,
              bookmark.isBookmarked
          )
        }).filter(x => x !== undefined) as Array<PlanSummary>
      } catch (err) {
	      console.error(err)
        AlertService.ShowSimpleAlert(new SimpleAlertItem(err.message ?? err, SimpleAlertType.error, 'Could not load bookmarked plans'))
      }
    }
    const loadBookmarkedCoaches = async () => {
	    try {
        bookmarkedCoaches.value = (await BookmarkService.GetBookmarkedCoaches()).map(x => {
          const { coach } = x
          if (!coach) {
            return undefined
          }
          return new CoachSummary(
            coach.id,
            coach.profileImage,
            coach.firstName,
            coach.lastName,
            coach.overallRating ?? 0,
            coach.specialties ?? [],
              x.isBookmarked
          )
        }).filter(x => x !== undefined) as Array<CoachSummary>
      } catch (err) {
        console.error(err)
        AlertService.ShowSimpleAlert(new SimpleAlertItem(err.message ?? err, SimpleAlertType.error, 'Could not load bookmarked coaches'))
      }
    }

		return {
	    bookmarkedCoaches,
      bookmarkedPlans,
			selectedOption,
			options,
			BookmarkType,
			onBookmarkOptionSelected,
      onPlanSelected,
      onCoachSelected
		}
	}
})
</script>
