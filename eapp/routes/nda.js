module.exports = () => {

  const path = require('path')
  //const fileUpload = require('express-fileupload')
  const bodyParser = require('body-parser')
  const writeJsonFile = require('write-json-file')
  const uuid = require('uuid-random')
  const loadJsonFile = require('load-json-file')
  const fs = require('fs')
  const moment = require('moment')
  const request = require('request')
  //const rp = require('request-promise')
  const b64 = require('node-b64')


  const jsonParser = bodyParser.json()
  const rdfHelper = require('./../util/nidme-graph.js')

  global.store = app.locals.store

  //app.use(fileUpload())

  app.post('/nda/dictionaries/local', ensureAuthenticated,jsonParser, function(req,res){
    if (!req.body) return res.sendStatus(400)
    console.log('[nda/dictionaries/] Received at server side')
    //console.log(req.body)
    let term_info = req.body
    term_info['DictionaryID'] = uuid()
    console.log(term_info)
    pid = term_info['DictionaryID'].split('-')
    psname = term_info['shortName'].split(' ')
    pname = term_info['Name'].split(' ')

    let cpath = path.join(__dirname, '/../../uploads/termforms/terms-'+ psname[0]+'-'+ pname[0] +'.json')
    writeJsonFile(cpath, req.body).then(() => {
      console.log('done')
      res.json({'tid': term_info['DictionaryID'], 'fid':'terms-'+ psname[0]+'-'+ pname[0] +'.json'})
    })
  })

  app.post('/nda/dictionaries/github', ensureAuthenticated,jsonParser, function(req,res){
    console.log("github: req.user: ",req.user)
    if (!req.body) return res.sendStatus(400)
    console.log('[nda/dictionaries/github] Received at server side')
    //console.log(req.body)
    let term_info = req.body
    term_info['DictionaryID'] = uuid()
    console.log(term_info)
    pid = term_info['DictionaryID'].split('-')
    psname = term_info['shortName'].split(' ')
    pname = term_info['Name'].split(' ')
    let fileName = psname[0]+'-'+ pname[0] +'.json'
    //let termsJson = JSON.parse(req.body)
    //Local save
    let cpath = path.join(__dirname, '/../../uploads/termforms/terms-'+ psname[0]+'-'+ pname[0] +'.json')
    writeJsonFile(cpath, term_info).then(() => {
      console.log('done')
      //res.json({'tid': term_info['DictionaryID'], 'fid':'terms-'+ psname[0]+'-'+ pname[0] +'.json'})
    })

    //Saving to GitHub
    // Fork the term if not available
    let url = 'https://api.github.com/'
    request.get({url:url+'repos/'+req.user.username+'/ni-terms',headers:{'User-Agent':'brainverse','accept':'application/json'}}, function(err, resn, body){
      //console.log(JSON.parse(body))
      //res.send(body)
      let jbody = JSON.parse(body)
      if("message" in jbody){
        console.log("has message: ")
        if(jbody.message == "Not Found"){
          console.log("--Message not found--")
          console.log("access_token", github_token)
          // fork the repo
          var options = {
            method: 'POST',
            url: url + 'repos/ReproNim/ni-terms/forks',
            headers: {
              'Authorization': 'token '+ github_token,
              'User-Agent': 'brainverse',
              'Content-Type': 'multipart/form-data'
            },
            form: {}
          }
          request(options,function(err1,resn1,body1){
            console.log("resn1.statusCode", resn1.statusCode)
            //console.log("resn1", resn1)
            if(!err1 && resn1.statusCode == 200 || resn1.statusCode == 202){
              console.log("resn1.statusCode", resn1.statusCode)
              createFileInRepo(url,term_info,fileName)
            }
            //console.log("resn: ", resn1)
            console.log("post: fork: ", JSON.parse(body1).full_name)
          })
        }
      }else{
        console.log("It already exist----")
        //create File in the repo
        createFileInRepo(url,term_info,fileName)
      }

      res.json({'tid': term_info['DictionaryID'], 'fid':'terms-'+ psname[0]+'-'+ pname[0] +'.json'})
    })// end of request GET end
  })

  function createFileInRepo(url,jsonTermObj,pathToFile){
    let content = Buffer.from(JSON.stringify(jsonTermObj,undefined,2)).toString('base64')
    var options = {
      method: 'PUT',
      url: url + 'repos/smpadhy/ni-terms/contents/'+ pathToFile,
      headers: {
        'Authorization': 'token '+ github_token,
        'User-Agent': 'brainverse',
        'Content-Type': 'application/json'
      },
      body: {
        message: pathToFile + ' added',
        content: content
      },
      json: true
    }
    request(options,function(err,response,body){
      console.log("statusCode for createFile: ", response)
      if(response.statusCode == 200){
        console.log("body: ", body)
      }
    })
  }
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/')
  }
}
