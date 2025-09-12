const authRoute=require('./auth');
const chatbotRoutes = require('./chatbotRoutes')
const aiImageRoutes = require('./aiImageGen')
const trackerRoutes = require('./trackerRoutes')

module.exports={
    authRoute,
    chatbotRoutes,
    aiImageRoutes,
    trackerRoutes
}