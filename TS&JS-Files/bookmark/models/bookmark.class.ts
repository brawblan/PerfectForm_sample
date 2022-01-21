import {Coach} from '@/services/coach/models/coach.class'
import {Plan} from '@/services/plan/models/plan.class'

export class Bookmark {
  constructor(
    public coach: Coach | null,
    public exercisePlan: Plan | null,
    public id: string,
    public isBookmarked: boolean
  ) {}
}
