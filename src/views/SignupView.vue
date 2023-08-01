<script setup lang="ts">
import { ref, reactive } from 'vue'
import router from '../router/index'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '../stores/user'
import { error } from '../utils/logger'

const userStore = useUserStore()

const form = reactive<SignupForm>({
  nickname: '',
  username: '',
  password: '',
  verifyPassword: '',
  email: '',
})
const refForm = ref<FormInstance>()
const rules = reactive<FormRules<SignupForm>>({
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
  email: [{ type: 'email', trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      userStore.signup(form).then(() => {
        ElMessage.success('注册成功')
        router.back()
      })
    } else {
      error('error submit!', fields)
    }
  })
}

function validatorVerifyPassword(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入校验密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

function handleCancel() {
  router.back()
}
</script>
<template>
  <div class="flex justify-center w-full p-20">
    <el-form :model="form" :rules="rules" label-width="8rem" label-position="left" ref="refForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" :show-password="true" />
      </el-form-item>
      <el-form-item label="确认密码" prop="verifyPassword">
        <el-input v-model="form.verifyPassword" type="password" :show-password="true" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" />
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
