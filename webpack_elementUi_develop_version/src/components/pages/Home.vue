<style scoped>
    @import '../../assets/styles/homepage.css';
</style>
<template>
    <div>
        <el-card style="width: 420px">
            <div class="body-content">
                <div class="top">
                    <img src="../../assets/img/top.jpg" />
                </div>
                <div class="swiper-box"  @click="dialogBannerVisible = true">
                    <el-carousel height="180px">
                      <el-carousel-item v-for="(item, index) in banners" :key="index">
                        <img :src="item.url">
                      </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="categories-wrap" @click="dialogCategoryVisible = true">
                    <el-row :gutter="20">
                        <template v-for="item in categories">
                            <el-col :span="8">
                                <div class="cate-text">
                                    {{item.title}}
                                    <div class="cate-underline"></div>
                                </div>
                                <div class="cate-img">
                                    <img :src="item.url">
                                </div>
                            </el-col>
                        </template>
                    </el-row>
                </div>
                <div class="favorite-wrap" @click="dialogFavoriteVisible = true">
                    <el-row :gutter="20" class="favorite-box">
                        <template v-for="item in favoriteArr">
                            <el-col :span="12" class="favorite-item">
                                <div class="favorite-title">{{item.title}}</div>
                                <div class="favorite-subtitle">{{item.subtitle}}</div>
                                <div class="favorite-img">
                                    <img :src="item.url" />
                                </div>
                            </el-col>
                        </template>
                    </el-row>
                </div>
                <div class="product-wrap" @click="dialogProduct1Visible = true">
                    <el-row :gutter="20" class="inner-wrap" style="margin: 0;">
                        <el-col :span="16" style="padding-left: 0;">
                            <div class="product-img">
                                <img :src="product[0].url">
                            </div>
                        </el-col>
                        <el-col :span="8" class="right-prdocut-desc">
                            <div class="product-desc">
                                <div class="up-title">
                                    <div>{{product[0].title}}</div>
                                    <div>{{product[0].subtitle}}</div>
                                </div>
                                <div class="space-line"></div>
                                <div class="down-title">
                                    <div>{{product[0].description}}</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="product-wrap" @click="dialogProduct2Visible = true">
                    <el-row :gutter="20" class="inner-wrap" style="margin: 0;">
                        <el-col :span="16" style="padding-left: 0;">
                            <div class="product-img">
                                <img :src="product[1].url">
                            </div>
                        </el-col>
                        <el-col :span="8" class="right-prdocut-desc">
                            <div class="product-desc">
                                <div class="up-title">
                                    <div>{{product[1].title}}</div>
                                    <div>{{product[1].subtitle}}</div>
                                </div>
                                <div class="space-line"></div>
                                <div class="down-title">
                                    <div>{{product[1].description}}</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="map-wrap" @click="dialogMapVisible = true">
                    <img :src="map[0].url">
                </div>
                <div class="honour-wrap" @click="dialogProfileVisible = true">
                    <el-row :gutter="20">
                        <el-col :span="6" class="profile-img">
                            <div>
                                <img :src="profile[0].url" />
                            </div>
                        </el-col>
                        <el-col :span="18">
                            <h4 class="honour-title">{{profile[0].title}}</h4>
                            <div class="honour-desc">{{profile[0].description}}</div>
                        </el-col>
                    </el-row>
                </div>
                <div class="start-now">
                    <div @click="dialogStartVisible = true">
                        <img :src="startnow[0].url" />
                    </div>
                </div>
            </div>
        </el-card>

        <!--Banner Dialog-->
        <el-dialog :visible.sync="dialogBannerVisible" class="banner-opt">
            <template v-for="(item, index) in banners">
                <el-row style="margin-top: 20px" :gutter="20">
                    <!-- <el-col :span="16">
                        <div>
                            <h6 class='input-title'>跳转链接:</h6>
                            <el-input ref="bannerLink" :value="item.link" placeholder="点击后对应的跳转链接地址" ></el-input>
                        </div>
                        <el-button class="save-url" type="primary" @click="submitBannerUrl(item,index)">保存修改</el-button>
                    </el-col> -->
                    <el-col :span="8">
                        <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                        <el-upload :action="`/cms/fileUpLoad/upload2`"
                                   :data="{categoryId:item.id,path:imgPathIp,cname:bannerName}"
                                   :headers="imgUploadHeader"
                                   :on-success="updateImageUrl"
                                   :show-file-list="false"
                                   accept=".jpg,.png"
                                   class="avatar-uploader">
                            <img v-if="item.url" :src="item.url" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <h6 class='notice-title'>请注意保持图片比例一致</h6>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>

        <!--Category Dialog-->
        <el-dialog :visible.sync="dialogCategoryVisible" class="category-opt">
            <template v-for="(item, index) in categories">
                <el-row style="margin-top: 20px" :gutter="20">
                    <el-col :span="17">
                        <h6 class='input-title'>目录名称:</h6>
                        <el-input ref="categoryTitle" :value="item.title" placeholder="请输入名称"></el-input>
                        <!-- <h6 class='input-title'>点击后跳转的链接地址:</h6>
                        <el-input ref="categoryLink" :value="item.link" placeholder="请输入链接地址"></el-input> -->
                        <el-button class="save-url" type="primary" @click="submitCategoryName(item,index)">保存修改</el-button>
                    </el-col>
                    <el-col :span="7">
                        <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                        <el-upload :action="`/cms/fileUpLoad/upload2`"
                                   :data="{categoryId:item.id,path:imgPathIp,cname:categoryName}"
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

        <!--Product1 Dialog-->
        <el-dialog :visible.sync="dialogProduct1Visible" class="product-opt">
            <el-row :gutter="20">
                <el-col :span="15">
                    <h6 class='input-title'>第一行文字:</h6>
                    <el-input ref="productTitle" :value="product[0].title" placeholder="请输入文字"></el-input>
                    <h6 class='input-title'>第二行文字:</h6>
                    <el-input ref="productSubtitle" :value="product[0].subtitle" placeholder="请输入文字"></el-input>
                    <h6 class='input-title'>第三行文字:</h6>
                    <el-input ref="productDesc" :value="product[0].description" placeholder="请输入文字"></el-input>
                    <!-- <h6 class='input-title'>点击后跳转的链接地址:</h6>
                    <el-input ref="productLink" :value="product[0].link" placeholder="请输入链接地址"></el-input> -->
                    <el-button class="save-url" type="primary" @click="submitProductOpt(product[0])">保存修改</el-button>
                </el-col>
                <el-col :span="9">
                    <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                    <el-upload :action="`/cms/fileUpLoad/upload2`"
                               :data="{categoryId:product[0].id,path:imgPathIp,cname:productName}"
                               :headers="imgUploadHeader"
                               :on-success="updateImageUrl"
                               :show-file-list="false"
                               class="avatar-uploader">
                        <img v-if="product[0].url" :src="product[0].url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <h6 class='notice-title'>请注意保持图片比例一致</h6>
                </el-col>
            </el-row>
        </el-dialog>

        <!--Favorite Dialog -->
        <el-dialog :visible.sync="dialogFavoriteVisible" class="favorite-opt">
            <template v-for="(item, index) in favoriteArr">
                <el-row style="margin-top: 30px;" :gutter="20">
                    <el-col :span="18">
                        <h6 class='input-title'>第一行文字:</h6>
                        <el-input ref="favoriteTitle" :value="item.title" placeholder="请输入文字"></el-input>
                        <h6 class='input-title'>第二行文字:</h6>
                        <el-input ref="favoriteSubtitle" :value="item.subtitle" placeholder="请输入文字"></el-input>
                        <!-- <h6 class='input-title'>点击后跳转的链接地址:</h6>
                        <el-input ref="favoriteLink" :value="item.link" placeholder="请输入链接地址"></el-input> -->
                        <el-button class="save-url" type="primary" @click="submitFavoriteOpt(item,index)">保存修改</el-button>
                    </el-col>
                    <el-col :span="6">
                        <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                        <el-upload :action="`/cms/fileUpLoad/upload2`"
                                   :data="{categoryId:item.id,path:imgPathIp,cname:favoriteName}"
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

        <!--Product2 Dialog-->
        <el-dialog :visible.sync="dialogProduct2Visible" class="product-opt">
            <el-row :gutter="20">
                <el-col :span="15">
                    <h6 class='input-title'>第一行文字:</h6>
                    <el-input ref="productTitle" :value="product[1].title" placeholder="请输入文字"></el-input>
                    <h6 class='input-title'>第二行文字:</h6>
                    <el-input ref="productSubtitle" :value="product[1].subtitle" placeholder="请输入文字"></el-input>
                    <h6 class='input-title'>第三行文字:</h6>
                    <el-input ref="productDesc" :value="product[1].description" placeholder="请输入文字"></el-input>
                    <!-- <h6 class='input-title'>点击后跳转的链接地址:</h6>
                    <el-input ref="productLink" :value="product[1].link" placeholder="请输入链接地址"></el-input> -->
                    <el-button class="save-url" type="primary" @click="submitProductOpt(product[1])">保存修改</el-button>
                </el-col>
                <el-col :span="9">
                    <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                    <el-upload :action="`/cms/fileUpLoad/upload2`"
                               :data="{categoryId:product[1].id,path:imgPathIp,cname:productName}"
                               :headers="imgUploadHeader"
                               :on-success="updateImageUrl"
                               :show-file-list="false"
                               class="avatar-uploader">
                        <img v-if="product[1].url" :src="product[1].url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <h6 class='notice-title'>请注意保持图片比例一致</h6>
                </el-col>
            </el-row>
        </el-dialog>

        <!--Map Dialog-->
        <el-dialog :visible.sync="dialogMapVisible" class="map-opt">
            <el-row :gutter="20">
                <el-col :span="10">
                    <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                    <el-upload :action="`/cms/fileUpLoad/upload2`"
                               :data="{categoryId:map[0].id,path:imgPathIp,cname:mapName}"
                               :headers="imgUploadHeader"
                               :on-success="updateImageUrl"
                               :show-file-list="false"
                               class="avatar-uploader">
                        <img v-if="map[0].url" :src="map[0].url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <h6 class='notice-title'>请注意保持图片比例一致</h6>
                </el-col>
            </el-row>
        </el-dialog>

        <!--Profile Dialog-->
        <el-dialog :visible.sync="dialogProfileVisible" class="profile-opt">
            <el-row :gutter="20">
                <el-col :span="18">
                    <h6 class='input-title'>标题:</h6>
                    <el-input ref="profileTitle" :value="profile[0].title" placeholder="请输入文字"></el-input>
                    <h6 class='input-title'>说明:</h6>
                    <el-input ref="profileDesc" type="textarea" :rows=5 :value="profile[0].description" placeholder="请输入文字"></el-input>
                   <!--  <h6 class='input-title'>点击后跳转的链接地址:</h6>
                    <el-input ref="profileLink" :value="profile[0].link" placeholder="请输入链接地址"></el-input> -->
                    <el-button class="save-url" type="primary" @click="submitProfileOpt(profile[0])">保存修改</el-button>
                </el-col>
                <el-col :span="6">
                    <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                    <el-upload :action="`/cms/fileUpLoad/upload2`"
                               :data="{categoryId:profile[0].id,path:imgPathIp,cname:profileName}"
                               :headers="imgUploadHeader"
                               :on-success="updateImageUrl"
                               :show-file-list="false"
                               class="avatar-uploader">
                        <img v-if="profile[0].url" :src="profile[0].url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <h6 class='notice-title'>请注意保持图片比例一致</h6>
                </el-col>
            </el-row>
        </el-dialog>

        <!--Start Dialog-->
        <el-dialog :visible.sync="dialogStartVisible" class="start-opt">
            <el-row :gutter="20">
                <el-col :span="18">
                    <h6 class='input-title'>需要跳转的链接地址:</h6>
                    <el-input ref="startnowLink" :value="startnow[0].link" placeholder="请输入跳转地址"></el-input>
                    <el-button class="save-url" type="primary" @click="submitStartOpt(startnow[0])">保存修改</el-button>
                </el-col>
                <el-col :span="6">
                    <h6 class='input-title'>需要显示的图片(点击上传新图片):</h6>
                    <el-upload :action="`/cms/fileUpLoad/upload2`"
                               :data="{categoryId:startnow[0].id,path:imgPathIp,cname:startName}"
                               :headers="imgUploadHeader"
                               :on-success="updateImageUrl"
                               :show-file-list="false"
                               class="avatar-uploader">
                        <img v-if="startnow[0].url" :src="startnow[0].url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <h6 class='notice-title'>请注意保持图片比例一致</h6>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>


<script>
    import config from '../../config/config'
    import axios from 'axios'

    export default {
        data() {
            return {
                dialogBannerVisible: false,
                dialogCategoryVisible: false,
                dialogProduct1Visible: false,
                dialogProduct2Visible: false,
                dialogFavoriteVisible: false,
                dialogMapVisible: false,
                dialogProfileVisible: false,
                dialogStartVisible: false,
                dialogTaxVisible: false,
                dialogNadVisible: false,
                apiToken: sessionStorage.getItem('token'),
                tempId: "",
                imgPathIp: "https://airnz.mcomp.com.cn/images/",
                bannerName: "banner",
                categoryName: "category",
                favoriteName: "product",
                productName: "recommend",
                mapName: "map",
                profileName: "desc",
                startName: "button",
                banners:[
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    }
                ],
                categories: [
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    }
                ],
                product: [
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    },
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    }
                ],
                favoriteArr: [
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    }
                ],
                map: [
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    }
                ],
                profile: [
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    }
                ],
                startnow: [
                    {
                        id: "",
                        title: "",
                        subtitle: "",
                        description: "",
                        url: "",
                        link: ""
                    }
                ],
                imgUploadHeader: {
                    //'X-Token': sessionStorage.getItem('token'),
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                }
            }
        },
        methods: {
            getData() {
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/category/findCategoryByFilter?jsonFilter=%7B%7D',
                })
                .then(function(res){
                }, function(res){
                    if(res.data.code == 1){
                        var new_data = res.data.object;
                        _that.banners = new_data.banner;
                        _that.categories = new_data.category;
                        _that.product = new_data.recommend;
                        _that.favoriteArr = new_data.product;
                        _that.map = new_data.map;
                        _that.profile = new_data.desc;
                        _that.startnow = new_data.button;
                        //_that.imgPathIp = new_data.banner[0].url.substring(0,new_data.banner[0].url.indexOf("/webstart")+9);
                    }
                })
                .catch(function(error){});
                // this.$http.post('/cms/category/findCategoryByFilter?jsonFilter=%7B%7D').then(res => {}, res => {
                //     if(res.data.code == 1){
                //         var new_data = res.data.object;
                //         this.banners = new_data.banner;
                //         this.categories = new_data.category;
                //         this.product = new_data.recommend;
                //         this.favoriteArr = new_data.product;
                //         this.map = new_data.map;
                //         this.profile = new_data.desc;
                //         this.startnow = new_data.button;
                //         this.imgPathIp = new_data.banner[0].url.substring(0,new_data.banner[0].url.indexOf("/webstart")+9);
                //     }
                // })//this.$layer_message(res.data.message,"success")
            },
            saveTempId(id){
                this.tempId = id;
                console.log(this.tempId)
            },
            updateImageUrl(e,file,fileList) {
                this.getData();
            },
            submitBannerUrl(obj,idx){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/category/createOrUpdateCategory',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        name: _that.bannerName,
                        url: obj.url,
                        link: _that.$refs.bannerLink[idx].$refs.input.value
                    })
                })
                .then(function(res){
                }, function(res){
                    _that.getData()
                })
                .catch(function(error){});
            },
            createNewBannerInput(){
                this.banners.push({
                    id: "",
                    url: "",
                    link: ""
                });
            },
            submitCategoryName(obj,idx){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/category/createOrUpdateCategory',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        name: _that.categoryName,
                        title: _that.$refs.categoryTitle[idx].$refs.input.value,
                        url: obj.url,
                        link: obj.link//_that.$refs.categoryLink[idx].$refs.input.value
                    })
                })
                .then(function(res){
                }, function(res){
                    _that.getData()
                })
                .catch(function(error){});
            },
            submitProductOpt(obj){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/category/createOrUpdateCategory',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        name: _that.productName,
                        title: _that.$refs.productTitle.$refs.input.value,
                        subtitle: _that.$refs.productSubtitle.$refs.input.value,
                        description: _that.$refs.productDesc.$refs.input.value,
                        url: obj.url,
                        link: obj.link//_that.$refs.productLink.$refs.input.value
                    })
                })
                .then(function(res){
                }, function(res){
                    _that.getData()
                })
                .catch(function(error){});
            },
            submitFavoriteOpt(obj,idx){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/category/createOrUpdateCategory',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        name: _that.favoriteName,
                        title: _that.$refs.favoriteTitle[idx].$refs.input.value,
                        subtitle: _that.$refs.favoriteSubtitle[idx].$refs.input.value,
                        url: obj.url,
                        link: obj.link//_that.$refs.favoriteLink[idx].$refs.input.value
                    })
                })
                .then(function(res){
                }, function(res){
                    _that.getData()
                })
                .catch(function(error){});
            },
            submitProfileOpt(obj){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/category/createOrUpdateCategory',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        name: _that.profileName,
                        title: _that.$refs.profileTitle.$refs.input.value,
                        description: _that.$refs.profileDesc.$refs.textarea.value,
                        url: obj.url,
                        link: ""
                    })
                })
                .then(function(res){
                }, function(res){
                    _that.getData()
                })
                .catch(function(error){});
            },
            submitStartOpt(obj){
                var _that = this;
                axios({
                    method: 'post',
                    url: '/cms/category/createOrUpdateCategory',
                    data: this.$querystring.stringify({
                        id: obj.id,
                        name: _that.startName,
                        title: "",
                        description: "",
                        url: obj.url,
                        link: _that.$refs.startnowLink.$refs.input.value
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
            this.getData()
        }
    }
</script>
