import { ElNotification } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import { ElLoading } from 'element-plus'


const warning = ( title , message ) => {
    ElNotification({
        title ,
        message ,
        type: 'warning'
      })
}

const confirmBox = ( msg , title ) => {

  ElMessageBox.alert(msg, title, {
    confirmButtonText: 'OK',
  })
}

const loading = ( text ) => {

const loading = ElLoading.service({
    lock: true,
    text: text ,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 1000)
}

export {
    warning,
    confirmBox,
    loading
}