import {IBookmarkDto} from '@/services/bookmark/models/bookmark-dto.interface';

export interface IGetBookmarkedPlansResponse {
  data: Array<IBookmarkDto>
}
