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
        privateKey: "MIIEpAIBAAKCAQEA247uI/Rqn9Ru4MJdSiO7F82vWCmZqf/p2CJUODK8tPZKKFHq54gAJhkxcqPQzQ4QudnlDo7Q8krXLTqqS8LSL60yod2BCPHzUEF3fAstYsH06lewsFs9hTJmqJEfiCEhD5jTCjYqqwSLAPtM1cp5w0QqdgOPziYsXL8Vb4U3ErPJvSkmwytsxYqG81pu/lgwKdky0D50jJ18jiuMbtwJXA7ipeI8V8Mr0xS8z6/kfieMOT9wKw5cLsYaSPpbapwZMmWuAicLMboLw0TS4bSH+LCzwD+f7uUrzC8KAQHKZhZ17JlRjpUwptoIwZcZ3xhRmQhkrapOVHhmHBp8j5LUqwIDAQABAoIBAQCxWZEPRf1iwawWranBm38jSSgcJO5VHbz8sy4ofwNjgZaBXzpKb9b+71a77YtaN8RW+6VEzyQEs2OAy2SH8gTqMhM2IMB8Q0RxTZCAiF7O6TE2okK9EdZt4zp9a0x3H5ufB6lhFEP/BJpr3pJAF1+n1UYfMd1VfgxTlp5wCMFlvolxoLwGod7mf/LfHCKvH/HhoUpNszqiEnMS7UX3UG5hLUC2cyVFoNe3/Vwiu7Z6Exe7sRmLxNyMpEHoAtgc6JDsgMGyg1C/UUOesoo/OkmzNxkUx5/bBHs+Xo53P1HYR4s8V14v9Wzly4TJe/thSlB20fMyw56Zo4m3iABYs4pBAoGBAO13XMua90hlW3EcWho7KwdbWq7Mx6SgtViI5IdguyokLRADmNyiIOMczT800ttTpdKs2J3bijD4tXqMf4XkYeI5pAOUgBxjbWcx+hKETrwmUY/lmSZ7/iqjOHiFGGC1Rgcc1zSsen0ujZGxcCUoiCJr5IvkHHL+C7+Pb3gfFCx7AoGBAOyxwzLbsQGB6iiAR7CZRBOR0+NVOxj5pSEzEjoyw0pGsPZBlvif+AHkUirm37zvTvMIfr5JN9Gk4Rg5keGRGFhkU5xPqjmLrkOtPg6+zu7CIQbqwBAIsiXA6oNppJpor4g4Opwgk1xmQkwdrdy2JhjAegCNye5EyFdhq0dxBvmRAoGAZWlYQ8uGV3CRwJhvEky6b4XgEE575B6N06WCkx4IUFLqu7ANlAvZJ6ShMqEIe4oZgwM17xRWy9srBY8C1tdVxhr/pFfC7ly32B5LwaSnS0rCAkX3RawmO2dBMpcEdih0I415ipEuLk+3PcUdM4E/whN5oxRj4egEdGZ5ID+FigkCgYEAzT6T8jz4r0L1Rmt+Ps+YbZPNddrJZS3NGA3OJ3MvTvAfsVpMzIkCqLlQ2uzaZF3rSuk55k1dPshHfBcnvb5wqu1MZ0XZaQ8LbJoELwscK4Ng2jujkgPIXt57PLrVxiMy2t9PS2UgA0aVBKXTxoiYXmxBHsvUp20zgDosKMYE81ECgYAwa7adZZtHlPFp9xeuHPx/AC+88qLFVnRJfs3Ezy515bhT9G5cTnYK6WZXLi41x6wk95+UAXr4U9iBt6zlEJgAvJwfCDFdmY/64Zv/6pR33gtLLpMCKjFss8d/NrJC52qTvicnqWEG+CCNoQ/TI8xfigWJmRC9CyXPGiIyxYF3EA==",
        alipayPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApKnh6G1HSftIZXbb62D3owmo+AKzKNVDlZtZQexsEhg32AGdnE/oVhiQaF5wp5cV1gUBMcCMdJFMmvxbTe2JKHqOzqgtIZ2WWAe0YqzZmleb3WVcZH31p+peduRwJr0b1OdGkyBDrpF9Z1IO5BemYY6wohfjeUGvNSQLt7BrhqF4glcl8YuL2i+OtKsrb84RhPaUjfJl4c3qWwx/7TaHd+ZL/lAHLbmRIT8h8WyeZSZ+tLgG6hhIEj98kFH9ffjoXSTQ8oXlEFdCqmyhQ+oQLOvrQoerIXnYzW1qGJuRBgPX3oKAwjkvfAIrRwg0VFW91psFmtKBL4+POTnsNE8/CQIDAQAB",
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