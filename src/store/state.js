import { createStore } from "vuex"

const state = {
    loading:0,
    logFlag: false ,
    email:"",
    admin:"",
    adv:""
}

const actions = {

}

const mutations = {
    changeLoading( state , value ){
        state.loading = value
    },
    changeLogFlag( state , value ){
        state.logFlag = value
    },
    handleLogin( state , value ){

        // value值： admin 、 email 、 adv 、 msg 、 status 、 token
        //存储token
        sessionStorage.setItem( "token" , value.token )

        //切换登陆状态
        state.logFlag = true

        //邮箱
        state.email = value.email

        //头像
        state.adv = value.headerAdv

        //名称
        state.admin = value.admin

    }
}

export default new createStore({
    state,
    actions,
    mutations
})
