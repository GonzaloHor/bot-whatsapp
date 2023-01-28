require('dotenv').config()
const axios = require('axios')

const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer([
    '📄 Aquí tenemos el flujo secundario',
])

const flowDocs = addKeyword([
    'doc',
    'documentacion',
    'documentación',
]).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)



const obtenerPrecio = async() =>{
    const config = {
        method : 'get', 
        url : 'https://www.dolarsi.com/api/api.php?type=valoresprincipales',
        headers : {}
};

const data = await axios(config).then((i) => i.data);
const precio = data[0].casa
const precioCompra = precio.compra
const precioVenta = precio.venta

return [{body : `Precio compra : *${precioCompra}*`}, {body: `Precio venta : *${precioVenta}*`},{body: 'Anda a comprar bobo'}]
}



const flowPrecioDolar = addKeyword(['1', 'uno'])
    .addAnswer(
    'Te dejo el precio del dolar', null, async (ctx, {flowDynamic}) => {

       const precios = await obtenerPrecio()

       flowDynamic(precios)
    })
 




const flowPrincipal = addKeyword(['hola', 'ole', 'alo', ' saludos', 'saludar'])
    .addAnswer('Hola rey o reina 👑 estas habando con un *chatbot*')
    .addAnswer(
        [
            'Por ahora solo tengo estas funcionalidades \n',
            
            '1. Saber el precio del *Dolar* 💵',
            '2. Mejores *ofertas de Steam* 🤑',
            '3. Estafas *piramidales* 💹',
        ],
        null,
        null,
        [flowDocs, flowPrecioDolar]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
