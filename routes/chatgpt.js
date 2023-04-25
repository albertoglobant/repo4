const auth = require('../middleware/auth')
const express = require('express')
const openai = require('openai');
const apiKey = process.env.REACT_APP_OPEN_AI_KEY || "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"

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

router.post('/proxyjira', async(req, res)=>{
  try{
    
    console.log("proxiy");

    const jiraMessage2 = req.body
    
    const BASE_URL = 'https://alexgptplusplus.atlassian.net/rest/api/2/issue/'
    console.log(BASE_URL);
  
        clientJira.post(BASE_URL, jiraMessage2)
        .then(result => {
          console.log("me llamo alberto333333");
          console.log(result.data);
          res.status(200).send(result.data)
      }).catch(err => {
          console.log("fallo proxi jira");
          console.log(err);
      });

    }catch(e){
      console.log(e);
      return res.status(400).send(["error", "proxi jira fallo"])
  }
    
})




router.post('/proxyjiracreatesubtaskforanissue', async(req, res)=>{
  try{

    const jiraRequestBody = {
      "fields":
      {
          "project":
          {
              "key": req.body.projectkey
          },
          "parent":
          {
              "key": req.body.parentIssuekey
          },
          "summary": req.body.summary,
          "description": req.body.description,
          "issuetype":
          {
              "id": "10005"
          }
      }
  }


    
    console.log("proxyjiracreatetestcase");
    console.log(jiraRequestBody);

    const jiraMessage2 = jiraRequestBody
    
    const BASE_URL = 'https://alexgptplusplus.atlassian.net/rest/api/2/issue/'
    console.log(BASE_URL);
        clientJira.post(BASE_URL, jiraMessage2)
        .then(result => {
          res.status(200).send(result.data)
      }).catch(err => {
          console.log(err);
      });

    }catch(e){
      console.log(e);
      return res.status(400).send(["error", "proxi jira fallo"])
  }
    
})

router.post('/proxychat', async(req, res)=>{
  try{
    
    console.log("proxchat");

    const messageChat = req.body

    client.post('https://api.openai.com/v1/chat/completions', messageChat)
      .then(result => {

        console.log("me llamo alberto3");
        console.log(result.data.choices[0].message.content);
        
        res.status(200).send(result.data)
        
        
      }).catch(err => {
          console.log("fallo proxi chat");
          console.log(err);
      });

    }catch(e){
      console.log(e);
      return res.status(400).send(["error", "proxi chat"])
  }
    
})


router.post('/proxychatgptcreatemanualtestcase', async(req, res)=>{
  try{
    
    console.log("proxchat");

    const messageChat = {
      "model":"gpt-3.5-turbo",
      "messages":[
         {
            "content":"create the manual test case with steps to follow for the next scenario, only send the steps for the manual test cases nothing else",
            "role":"system"
         },
         {
            "content":req.body.description,
            "role":"user"
         }
       ]
    }

    client.post('https://api.openai.com/v1/chat/completions', messageChat)
      .then(result => {

        console.log("me llamo alberto3");
        console.log(result.data.choices[0].message.content);
        
        res.status(200).send(result.data)
        
        
      }).catch(err => {
          console.log("fallo proxi chat");
          console.log(err);
      });

    }catch(e){
      console.log(e);
      return res.status(400).send(["error", "proxi chat"])
  }
    
})



/*
ASK TO CHATGPT FOR MANUAL TEST CASES UI, CODE AND MORE
*/

router.post('/proxychatgptwithscenario', async(req, res)=>{
  try{
    
    console.log("proxychatgptwithscenario");
    var contentMessage = ""
    var subTaskTitle = ""

    switch (req.body.type) {
      case 'MANUAL_TEST_CASE':
        console.log('MANUAL_TEST_CASE');
        contentMessage = 'Respond as if you were a Manual Tester for Web application. Create the manual test case with "Steps to follow" for the next scenario. Send only the test case, nothing else"'
        subTaskTitle = "Manual Test Case for " + req.body.summary
        break;

      case 'ACCEPTANCE_CRITERIA':
        console.log('ACCEPTANCE_CRITERIA');
        contentMessage = 'Respond as if you were a Product Owner for Web application. Create the Acceptance criteria using Gherking for the next Scenario. Send only the test case, nothing else"'
        subTaskTitle = "Scenario for " + req.body.summary
        break;

      case 'CODE_AND_UNIT_TEST':
        console.log('CODE_AND_UNIT_TEST');
        contentMessage = 'Respond as if you were a React Web Developer for Web application. Create the code and unit test for the next Scenario. Send only the test case, nothing else"'
        subTaskTitle = "Code and Unit Test for " + req.body.summary
        break;

      case 'UNHAPPY_PATH':
        console.log('UNHAPPY_PATH');
        contentMessage = 'Respond as if you were a Manual Tester for Web application. Create the manual test case with "Steps to follow" for the next scenario. Send only the test case, nothing else"'
        subTaskTitle = "Unhappy path for " + req.body.summary
        break;

      case 'LANGUAGE_TRANSLATOR':
        console.log('LANGUAGE_TRANSLATOR');
        contentMessage = 'Respond as if you were a translatorn. Translate the next to Spanish and German. Send the response in this format, nothing else: English: Spanish: German:"'
        subTaskTitle = "Labels path for " + req.body.summary
        break;




      case 'UI_UX':
        console.log('UI_UX');
        contentMessage = 'UI_UX'
        break;
      default:
    }

    var contentMessageSummmaryDescription = req.body.summary + " : " + req.body.description
    console.log('MANUAL_TEST_CASE');

    const messageChat = {
      "model":"gpt-3.5-turbo",
      "messages":[
         {
            "content": contentMessage,
            "role":"system"
         },
         {
            "content":contentMessageSummmaryDescription,
            "role":"user"
         }
       ]
    }

    client.post('https://api.openai.com/v1/chat/completions', messageChat)
      .then(result => {

        console.log("me llamo alberto3");
        console.log(result.data.choices[0].message.content);



        //Subir subtask a Jira
        try{


          

          const jiraRequestBody = {
            "fields":
            {
                "project":
                {
                    "key": req.body.projectkey
                },
                "parent":
                {
                    "key": req.body.parentIssueKey
                },
                "summary": subTaskTitle,
                "description": result.data.choices[0].message.content,
                "issuetype":
                {
                    "id": "10005"
                }
            }
        }
      
      
          
          console.log("proxyjiracreatetestcase");
          console.log(jiraRequestBody);
      
          const jiraMessage2 = jiraRequestBody
          
          const BASE_URL = 'https://alexgptplusplus.atlassian.net/rest/api/2/issue/'
          console.log(BASE_URL);
              clientJira.post(BASE_URL, jiraMessage2)
              .then(result => {
               // res.status(200).send(result.data)
            }).catch(err => {
                console.log(err);
            });
      
          }catch(e){
            console.log(e);
            return res.status(400).send(["error", "proxi jira fallo"])
        }


        
        res.status(200).send(result.data)
        
        
      }).catch(err => {
          console.log("fallo proxi chat");
          console.log(err);
      });

    }catch(e){
      console.log(e);
      return res.status(400).send(["error", "proxi chat"])
  }
    
})
module.exports = router