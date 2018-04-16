<template>
    <div>
        <el-row>
            <el-col :span="8" :offset="16" style="text-align: right">
                <el-button type="primary" icon="plus" @click="initForm(); dialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" v-loading="tableLoading" style="margin-top: 20px">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="last_login" label="最近登录"></el-table-column>
            <el-table-column label="启用状态">
                <template scope="scope">
                    <el-switch v-model="scope.row.is_active"
                               @change="toggleCommit(scope.row)"
                               on-color="#13ce66" off-color="#ff4949"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button type="primary" size="small" icon="edit" @click="editOpen(scope.row)"></el-button>
                    <!--<el-button v-if="scope.row.is_active" type="danger" size="small" icon="delete"-->
                               <!--:loading="btnToggleLoading[scope.row.id]"-->
                               <!--@click="toggleCommit(scope.row)">禁用-->
                    <!--</el-button>-->
                    <!--<el-button v-else type="success" size="small" icon="delete"-->
                               <!--:loading="btnToggleLoading[scope.row.id]"-->
                               <!--@click="toggleCommit(scope.row)">启用-->
                    <!--</el-button>-->
                    <el-button type="warning" size="small" :loading="btnResetLoading[scope.row.id]"
                               @click="resetPassword(scope.row)">重置密码
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row v-if="pageTotal > pageSize">
            <el-row :span="16" :offset="8" style="text-align: right; margin-top: 15px">
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handlePageChange"
                               style="padding: 0" :page-sizes="[10, 20, 30]"
                               :page-size="pageSize" layout="sizes, prev, pager, next"
                               :total="pageTotal"></el-pagination>
            </el-row>
        </el-row>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="form" label-position="left" label-width="100px">
                <el-form-item label="账户名称">
                    <el-input v-model="form.username" placeholder="请输入账户名称"></el-input>
                </el-form-item>
                <el-form-item label="账户昵称">
                    <el-input v-model="form.nickname" placeholder="请输入账户昵称"></el-input>
                </el-form-item>
                <el-form-item v-if="!form.id" label="账户密码">
                    <el-input v-model="form.password" placeholder="请输入账户密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCommit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableLoading: false,
                dialogVisible: false,
                btnSaveLoading: false,
                btnToggleLoading: {},
                btnResetLoading: {},
                tableData: [],
                dialogTitle: '',
                searchString: '',
                form: {},
                pageNumber: 1,
                pageSize: 10,
                pageTotal: 0,
            }
        },
        computed: {
            query() {
                return {page: this.pageNumber, size: this.pageSize};
            }
        },
        methods: {
            initForm() {
                this.dialogTitle = '添加账户';
                this.form = {}
            },
            fetch() {
                this.tableLoading = true;
                this.$http.get('/api/accounts/', {params: this.query}).then(res => {
                    this.tableData = res.result.data;
                    this.pageTotal = res.result.total
                }, res => this.$layer_message(res.result)).finally(() => this.tableLoading = false)
            },
            editOpen(row) {
                this.form = this.$deepCopy(row);
                this.dialogTitle = '编辑 - ' + row.nickname;
                this.dialogVisible = true
            },
            saveCommit() {
                this.btnSaveLoading = true;
                let request = undefined;
                if (this.form.id) {
                    request = this.$http.put(`/api/accounts/${this.form.id}/`, this.form)
                } else {
                    request = this.$http.post('/api/accounts/', this.form)
                }
                request.then(() => {
                    this.dialogVisible = false;
                    this.fetch()
                }, res => this.$layer_message(res.result)).finally(() => this.btnSaveLoading = false)
            },
            toggleCommit(row) {
                let action = (row.is_active) ? '启用' : '禁用';
                this.btnToggleLoading = {[row.id]: true};
                this.$http.post(`/api/accounts/${row.id}/toggle/`).then(() => {
                    this.fetch()
                }, res => this.$layer_message(res.result)).finally(() => this.btnToggleLoading = {})
            },
            resetPassword(row) {
                console.log('click');
                this.$prompt('请输入新密码', '提示', {
                    inputPattern: /.+/,
                    inputErrorMessage: '请输入新密码'
                }).then(({value}) => {
                    this.$http.post(`/api/accounts/${row.id}/reset_password/`, {new_password: value}).then(() => {
                        this.$layer_message('重置密码成功', 'success');
                    }, res => this.$layer_message(res.result))
                }).catch(() => {
                })
            },
            handlePageChange(page) {
                this.pageNumber = page;
                this.fetch()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.fetch()
            }
        },
        created() {
            this.fetch()
        }
    }
</script>