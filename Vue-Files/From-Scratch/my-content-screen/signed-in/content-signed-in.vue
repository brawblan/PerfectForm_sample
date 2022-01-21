<template>
	<!--	User is signed in, but has no content -->
	<div
		v-if="!hasContent"
		class="flex flex-col justify-center h-full"
	>
    <ContentTab
        :tabs="tabs"
        :selected-key="currentTab"
        :tab-type="tabType"
    >
      <template v-slot:[tabKeys.plans]>
        <div class="mt-52">
          <h3 class="justify-center text-2xl flex font-semibold mb-4">
            Purchase Content to Get Fit
          </h3>

          <a
              :href="navigateToHome"
              class="text-blue-600 text-lg font-bold mx-auto"
          >
            Explore Plans
          </a>
        </div>
      </template>
    </ContentTab>
	</div>

	<!--	User is signed in and has content -->
	<div
		v-else
		class="flex flex-col h-full mt-16 lg:mt-24"
	>
    <ContentTab
        :tabs="tabs"
        :selected-key="currentTab"
        :tab-type="tabType"
    >
      <template v-slot:[tabKeys.plans]>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-3 mx-3">
          <PlanSummaryListCard
              v-for="plan of planSummaries"
              :summary="plan"
              @click="onPlanClicked(plan.id)"
              class="mb-3"
          >
          </PlanSummaryListCard>
        </div>
      </template>
      <template v-slot:[tabKeys.bookmarked]>
        <Bookmarks />
      </template>
    </ContentTab>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, ref} from 'vue'
import router from '@/router';
import {IconService} from '@/services/icon/icon.service';
import {Icon} from '@/services/icon/icon.enum';
import {NavigationRoute} from '@/router/navigation-route.enum';
import {OwnedPlan} from '@/services/plan/models/owned-plan.class';
import {Bookmark} from '@/services/bookmark/models/bookmark.class';
import MyContentNavHeader from '@/views/my-content-screen/my-content-nav-header.vue';
import ContentCard from '@/components/cards/content-plan-card/content-plan-card.vue'
import Bookmarks from '@/views/my-content-screen/bookmarked-screen/bookmarked-content-screen.vue'
import {TabOption} from '@/components/ui/content-tab/tab-option.interface'
import ContentTab from '@/components/ui/content-tab/content-tab.vue'
import {AppNavbarSettings} from '@/components/ui/app-navbar/app-navbar-settings'
import {NavigationHeaderService} from '@/components/ui/navigation-header/navigation-header.service'
import {NavigationHeaderType} from '@/components/ui/navigation-header/navigation-header-type.enum'
import {PersistentTab} from '@/services/app-state/models/persistent-tab.enum'
import PlanSummaryListCard from '@/components/cards/plan-summary-list-card/plan-summary-list-card.vue'
import {PlanSummary} from '@/services/plan/models/plan-summary.class'
import {AppStateService} from '@/services/app-state/app-state.service'

interface Props {
  hasContent: boolean,
  plans: Array<OwnedPlan>
  bookmarkedPlans: Array<Bookmark>
  bookmarkedCoaches: Array<Bookmark>
  getBookmarks: Function
}

export default defineComponent({
	components: {PlanSummaryListCard, ContentTab, MyContentNavHeader, ContentCard, Bookmarks},
	props: {
		hasContent: {
			type: Boolean,
			required: true
		},
		plans: {
			type: Object as PropType<Array<OwnedPlan>>,
			required: true
		},
		bookmarkedPlans: {
			type: Object as PropType<Array<Bookmark>>,
			required: true
		},
		bookmarkedCoaches: {
			type: Object as PropType<Array<Bookmark>>,
			required: true
		},
		getBookmarks: {
			type: Function,
			required: true
		}
	},
	setup(props: Props) {
    AppNavbarSettings.isVisible.value = true
    AppNavbarSettings.activeNavItem.value = AppNavbarSettings.getNavigationItems().content
    NavigationHeaderService.instance.updateSettings({type: NavigationHeaderType.base, hasBackButton: false, resetTab: PersistentTab.myContent})

    const tabKeys = {
      plans: 'plans',
      appointments: 'appointments',
      bookmarked: 'bookmarked'
    }

    const tabs: Array<TabOption> = [
      {
        key: tabKeys.plans,
        displayValue: 'Plans',
        enabled: true
      },
      {
        key: tabKeys.bookmarked,
        displayValue: 'Bookmarked',
        enabled: true
      },
      {
        key: tabKeys.appointments,
        displayValue: 'Appointments',
        enabled: false,
        isFutureFeature: true
      },
    ]
    const currentTab = ref(tabs[0].key)
    const tabType = PersistentTab.myContent

		const icons = {
			back: IconService.getIcon(Icon.chevronLeft),
			bookmark: IconService.getIcon(Icon.bookmarkFilled),
			bookmarkGradient: IconService.getIcon(Icon.bookmarkGradient)
		}
		const navigateToHome = () => {
			router.push(NavigationRoute.home)
		}
		const planSummaries = computed(() => props.plans.map(x => {
          const plan = x.exercise_plan
          return new PlanSummary(
            plan.id,
            plan.bannerImage,
            plan.categories,
            plan.name.en ?? '',
            plan.rating,
            plan.price,
            plan.coach,
            x.completed,
            x.completed,
            plan.weeksLong,
            plan.difficultyType,
            plan.coach.profileImageUrl
          )
    }))
    const onPlanClicked = (planId: string) => {
      router.push({path: NavigationRoute.planDetails, query: {id: planId}})
    }
    const loadTabSelection = () => {
      const selectedTab = AppStateService.getTabValue(PersistentTab.myContent)
      if (selectedTab) {
        currentTab.value = selectedTab ?? currentTab.value
      }
    }
    onMounted(() => {
      loadTabSelection()
    })

		return {
			icons,
      tabKeys,
			tabs,
      currentTab,
      tabType,
			NavigationRoute,
      planSummaries,
      onPlanClicked,
			navigateToHome
		}
	}
})

</script>
