//引入支付宝工具包
const Alipay = require("alipay-sdk").default

//创建form
const Aliform = require("alipay-sdk/lib/form").default

exports.exec = ( url , money , subject , content ,orderId) => {

    //配置对象
    /**
     * appid：应用id，正式换成正式的id
     * 公钥和私钥
     * 网关：正式版去掉dev
     */
     const alipay = new Alipay({
        appId: "2021000120606294",
        privateKey: "MIIEowIBAAKCAQEArC/US6aituGvW3geTknM9axpTx76ItTwCKdyxz1bIKrjO+ywCvLZ88NPPrqfDDX49rseSQqglsTGh6ZboaHVBL4t+IuaAooeRDkKtl4H9l7pUqeJ7XKT1Cd8ZR+KTWmWyh7DddNjGKBoPr4YgVKnR5rtk04yLsm+LWcAzk0bJBcnZ336QmXfYfo7XGxaYnGRIoqztObdn6Wm3URqswVRmr9PzQncGfcbfyuy3gf7hQAddudVefa1oOnhfxC9cqs7W9XbQ0eVz5JCOb+Ul86VDZzyWFAo8Eh+8drnfrDTaKUuzVx5HyVO7VlJuawXjd0bVswXkypFbqyXQGSa1XK+XwIDAQABAoIBAECUX8dP5E87Lg3ca2FphJnP5F9setx9iNl2FDJt7LO/5CIhj5VLqDso0ZvxWp210H6Zh65Vcg2aF+vglRV2IPL6cTt7AHRbYSatTjs/4TSiPFhnxe9svc0gUiOLRM/r/kYoa57RfaVK5E5D9eTrHxpYHSrWdTPfLpjQvRijCr7p4PRyXdb197wfDJBLPoPXVGjZgHbgFKLQWqw+QvR0s+clSa5Qpbno+qqQ4I7hLFRn6G3SVtq3Tzn9zmjoSe2GaQ8U7nhnnRzgRAyCEydg9siKKlhcBT/9DGicu1wYqMHBzbiyqviw0Q5VgN+dpDr6n5plxJs75T4i/aaes/+jiWECgYEA8/ux0udEzHi9bvt77u9kN6x3ISa4k4+yAIZsd/oCLRlThO4A8m3sq52fvrYbrugb3jWL5ZPjUdfmH4h6ueFpIUFCPRI4qF7Jk0oJBGLg6kGfw8Hg6CL0/6lYtARfDUUM3OgVALkswpzEYjB4epV8yhxOX7EZuI6RVrBapHVBJ0sCgYEAtKrgqxIZ9q+CclEcQiHhJU0a2Wo5AECkUFjVX6KPqFxU1EpeO1cmwn9RQ5qYPOQApoMb+2gdiNlVqCXCL3/slsa8eFm9AiPy4AuaZ51o/+Ru93yqBLp40gCiJ43w5+ZpX+iw9OJ+l2e3yDIwiCzr2dy999y6Gd96p9IbmVMotL0CgYBInwtP/lyBDBM+nIZIGWNYGvKeoHriGSxfcaOJlpXdPKOadok7n7KJZnJs/qGAzz+0RXXtkLZh3wR1MFdvSoPTTSxdJzZMD2Kqf6ftcU0HDR9z0hqSng0UqCBp/L8aIQpyGnZd78A98RGXNFw4CJTLR9+gJgPE5lKmXfms5+XLvwKBgC8Z9aTj/TzhGQMwvktHhekxpvRTyzSTpcMExew+93EPUVZfZR3XZNWEV+1mGpaVYs4GlH8A7+JDtx81aOD1WvscKPq/epVaRfG/VKv6z+sW5Q9EwxakfudRHvVs/geXfJVylt/hRNu4QKPC4gA+peaQtD4wn5wrNVEXZ/abRZuJAoGBAK0RPWraRJJKZKZkQJmhZqz4LKHUXApX9LiOap5+fl87hfNkCUs74GPNH4MTeHGfWbV7vWz/pQ60bbz8IW3NKoO6d/1z50yn3psWpP4i1GvP7PgQODoVwBDx4JSRSXLk+HFRubxt+KHfp7nKyzaYFRTG8VELlOIw3XTZ4oJs2BKj",
        alipayPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArC/US6aituGvW3geTknM9axpTx76ItTwCKdyxz1bIKrjO+ywCvLZ88NPPrqfDDX49rseSQqglsTGh6ZboaHVBL4t+IuaAooeRDkKtl4H9l7pUqeJ7XKT1Cd8ZR+KTWmWyh7DddNjGKBoPr4YgVKnR5rtk04yLsm+LWcAzk0bJBcnZ336QmXfYfo7XGxaYnGRIoqztObdn6Wm3URqswVRmr9PzQncGfcbfyuy3gf7hQAddudVefa1oOnhfxC9cqs7W9XbQ0eVz5JCOb+Ul86VDZzyWFAo8Eh+8drnfrDTaKUuzVx5HyVO7VlJuawXjd0bVswXkypFbqyXQGSa1XK+XwIDAQAB",
        gateway: "https://openapi.alipaydev.com/gateway.do"
    })

    // 创建form的对象
    let formData = new Aliform( )

    //选择接受的方式为get即返回url
    formData.setMethod("get")

    //支付结束后跳转指定页面
    formData.addField(" returnUrl ",url)

    formData.addField(" notifyUrl ","http://36.133.40.168:8088/api/pay")

    //配置form所需的对象
    formData.addField("bizContent",{    
        outTradeNo: orderId,
        productCode:"FAST_INSTANT_TRADE_PAY",
        totalAmount: money,
        subject: subject,
        body: content,
    })

    return alipay.exec(
        "alipay.trade.page.pay",
        {},
        { formData:formData }
    )
}