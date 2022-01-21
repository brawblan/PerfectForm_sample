import * as UpChunk from '@mux/upchunk'
import axios from 'axios'

export class MuxService {
  static GetUploadUrl = async (idType, typeId) => {
    const endpoint = '/uploads/new_video'
    const payload = {
      [idType]: typeId // idType = what the video is attached to. is it a plan? exercise? etc.
    }
    
    try {
      const response = (await axios.post(endpoint, payload)).data.data
      return response
    } catch (error) {
      console.error(error)
    }
  }

  static UploadVideoToMux = (uploadUrl, videoFile) => {
    const upload = UpChunk.createUpload({
      endpoint: uploadUrl,
      file: videoFile,
      chunkSize: 5120,
      retries: 2
    });
    
    return upload
  }

  static RemoveVideo = async (videoId) => {
    const endpoint = '/uploads/remove_video'
    const payload = {
      upload_video: {
        id: videoId
      }
    }

    try {
      const response = await axios.post(endpoint, payload)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  static GetVideoById = async (videoId) => {
    const endpoint = `/uploads/by_video_id/${videoId}`

    try {
      const response = await axios.get(endpoint)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  static CancelVideoUpload = async (videoId) => {
    const endpoint = `/uploads/cancel/${videoId}`

    try {
      const response = await axios.get(endpoint)
      return response
    } catch (error) {
      console.error(error)
    }
  }
}
