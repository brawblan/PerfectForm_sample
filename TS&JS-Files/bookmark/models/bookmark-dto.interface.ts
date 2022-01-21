import {IPlanDto} from '@/services/plan/models/plan-dto.interface'
import {ICoachDto} from '@/services/bookmark/models/coach-dto.interface'

export interface IBookmarkDto {
  coach: ICoachDto | null
  exercise_plan: IPlanDto | null
  id: string
  is_bookmarked: boolean
  meal_plan: null
}
