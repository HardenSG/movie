import { createRouter , createWebHashHistory} from 'vue-router'

const routes = [
    {
        path:"/",
        component: ( ) => import("@/views/IndexCom.vue"),
        meta:{ isAuth:"no" }
    },
    {
        path:"/Top",
        component: ( ) => import("@/views/TopCom.vue"),
        meta:{ isAuth:"no" }
    },
    {
        path:"/movie",
        component: ( ) =>  import("@/views/MovieSec.vue"),
        meta:{ isAuth:"no" }
    },
    {
        path:"/payseat/:agencyId/:id",
        name:"payseat",
        component: ( ) => import("@/components/SelectSeat.vue"),
        meta:{ isAuth:"no" }
    },
    {
        path:"/filmdetail/:id",
        name:"detail",
        component: ( ) => import("@/components/MovieDetail.vue"),
        meta:{ isAuth:"no" }
    },
    {
        path:"/person/:email",
        name:"person",
        component: ( ) => import("@/components/PersonHome.vue"),
        meta:{ isAuth:"yes" }
    },
    {
        path:"/search/:name",
        name:"search",
        component: ( ) => import("@/components/SearchMovie/SearchMovie.vue")
    },
    {
        path:"/confirmOrder",
        name:"confirmOrder",
        component: ( ) => import("@/components/ConfirmOrder.vue")
    }
]



const router = new createRouter({
    routes,
    history:createWebHashHistory()
})

// router.beforeEach( (to, from, next) => {
//     // if( to.meta.isAuth == 'yes' && ) return
//     // next( )
//     console.log(  );
// })
export default router
