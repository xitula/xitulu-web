<script setup lang="ts">
import { ref, reactive } from 'vue'
import router from '../router/index'
import { ElMessage } from 'element-plus'
import type {
  UploadProps,
  UploadUserFile,
  FormInstance,
  UploadInstance,
  FormRules,
} from 'element-plus'
import { useUserStore } from '../stores/user'
import { error } from '../utils/logger'
import config from '../constants/config.json'

const userStore = useUserStore()

// 注册用户表单数据
const form = reactive<SignupForm>({
  avatarUrl: '',
  // 昵称
  nickname: '',
  // 用户名
  username: '',
  // 密码
  password: '',
  // 校验密码
  verifyPassword: '',
  // 邮箱地址
  email: '',
})
// 表单实例引用
const refForm = ref<FormInstance>()
//校验规则
const rules: FormRules<SignupForm> = {
  nickname: [{ min: 2, max: 20, message: '昵称长度为2~20字符', trigger: 'blur' }],
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 5, max: 20, message: '用户名长度为5~20字符', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]+$/, message: '用户名只能包含大小写英文或数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 8, max: 24, message: '密码长度为8~24字符', trigger: 'blur' },
    {
      pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,24}$/,
      message: '必须包含大小写字母和数字的组合',
      trigger: 'blur',
    },
  ],
  verifyPassword: [
    { required: true, message: '校验密码不能为空', trigger: 'blur' },
    { validator: validatorVerifyPassword, trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    { type: 'email', message: '不是有效的邮箱地址', trigger: 'blur' },
  ],
}
// 上传接口地址
const actionUrl = `${config.apiHost}:${config.apiPort}/upload/avatar`
// 上传组件实例引用
const uploadRef = ref<UploadInstance>()
// 上传组件文件列表
const fileList = ref<UploadUserFile[]>([])
// 头像上传loading
const avatarUploadLoading = ref<boolean>(false)

/**
 * 上传进程中处理
 * @param {UploadProps['onProgress']} e 进度事件
 */
const handleProgress: UploadProps['onProgress'] = (e) => {
  const { percent } = Object(e)
  if (percent !== 100) {
    avatarUploadLoading.value = true
  } else {
    avatarUploadLoading.value = false
  }
}

/**
 * 上传成功处理
 * @param {UploadProps['onSuccess']} response
 */
const handleSuccess: UploadProps['onSuccess'] = (response) => {
  const { code, message, data } = Object(response)
  if (code !== 0) {
    ElMessage({
      type: 'error',
      message: 'API上传错误:' + message,
    })
    uploadRef.value.clearFiles()
  } else {
    const { path, filename } = Object(data)
    form.avatarUrl = `${config.apiHost}:${config.apiPort}${path}${filename}`
  }
}

/**
 * 上传失败处理
 * @param {UploadProps['onError']} response
 */
const handleError: UploadProps['onError'] = (response) => {
  ElMessage({
    type: 'error',
    message: '上传错误:' + response,
  })
  uploadRef.value.clearFiles()
}

/**
 * 提交校验与执行方法
 * @param formEl 表单实例
 */
async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      userStore.signup(form).then(() => {
        ElMessage.success('注册成功')
        router.back()
      })
    } else {
      error('校验未通过:', fields)
    }
  })
}

/**
 * 校验两次输入的密码是否相同
 * @param rule
 * @param value
 * @param callback
 */
function validatorVerifyPassword(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入校验密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

/**
 * 取消注册并返回上一页
 */
function handleCancel() {
  router.back()
}
</script>

<template>
  <div class="flex justify-center w-full p-20">
    <el-form :model="form" :rules="rules" label-width="8rem" label-position="left" ref="refForm">
      <el-form-item class="flex justify-start align-center" label="头像" prop="avatarUrl">
        <el-avatar size="50" :src="form.avatarUrl" v-loading="avatarUploadLoading" />
        <el-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          class="upload-demo"
          :action="actionUrl"
          :limit="1"
          :show-file-list="false"
          accept="image/*"
          @success="handleSuccess"
          @error="handleError"
          @progress="handleProgress"
        >
          <el-button type="primary">选择头像</el-button>
          <template #tip>
            <div class="el-upload__tip">支持jpg/png格式，最大限制1MB.</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" :show-password="true" />
      </el-form-item>
      <el-form-item label="确认密码" prop="verifyPassword">
        <el-input v-model="form.verifyPassword" type="password" :show-password="true" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(refForm)" :loading="userStore.signupLoading"
          >注册</el-button
        >
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
