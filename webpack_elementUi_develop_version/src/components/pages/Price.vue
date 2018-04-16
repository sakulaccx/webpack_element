<style scoped>
    @import '../../assets/styles/price.css';
</style>
<template>
    <div>
        <el-card style="width: 420px">
            <div class="body-content">
                <div class="title-wrap">
                    <div class="main-title">一张机票</div>
                    <div class='line-mark'></div>
                    <div class='sub-title'>中国往返</div>
                </div>
                <div class="target-wrap" @click="dialogTargetVisible = true">
                    <div class="flex-target" v-for="item in target">
                        <div class="img-show">
                            <img :src="item.url" />
                        </div>
                        <div class="title-show">{{item.title}}</div>
                        <div class="price-show">
                            ￥{{item.price}}*
                            <span>起</span>
                        </div>
                        <div class="btn">立即预订</div>
                    </div>                  
                </div>
                <div class="product-wrap" @click="dialogProductVisible = true">
                    <div class="product-item" v-for="item in product">
                        <div class="img-box">
                            <img :src="item.url" />
                        </div>
                        <div class="pos-div">
                            <div class="product-title-show">{{item.title}}</div>
                            <div class="product-price-show">
                                <span>{{item.subtitle}}</span>
                                <span>￥{{item.price}}*</span>                                
                            </div>
                        </div>                        
                    </div>                  
                </div>
                <div class="no-tax">*不含税，条款细则适用</div>
            </div>
        </el-card>

        <!--target Dialog -->
        <el-dialog :visible.sync="dialogTargetVisible" class="favorite-opt">
            <template v-for="(item, index) in target">
                <el-row style="margin-top: 30px;" :gutter="20">
                    <el-col :span="18">
                        <h6 class='input-title'>目的地:</h6>
                        <el-input ref="targetTitle" :value="item.title" placeholder="请输入文字"></el-input>
                        <h6 class='input-title'>价格:</h6>
                        <el-input-number :controls="false" ref="targetPrice" :value="item.price" placeholder="请输入金额"></el-input-number>
                        <h6 class='input-title'>"立即预订"的链接地址:</h6>
                        <el-input ref="targetLink" :value="item.link" placeholder="请输入链接地址"></el-input>
                        <el-button class="save-url" type="primary" @click="submitTargetOpt(item,index)">保存修改</el-button>
                    </el-col>
                    <el-col :span="6">
                        <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                        <el-upload :action="`/cms/fileUpLoad/upload3`"
                                   :data="{id:item.id,path:imgPathIp}"
                                   :headers="imgUploadHeader"
                                   :on-success="updateImageUrl"
                                   :show-file-list="false"
                                   class="avatar-uploader">
                            <img v-if="item.url" :src="item.url" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <h6 class='notice-title'>请注意保持图片比例一致</h6>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>

        <!--target Dialog -->
        <el-dialog :visible.sync="dialogProductVisible" class="favorite-opt">
            <template v-for="(item, index) in product">
                <el-row style="margin-top: 30px;" :gutter="20">
                    <el-col :span="16">
                        <h6 class='input-title'>标题:</h6>
                        <el-input ref="productTitle" :value="item.title" placeholder="请输入文字"></el-input>
                        <h6 class='input-title'>小标题:</h6>
                        <el-input ref="productSubTitle" :value="item.subtitle" placeholder="请输入文字"></el-input>
                        <h6 class='input-title'>价格:</h6>
                        <el-input-number :controls="false" ref="productPrice" :value="item.price" placeholder="请输入金额"></el-input-number>
                        <h6 class='input-title'>点击后跳转的链接地址:</h6>
                        <el-input ref="productLink" :value="item.link" placeholder="请输入链接地址"></el-input>
                        <el-button class="save-url" type="primary" @click="submitProductOpt(item,index)">保存修改</el-button>
                    </el-col>
                    <el-col :span="8">
                        <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                        <el-upload :action="`/cms/fileUpLoad/upload3`"
                                   :data="{id:item.id,path:imgPathIp}"
                                   :headers="imgUploadHeader"
                                   :on-success="updateImageUrl"
                                   :show-file-list="false"
                                   class="avatar-uploader">
                            <img v-if="item.url" :src="item.url" class="avatar" style="width: 100%;">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <h6 class='notice-title'>请注意保持图片比例一致</h6>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>
    </div>
</template>


<script>
    import config from '../../config/config'
    import axios from 'axios'

    export default {
        data() {
            return {
                dialogTargetVisible: false,
                dialogProductVisible: false,
                apiToken: localStorage.getItem('token'),
                tempId: "",
                imgPathIp: "",
                target: [],
                product: [],
                targetName: "",
                productName: "",
                imgPathIp: "https://airnz.mcomp.com.cn/images/",
                imgUploadHeader: {
                    //'X-Token': sessionStorage.getItem('token'),
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                }
            }
        },
        methods: {
            getData() {
                this.$http.post('/cms/order/findOrderByFilter?jsonFilter=%7B%7D').then(res => {}, res => {
                    if(res.data.code == 1){
                        var _that = this;
                        var new_data = res.data.object;
                        _that.target = [];
                        _that.product = [];
                        new_data.forEach(function(item,i){
                            if(item.type == 1){
                                _that.target.push(item);
                            } else {
                                _that.product.push(item);
                            }
                        });
                    }
                });
            },
            saveTempId(id){
                this.tempId = id;
            },
            updateImageUrl(e,file,fileList) {
                this.getData();
            },
            submitTargetOpt(obj,id){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/order/createOrUpdateOrder',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        title: _that.$refs.targetTitle[id].$refs.input.value,
                        subtitle: "",
                        url: obj.url,
                        link: _that.$refs.targetLink[id].$refs.input.value,
                        price: _that.$refs.targetPrice[id].$refs.input.value,
                        type: "1"
                    })
                })
                .then(function(res){
                }, function(res){
                    _that.getData()
                })
                .catch(function(error){});
            },
            submitProductOpt(obj,id){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/order/createOrUpdateOrder',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        title: _that.$refs.productTitle[id].$refs.input.value,
                        subtitle: _that.$refs.productSubTitle[id].$refs.input.value,
                        url: obj.url,
                        link: _that.$refs.productLink[id].$refs.input.value,
                        price: _that.$refs.productPrice[id].$refs.input.value,
                        type: "2"
                    })
                })
                .then(function(res){
                }, function(res){
                    _that.getData()
                })
                .catch(function(error){});
            }
        },
        created() {
            this.getData();
        }
    }
</script>
