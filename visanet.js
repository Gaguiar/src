/*
 * (c) Copyright 2018 - 2020 Visa. All Rights Reserved.**
 *
 * NOTICE: The software and accompanying information and documentation (together, the “Software”) remain the property of and are proprietary to Visa and its suppliers and affiliates. The Software remains protected by intellectual property rights and may be covered by U.S. and foreign patents or patent applications. The Software is licensed and not sold.*
 *
 *  By accessing the Software you are agreeing to Visa's terms of use (developer.visa.com/terms) and privacy policy (developer.visa.com/privacy).In addition, all permissible uses of the Software must be in support of Visa products, programs and services provided through the Visa Developer Program (VDP) platform only (developer.visa.com). **THE SOFTWARE AND ANY ASSOCIATED INFORMATION OR DOCUMENTATION IS PROVIDED ON AN “AS IS,” “AS AVAILABLE,” “WITH ALL FAULTS” BASIS WITHOUT WARRANTY OR  CONDITION OF ANY KIND. YOUR USE IS AT YOUR OWN RISK.** All brand names are the property of their respective owners, used for identification purposes only, and do not imply product endorsement or affiliation with Visa. Any links to third party sites are for your information only and equally  do not constitute a Visa endorsement. Visa has no insight into and control over third party content and code and disclaims all liability for any such components, including continued availability and functionality. Benefits depend on implementation details and business factors and coding steps shown are exemplary only and do not reflect all necessary elements for the described capabilities. Capabilities and features are subject to Visa’s terms and conditions and may require development,implementation and resources by you based on your business and operational details. Please refer to the specific API documentation for details on the requirements, eligibility and geographic availability.*
 *
 * This Software includes programs, concepts and details under continuing development by Visa. Any Visa features,functionality, implementation, branding, and schedules may be amended, updated or canceled at Visa’s discretion.The timing of widespread availability of programs and functionality is also subject to a number of factors outside Visa’s control,including but not limited to deployment of necessary infrastructure by issuers, acquirers, merchants and mobile device manufacturers.*
 * implementação de invoice com visanet
 */

const express = require('express');
const fs = require('fs');
var https = require('https');
const request = require('request');
const app = express();
const bodyParser = require('body-parser')
var path = require('path');
var crypto = require('crypto');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


var apiKey = '<API KEY>';
var sharedSecret = '<SHARED SECRET KEY>';

var resourcePath = 'teste'
var queryParams = 'apiKey='+apiKey;
var postBody = '';

app.get('/', (req, res) => {

	var timestamp = Math.floor(Date.now() / 1000);
	var preHashString = timestamp + resourcePath + queryParams + postBody;
	var hashString = crypto.createHmac('sha256', sharedSecret).update(preHashString).digest('Hex');;
	var xPayToken = 'xv2:' + timestamp + ':' + hashString;

console.log(preHashString);
	console.log(xPayToken);

    var options = {
        hostname: 'sandbox.api.visa.com',
        port: 443,
        uri: 'https://sandbox.api.visa.com/vdp/helloworld?'+queryParams,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-pay-token': xPayToken
        },
        json: true
    };

console.log(options);

    options.agent = new https.Agent(options);

    request.get(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        console.log(body);
    });
    res.send('testando integração v1.0');
});

app.listen(3050, function () {
    console.log('app listening on port 3050.');
})
