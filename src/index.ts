import * as express from 'express'
import * as dotenv from 'dotenv'
import setupApp from './AppSetup'
import installAuthentication from './Authentication'
import installAuthedAuthApi from './Authentication/AuthedApi'
import {authBoundary} from './Authentication'
import installTaskMonitorApi from './TaskMonitor'
import installAuthedTaskMonitorApi from './TaskMonitor/AuthedApi'

dotenv.config()
let count = 1

const app:any = express()

app.use((req,res,next)=>{
    console.log(`served ${count} requests`)
    count++
    next()
})

setupApp(app)

installAuthentication(app)
installTaskMonitorApi(app)

authBoundary(app)

installAuthedTaskMonitorApi(app)
installAuthedAuthApi(app)

app.listen((process.env.PORT || 4000), () => {
    console.log('SERVER: running at ' + (process.env.PORT || 4000))
})
