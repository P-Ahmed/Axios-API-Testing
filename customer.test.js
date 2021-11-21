const envVariable = require('./env.json')
const fs = require('fs');
const { default: axios } = require('axios');
const { expect } = require('chai');

describe("Customer API Testing", ()=>{
    it("Get User", async()=>{
        const response = await axios.get("https://jsonplaceholder.typicode.com/users",{
            Headers: {
                'Content-Type':'application/json'
            }
        });
        console.log(response.data[0]);
        expect(response.status).equals(200);
    })
    it.only("User Login",async()=>{
        const response = await axios.post(`${envVariable.baseUrl}/customer/api/v1/login`,
        {
            "username":"salman",
            "password":"salman1234"
        },
        { 
            headers:{
                'Content-Type':'application/json'
            }
        }
        ).then(res=>res.data)//(function(res) {return res.data})
        console.log(response);
        envVariable.token = response.token;
        fs.writeFileSync('./env.json',JSON.stringify(envVariable));
    })
    it("Customer List",async ()=>{
        const response=await axios.get(`${envVariable.baseUrl}/customer/api/v1/get/101`,
        {
            headers:{
                'Content-Type':'application/json',
                'Authorization':envVariable.token
            }
        }).then(res=>res.data)
        console.log(response);
    })
})