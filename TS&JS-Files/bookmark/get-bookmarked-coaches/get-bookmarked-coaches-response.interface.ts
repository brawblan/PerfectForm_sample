import {IBookmarkDto} from '@/services/bookmark/models/bookmark-dto.interface';

export interface IGetBookmarkedCoachesResponse {
  data: Array<IBookmarkDto>
}