const envVariable = require('./env.json')
const fs = require('fs');
const { default: axios } = require('axios');
const { expect } = require('chai');
const faker = require('faker');
const { AsyncLocalStorage } = require('async_hooks');

describe("Customer API Testing", () => {
    it("Get User", async () => {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users", {
            Headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data[0]);
        expect(response.status).equals(200);
    })
    it("User Login", async () => {
        const response = await axios.post(`${envVariable.baseUrl}/customer/api/v1/login`,
            {
                "username": "salman",
                "password": "salman1234"
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => res.data)//(function(res) {return res.data})
        console.log(response);
        envVariable.token = response.token;
        fs.writeFileSync('./env.json', JSON.stringify(envVariable));
    })
    it("Customer List", async () => {
        const response = await axios.get(`${envVariable.baseUrl}/customer/api/v1/get/101`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariable.token
                }
            }).then(res => res.data)
        console.log(response);
    })
    // before("Generate fake info", async () => {
    //     const response = await axios.get(`https://api.namefake.com/english-united-states`,
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         }
    //     ).then(res => res.data)
    //     envVariable.id = Math.floor((Math.random() * (9999 - 1001)) + 1);
    //     envVariable.name = response.name;
    //     envVariable.email = `${response.email_u}@test.com`;
    //     envVariable.address = response.address;
    //     envVariable.phone_number = response.phone_w;
    //     fs.writeFileSync('./env.json', JSON.stringify(envVariable));
    // })
    it("Singup User", async () => {
        const response = await axios.post(`${envVariable.baseUrl}/customer/api/v1/create`,
            {
                "id": Math.floor((Math.random() * (9999 - 1001)) + 1),
                "name": faker.name.firstName(),
                "email": faker.internet.email(),
                "address": faker.address.streetAddress(),
                "phone_number": faker.phone.phoneNumber()
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariable.token
                }
            }
        ).then(res => res.data)
        console.log(response);
        envVariable.id = response.Customers.id;
        envVariable.name = response.Customers.name;
        envVariable.email = response.Customers.email;
        envVariable.address = response.Customers.address;
        envVariable.phone_number = response.Customers.phone_number;
        fs.writeFileSync('./env.json', JSON.stringify(envVariable));
        expect(response.message).contains("Success");
    })
    it("Update User", async () => {
        const response = await axios.put(`${envVariable.baseUrl}/customer/api/v1/update/${envVariable.id}`,
            {
                "id": envVariable.id,
                "name": envVariable.name,
                "email": envVariable.email,
                "address": "Dhaka, Bangladesh",
                "phone_number": "01948563837"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariable.token
                }
            }
        ).then(res => res.data)
        console.log(response);
        expect(response.message).contains("Success");
    })
    it("Delete Customer", async () => {
        const response = await axios.delete(`${envVariable.baseUrl}/customer/api/v1/delete/${envVariable.id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariable.token
                }
            }
        ).then(res => res.data)
        console.log(response);
        expect(response.message).contains("Customer deleted!");
    })
})