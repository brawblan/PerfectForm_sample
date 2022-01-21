import {IFileDto} from '@/services/file/file-dto.interface';

export interface ICoachDto {
  first_name: string
  id: string
  images: Array<IFileDto>
  last_name: string
  rating: number
  specialties: Array<string>
  videos?: Array<IFileDto>
}
