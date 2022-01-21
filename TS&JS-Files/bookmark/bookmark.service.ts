import axios from 'axios';
import {Bookmark} from '@/services/bookmark/models/bookmark.class';
import {CommonValidators} from '@/utilities/validation/common-validators.class';
import {IBookmarkDto} from '@/services/bookmark/models/bookmark-dto.interface';
import {IGetBookmarkedPlansResponse} from '@/services/bookmark/get-bookmarked-plans/get-bookmarked-plans-response.interface';
import {IGetBookmarkedCoachesResponse} from '@/services/bookmark/get-bookmarked-coaches/get-bookmarked-coaches-response.interface';
import {BookmarkType} from '@/services/bookmark/models/bookmark.type';
import {CoachService} from '@/services/coach/coach.service'
import {PlanService} from '@/services/plan/plan.service'
import {Coach} from '@/services/coach/models/coach.class'
import {Plan} from '@/services/plan/models/plan.class'
import {LocalizationService} from '@/services/localization/localization-service/localization.service'
import {ICoachDto} from '@/services/bookmark/models/coach-dto.interface'
import {FileService} from '@/services/file/file.service'

export class BookmarkService {
  static CoachFromDto = (dto: ICoachDto) => {
    return new Coach(
        dto.id,
        '',
        '',
        dto.first_name,
        dto.last_name,
        '',
        undefined,
        undefined,
        undefined,
        dto.specialties,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        dto.images.map((x) => FileService.fromDto(x)),
        dto.rating,
        dto.videos?.map((x) => FileService.fromDto(x))
    )
  }
  static BookmarkFromDto = (dto: IBookmarkDto) => {
    return new Bookmark(
      !!dto.coach ? BookmarkService.CoachFromDto(dto.coach) : null,
      !!dto.exercise_plan ? PlanService.PlanFromDto(dto.exercise_plan) : null,
      dto.id,
      dto.is_bookmarked
    )
  }

  static GetBookmarkedPlans = async () => {
    const endpoint = '/bookmark/by_filter'
    const payload = {
      filter: {
        show_exercise_plans: true
      }

    }

    try {
      const response = (await axios.post(endpoint, payload)).data as IGetBookmarkedPlansResponse
      const {data} = response

      return data.map((x) => BookmarkService.BookmarkFromDto(x))
    } catch (error) {
      throw new Error(
        error?.message
        ?? error?.response?.data?.errors?.detail
        ?? error?.message
        ?? CommonValidators.Errors.unknown
      )
    }
  }

  static GetBookmarkedCoaches = async () => {
    const endpoint = '/bookmark/by_filter'
    const payload = {
      filter: {
        show_coaches: true
      }
    }

    try {
      const response = (await axios.post(endpoint, payload)).data as IGetBookmarkedCoachesResponse
      const {data} = response

      return data.map((x) => BookmarkService.BookmarkFromDto(x))
    } catch (error) {
      throw new Error(
        error?.message
        ?? error?.response?.data?.errors?.detail
        ?? error?.message
        ?? CommonValidators.Errors.unknown
      )
    }
  }

  static toggleBookmark = async (request: string | undefined, toggleType: BookmarkType) => {
    const id = request
    const payloadType = toggleType
    const endpoint = '/bookmark/toggle'
    const payload = {
      bookmark: {
        [payloadType]: id
      }
    }

    try {
      const response = (await axios.post(endpoint, payload)).data as IBookmarkDto
      return response
    } catch (error) {
      throw new Error(
        error?.message
        ?? error?.response?.data?.errors?.detail
        ?? error?.message
        ?? CommonValidators.Errors.unknown
      )
    }
  }
}
