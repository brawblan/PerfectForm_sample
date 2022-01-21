<template>
	<NotSignedInNoContent
		v-if="!userSignedIn"
	/>
	<SignedInContent
		v-else
		:hasContent="hasContent"
		:plans="ownedContentList"
	/>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {NavigationRoute} from '@/router/navigation-route.enum';
import {AuthService} from '@/services/auth/auth-service/auth.service';
import {BookmarkService} from '@/services/bookmark/bookmark.service';
import {PlanService} from '@/services/plan/plan.service';
import {OwnedPlan} from '@/services/plan/models/owned-plan.class';
import {Bookmark} from '@/services/bookmark/models/bookmark.class';
import NotSignedInNoContent from '@/views/my-content-screen/not-signed-in/content-not-signed-in.vue'
import SignedInContent from '@/views/my-content-screen/signed-in/content-signed-in.vue'
import {AlertService} from '@/services/alert/alert.service'
import {SimpleAlertItem} from '@/components/ui/alerts/alert-container/simple-alert-item.class'
import {SimpleAlertType} from '@/components/ui/alerts/simple-alert/models/simple-alert-type.enum'

export default defineComponent({
	components: {NotSignedInNoContent, SignedInContent},
	setup(props) {

		const userSignedIn = AuthService.Instance.isAuthenticated
		const router = useRouter()
		let hasContent = ref<boolean>(true)
    const ownedContentList = ref<OwnedPlan[]>([])


		const loadOwnedContent = async () => {
			try {
				ownedContentList.value = await PlanService.getOwnedPlans()
				hasContent.value = !!ownedContentList.value.length
			} catch (err) {
				console.error(err)
        AlertService.ShowSimpleAlert(new SimpleAlertItem(err.message ?? err, SimpleAlertType.error, 'Could not load'))
			}
		}

		onMounted(async () => {
			if(userSignedIn) {
				await loadOwnedContent()
			}
		})

		return {
			router,
			hasContent,
			userSignedIn,
			ownedContentList,
			loadOwnedContent,
		}
	}
})
</script>
