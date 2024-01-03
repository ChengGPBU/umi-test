import { message, Modal, Upload } from 'antd'
import { useEffect, useState } from 'react'
import './index.less'

import pic from './images/pic.png'

const ImageUpload = ({
  name,
  imgFileList,
  maxLength = 1,
  fileChange,
  uploadUrl,
  accept = 'image/*',
  customSize = {
    webp: 500,
    other: 200
  }
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    const imgList = []
    // let index = 0;
    imgFileList &&
      imgFileList.split(',').forEach((item, index) => {
        console.log(index)
        imgList.push({
          uid: index,
          url: item
        })
        // index++;
      })
    setFileList(imgList)
  }, [imgFileList])

  const handlePreview = (file) => {
    setPreviewOpen(true)
    setPreviewImage(file.url || file.thumbUrl || file.preview)
  }

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    console.log('ImageUpload.handleChange', newFileList)
    if (newFileList.length > 0 && newFileList[0].status === 'error') {
      message.error('图片上传失败')
      return
    } else if (newFileList.length === 0) {
      fileChange([])
    }
    if (fileChange) {
      fileChange(newFileList)
    }
  }

  const handleCancel = () => {
    setPreviewOpen(false)
  }

  const uploadButton = (
    <div className='uploadDiv'>
      <img src={pic} className='uploadImage' />
      {/* <Button>选择文件</Button> */}
    </div>
  )

  const beforeUpload = (file) => {
    const isWebp = file.type === 'image/webp'
    const isGif = file.type === 'image/gif'
    const maxSize = isWebp ? customSize.webp : isGif ? 500 : customSize.other
    const fileSize = file.size / 1024
    console.log('fileSize:', fileSize)
    if (isWebp && fileSize > maxSize) {
      // WebP 格式的文件大小不能超过500KB
      console.error('webp格式的图片大小不能大于500K')
      return Upload.LIST_IGNORE
    }

    if (!isWebp && fileSize > maxSize) {
      // 非WebP 格式的文件大小不能超过200KB
      message.error('非webp格式的图片大小不能大于200K')
      return Upload.LIST_IGNORE
    }

    return true
  }

  return (
    <>
      <Upload
        beforeUpload={beforeUpload}
        name={name}
        action={uploadUrl}
        listType='picture-card'
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        accept={accept}
        className='imageUploadComponent'
      >
        {fileList && fileList.length >= maxLength ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default ImageUpload
