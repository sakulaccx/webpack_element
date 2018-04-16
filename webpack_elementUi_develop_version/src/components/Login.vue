<template>
    <el-row style="margin-top: 30px">        
        <el-col :span="6" :offset="9" style="margin-top: 100px">
            <div style="text-align: center;"><img style="width: 60px;" src="../assets/img/logo.png" /></div>
            <div style="text-align: center">
                <h2></h2>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-with="80px">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户">
                        <template slot="prepend">
                            <i class="fa fa-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码">
                        <template slot="prepend">
                            <i class="fa fa-lock"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-alert v-if="error" :title="error" type="error" style="margin-top: -10px; margin-bottom: 10px"
                              show-icon></el-alert>
                    <el-button type="primary" :loading="loading" @click="handleSubmit" style="width: 100%">登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {
            ElCol,
            ElRow
        },
        data() {
            return {
                loading: false,
                error: '',
                form: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                this.error = '';
                this.$refs['form'].validate(pass => {
                    if (!pass) {
                        return false
                    }
                    this.loading = true;

                    var send_info = {
                        username: this.form.username,
                        password: this.form.password
                    };

                    this.$http.post('/user/login', this.$querystring.stringify(send_info)).then(res => {
                    }, res => {
                        if(res.data.code == 1){
                            sessionStorage.setItem('token', res.data.object);
                            // sessionStorage.setItem('is_supper', false);
                            sessionStorage.setItem('nickname', "admin");
                            this.$router.push('/pages/home');
                        } else {
                            this.error = res.result;
                        }
                    }).finally(() => this.loading = false)
                })
            }
        },
        watch: {
            form: {
                handler: function () {
                    this.error = ''
                },
                deep: true
            }
        }
    }
</script>