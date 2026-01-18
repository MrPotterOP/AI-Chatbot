import url from 'url';
import { isValidId } from "./verifyUserId.js";
import { verifyRelationWS } from "../middlewares/verifyRelation.ws.js";
import postMessageWS from "../controllers/postMessage.ws.js";


const activeConnections = new Map()

export function handleWSConnection(ws, req) {

    const parameters = url.parse(req.url, true).query;
    const userId = parameters.userId;


    if (!userId) {
        ws.close(1008, 'Missing conversationId')
        return
    }

    if (!isValidId(userId)) {
        ws.close(1008, 'Unauthorized')
        return
    }

    const connectionKey = `${userId}`
    activeConnections.set(connectionKey, ws)
    ws.userId = userId;


    ws.send(JSON.stringify({ type: 'status', status: 'connected' }))


    ws.on('message', async (data) => {
        verifyRelationWS(ws, data, (err) => {
            if (err) {
                ws.send(JSON.stringify({ type: 'error', message: err.message }))
                ws.close(1008, 'Unauthorized')
                return
            }
            postMessageWS(ws, { conversationId: ws.conversation._id, prompt: ws.prompt })
        })
    })


    ws.on('close', (code, reason) => {
        console.log(`Client disconnected: ${connectionKey}, code: ${code}`)
        activeConnections.delete(connectionKey)
    })


    ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        activeConnections.delete(connectionKey)
    })
}