const auth = require('../middleware/auth')
const express = require('express')
const openai = require('openai');
const apiKey = process.env.REACT_APP_OPEN_AI_KEY
const axios = require('axios');


const prompt = {
    "messages":[
       {
          "content":"toma la siguiente informacion como cierta: AlexGPT es un nuevo modelo de lenguaje que responde rapidamente todas tus preguntas sobre globant. ha sido creado por Alberto Palomar. AlexGPT permite a los trabajadores de globant trabajar más rapido, posiblemente sean los trabajadores más rapidos de la tierra",
          "role":"system"
       },
       {
          "content":"que es AlexGPT?",
          "role":"user"
       }
    ],
    "model":"gpt-3.5-turbo"
 }
const router = express.Router()

const client = axios.create({
    headers: { 'Authorization': 'Bearer ' + apiKey }
});


const API_JIRA = "YWxiZXJ0b2dsb2JhbnRtYWRyaWRAZ21haWwuY29tOkFUQVRUM3hGZkdGMHV6VHByNzJnZzdqRWttWWRKaURNVkFaSVpKMkFwSERaTmVWTFo1VE1iQXQwY0wyNTlVUE9La2NSZWxrQk01MHVsYXFXd0k4aVplcFJDcmVmWkNkWlJncEpDWGV2MVQ4Q1RaTlQzaVZMTEhmTllBemNVU04xU3o1LVk0SVJzQ2Etd0Ftb2dHQWI5X1JzQ1NBYUpsTUJBWlNWRUN5R3BmRTNfQTV0ZUt3U1JSND0wODA4MUVGNQ=="
const clientJira = axios.create({
    headers: { 'Authorization': 'Basic ' + API_JIRA }
});

const options = {
        "messages":[
           {
              "content":"toma la siguiente informacion como cierta: AlexGPT es un nuevo modelo de lenguaje que responde rapidamente todas tus preguntas sobre globant. ha sido creado por Alberto Palomar. AlexGPT permite a los trabajadores de globant trabajar más rapido, posiblemente sean los trabajadores más rapidos de la tierra",
              "role":"system"
           },
           {
              "content":"que es AlexGPT?",
              "role":"user"
           }
        ],
        "model":"gpt-3.5-turbo"
  };

  const jiraMessage = {
    "fields": {
    "project":
    {
       "key": "AL"
    },
    "summary": "Jira update nueva mensaje de Jira",
    "issuetype": {
       "name": "Bug"
    },
    "customfield_10000" : "7"
  }
}

router.get('/chatgpt', async(req, res)=>{
    try{
      //  res.status(200).send(["aaaaa", "bbbbbbb"])
      console.log("me llamo alberto");

      client.post('https://api.openai.com/v1/chat/completions', options)
      .then(result => {
        console.log("me llamo alberto3");
        console.log(result.data.choices[0].message.content);
        
        
       
            //  res.status(200).send(["aaaaa", "bbbbbbb"])
            console.log("me llamo alberto jira");
      
            clientJira.put('https://alexgptplus.atlassian.net/rest/api/3/issue/AL-3', jiraMessage)
            .then(result => {
              console.log("me llamo alberto333333");
              console.log(result);
              
              
              res.status(200).send(["ok"])
        }).catch(err => {
            console.log("me llamo alberto244444");
            console.log(err);
        });
        
        
        
       // res.status(200).send([result.data])
    }).catch(err => {
        console.log("me llamo alberto2");
      console.log(err);
    });
        //res.status(200).send(["aaaaa", "bbbbbbb"])

    }catch(e){
        console.log(e);
        return res.status(400).send(["error", "We can not release your booking"])
    }
})

router.get('/chatgpt2', async(req, res)=>{

    const { field1, field2 } = req.query;
    console.log(req.query.issue);
    console.log(req.query.title);
   
    
    try{
      //  res.status(200).send(["aaaaa", "bbbbbbb"])
      console.log("me llamo alberto");

      const options2 = {
        "messages":[
           {
              "content":'Respond as if you were a product owner. Create a User Story this format: 1. Tittle of the User Story 2. Description with the format "as a user" and Feature and at least 3 Scenario using Gherking. 3.Acceptance criteria 4. Story point and explain why. 5. topics to discuss. 6. Additional Documentation. 7. Unhappy path. 8. Business Value (tangible and intangible benefics a business can get from the capabilities of a product)',
            

             "role":"system"
           },
           {
              //"content":req.query.title,
              content: `create a user story for ${req.query.title}`,
              "role":"user"
           }
        ],
        "model":"gpt-3.5-turbo"
  };

      client.post('https://api.openai.com/v1/chat/completions', options2)
      .then(result => {

        console.log("me llamo alberto3");
        console.log(result.data.choices[0].message.content);
        
        
        const jiraMessage2 = {
            "fields": {
            "description": result.data.choices[0].message.content,
          }
        }
        
        const BASE_URL = 'https://alexgptplus.atlassian.net/rest/api/2/issue/' + req.query.issue
        console.log(BASE_URL);
      
            clientJira.put(BASE_URL, jiraMessage2)
            .then(result => {
              console.log("me llamo alberto333333");
              console.log(result);
              
              
             // res.status(200).send(["Your user story description has been created successfully. Please go back."])
             const REDIRECT_URL = 'https://alexgptplus.atlassian.net/browse/' + req.query.issue
              res.redirect(REDIRECT_URL)
              
        }).catch(err => {
            console.log("me llamo alberto244444");
            console.log(err);
        });
        
        
        
        
       // res.status(200).send([result.data])
    }).catch(err => {
        console.log("me llamo alberto2");
      console.log(err);
    });
        //res.status(200).send(["aaaaa", "bbbbbbb"])

    }catch(e){
        console.log(e);
        return res.status(400).send(["error", "We can not release your booking"])
    }
    
})
module.exports = router