const express = require("express")
const uuid = require("uuid")


const port = 3000
const app = express()
app.use(express.json())
const order = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = order.findIndex(orders => orders.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}
const checkMethodUrl = (request, response, next) => {

    console.log(request.method)
    console.log(request.url)

    next()
}


app.get("/order", checkMethodUrl, (request, response) => {


    return response.json(order)
})

app.post("/order", checkMethodUrl, (request, response) => {

    const { orderName, clientName, price, status } = request.body

    const orders = { id: uuid.v4(), orderName, clientName, price, status }

    order.push(orders)

    return response.status(201).json(orders)
})



app.put("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
    const { orderName, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const changedOrder = { id, orderName, clientName, price, status }


    order[index] = changedOrder

    return response.status(200).json(changedOrder)
})

app.delete("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {

    const index = request.orderIndex
    order.splice(index, 1)

    return response.status(204).json()
})

app.patch("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {

    const id = request.orderId
    const index = request.orderIndex
    const { orderName, clientName, price, status } = request.body

    const orderStatus = { id, orderName, clientName, price, status }

    order.push(orderStatus)

    return response.status(201).json(orderStatus)
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})