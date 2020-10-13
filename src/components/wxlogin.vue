<template>
  <div class="wxlogin_container">
    <!--主要内容开始-->
    <div class="wxlogin_main" :style="isSearch?'margin-top:-150%':'-130%'">

      <div class="login_content wxlogin_cont" v-if="isLogin">
        <p v-if="isSearch">
          此为专业查询系统、为授权客户提供专属服务。您当前为游客身份，需登录后方可查询。
          <span class="search_tel">如需申请授权，请联系服务电话：<a href="tel:4008813500">4008813500</a></span>
        </p>
        <p v-else>首次登陆需录入订单平台手机号和密码，绑定后即可直接登陆</p>
        <ul class="login_list">
          <li>
            <i><img src="../assets/images/common/icon_loginList3.png" alt="" /></i>
            <input type="text" placeholder="请输入用户名" v-model="userForm.name" />
          </li>
          <li>
            <i><img src="../assets/images/common/icon_loginList4.png" alt="" /></i>
            <input type="password" placeholder="请输入密码" v-model="userForm.passWord" />
          </li>
        </ul>
        <input type="button" value="登录" class="login_btn" @click="login()" />
      </div>

    </div>
    <!--主要内容结束-->
  </div>
</template>

<script>
  import md5 from 'js-md5';
  export default {
    name: 'LhqSearch',
    data() {
      return {
        userForm: {
          name: '',
          passWord: ''
        },
        isLogin: true,
        isSearch:false,//判断是否为查询系统进入
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        let this_ = this;
        if (this_.$utils.check.isEmpty(this_.$route.query.openid)) {
          this_.bus.$emit('tipShow', "未获取到用户信息");
        } else {
          this_.weChartLogin();
        }
        if(!this_.$utils.check.isEmpty(this_.$route.query.target)){
          this_.isSearch = true;
          if(this_.$route.query.type == 3){
            document.title = '江陵';
          }else if(this_.$route.query.type == 4){
            document.title = '弘途';
          }

        }

      });
    },
    methods: {
      weChartLogin: function() {
        let this_ = this;
        this_.$api.get({
          url: this_.$apiUrl.api.WeChatLogin + '?openid=' + this_.$route.query.openid + '&type=' + this_.$route.query.type,
          params: {},
          success: function(data) {
            if (data.State) {
              sessionStorage.setItem("token", data.centent.Token); //存入token

              if(this_.isSearch){
                //查询系统登陆
                let dataset2 = data.centent.userinfo.dataset2;
                let userdata = {
                  dataset: data.centent.userinfo.dataset,
                  dataset1: data.centent.userinfo.dataset,
                  //dataset1: (data.centent.userinfo.dataset1).concat(dataset2)
                };

                //判断品牌是否存在
                dataset2.forEach((item,index) => {
                  if(this_.$route.query.type == 4){
                    if(item.mr003 == "弘途耐用"){
                      userdata.dataset[0].dpt = item.dpt;
                      userdata.dataset[0].kf = item.kf;
                      userdata.dataset[0].ma001 = item.ma001;
                      userdata.dataset[0].ma002 = item.ma002;
                      userdata.dataset[0].ma007 = item.ma007;
                      userdata.dataset[0].ma015 = item.ma015;
                      userdata.dataset[0].ma016 = item.ma016;
                      userdata.dataset[0].ma017 = item.ma017;
                      userdata.dataset[0].ma027 = item.ma027;
                      userdata.dataset[0].ma075 = item.ma075;
                      userdata.dataset[0].ma085 = item.ma085;
                      userdata.dataset[0].mr003 = item.mr003;
                      userdata.dataset[0].yw = item.yw;

                    }
                  }else if(this_.$route.query.type == 3){
                    if(item.mr003 == "江陵耐用"){
                      userdata.dataset[0].dpt = item.dpt;
                      userdata.dataset[0].kf = item.kf;
                      userdata.dataset[0].ma001 = item.ma001;
                      userdata.dataset[0].ma002 = item.ma002;
                      userdata.dataset[0].ma007 = item.ma007;
                      userdata.dataset[0].ma015 = item.ma015;
                      userdata.dataset[0].ma016 = item.ma016;
                      userdata.dataset[0].ma017 = item.ma017;
                      userdata.dataset[0].ma027 = item.ma027;
                      userdata.dataset[0].ma075 = item.ma075;
                      userdata.dataset[0].ma085 = item.ma085;
                      userdata.dataset[0].mr003 = item.mr003;
                      userdata.dataset[0].yw = item.yw;
                    }
                  }
                })
                if(userdata.dataset[0].mr003.indexOf('弘途耐用') > -1 || userdata.dataset[0].mr003.indexOf('江陵耐用') > -1){

                  sessionStorage.setItem("userinfo", JSON.stringify(userdata)); //存入userinfo
                }

                this_.$router.push('/lhqSearch');
              }else{
                //订单系统登陆
                let userdata = {
                  dataset: data.centent.userinfo.dataset,
                  dataset1: (data.centent.userinfo.dataset1).concat(data.centent.userinfo.dataset2)
                };
                sessionStorage.setItem("userinfo", JSON.stringify(userdata)); //存入userinfo
                this_.$router.push('/index');
              }

            } else {
              this_.isLogin = true;
            }

          }
        });
      },

      //用户名密码登陆
      login: function() {
        let this_ = this;
        this_.bus.$emit('loading', true);

        this_.$api.get({
          url: this_.$apiUrl.api.getLogin + '?name=' + this_.userForm.name,
          params: {},
          success: function(data) {
            if (data.State) {
              let mdPasswd = md5(this_.userForm.passWord + data.centent.code).toUpperCase(); //md5加密
              this_.$api.post({
                url: this_.$apiUrl.api.WeChatLogin,
                params: {
                  'loginname': this_.userForm.name,
                  'password': mdPasswd,
                  'openid': this_.$route.query.openid,
                  'type': this_.$route.query.type
                },
                success: function(data) {
                  this_.bus.$emit('loading', false);
                  if (data.State) {
                    this_.weChartLogin();
                  } else {
                    this_.bus.$emit('tipShow', data.Message);
                  }

                }
              });
            } else {
              this_.bus.$emit('tipShow', data.Message);
            }

          }
        });

      },

    }
  }
</script>
<style scoped>
  .wxlogin_main {
    width: 100%;
    margin-top: -130%;
  }

  .wxlogin_container {
    width: 100%;
    padding-top: 177.73%;
    background: url(../assets/images/common/bg_login.jpg)no-repeat;
    background-size: 100%;
    background-color: #320830;
  }

  .wxlogin_cont>p {
    padding-top: 1rem;
    font-size: 1.3rem;
    color: #1097f6;
    line-height: 2rem;
  }

  .search_tel{
    font-size:1.3rem;
  }
  .search_tel a{
    color:#1097f6;
    padding:0.6rem 0 0.6rem 1.8rem;
    background:url(../assets/images/lhq/icon_lhq_tel.png)no-repeat left center;
    background-size:1.8rem 1.8rem;
  }
</style>
