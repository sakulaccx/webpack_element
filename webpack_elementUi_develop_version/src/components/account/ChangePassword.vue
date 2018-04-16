<template>
    <div style="width: 350px">
        <el-form :model="form" label-width="80px">
            <el-form-item label="原密码">
                <el-input type="password" v-model="form.old_password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input type="password" v-model="form.new_password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input type="password" v-model="form.confirm_password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="btnLoading" @click="handleCommit">修改密码</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import config from '../../config/config'
    import axios from 'axios'
    export default {
        data() {
            return {
                btnLoading: false,
                form: {
                    old_password: "",
                    new_password: "",
                    confirm_password: ""
                }
            }
        },
        methods: {
            handleCommit() {
                if(this.form.old_password.length == 0){
                    this.$layer_message('请输入原密码',"error",2000);
                    return false;
                } else if(this.form.new_password.length == 0){
                    this.$layer_message('请输入新密码',"error",2000);
                    return false;
                } else if (this.form.new_password !== this.form.confirm_password) {
                    this.$layer_message('两次输入密码不一致',"error",2000);
                    return
                } else {
                    this.btnLoading = true;
                    var send_data = {
                        userId: "1",
                        newPassword: this.form.new_password,
                        oldPassword: this.form.old_password
                    };
                    
                    var _that = this;
                    axios({
                        url: "/user/update/"+send_data.userId+"/"+send_data.newPassword+"/"+send_data.oldPassword,
                        method: "post",
                        // data: JSON.stringify({
                        //     userId: send_data.userId,
                        //     newPassword: send_data.newPassword,
                        //     oldPassword: send_data.oldPassword
                        // })
                    }).then(function(res){},function(res){
                        if(res.data.code == 1){
                            _that.$layer_message('密码修改成功','success',500);
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('userId');
                            _that.$router.push({name: 'login'});
                        } else {
                            _that.$layer_message(res.data.result,"error",2000)
                        }
                    }).finally(function(res){
                        _that.$layer_message(res.data.result,"error",2000)
                    });
                    // var targetUri = '/api/webstart/xaCmsUser/update/' + send_data.userId + "/" + send_data.newPassword + "/" + send_data.oldPassword;
                    // this.$http.post(targetUri).then(() => {
                        
                    // }, res => {
                    //     if(res.data.status == 1){
                    //         this.$layer_message('密码修改成功','success',500);
                    //         this.$http.get('/api/webstart/user/logout/').finally(() => {
                    //             localStorage.removeItem('token');
                    //             localStorage.removeItem('userId');
                    //             this.$router.push({name: 'login'})
                    //         })
                    //     } else {
                    //         this.$layer_message(res.data.result,"error",2000)
                    //     }
                        
                        
                    // }).finally(() => this.btnLoading = false)
                }
                
            }
        }
    }
</script>