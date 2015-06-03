var should = require('chai').should(),
    expect = require('chai').expect(),
    tacitServer = require('../index'),
    testFunction1 = tacitServer.testFunction1,
    testObject1 = tacitServer.testObject1,
    server = tacitServer.Server();

console.log("tacitServer:");
console.log(tacitServer);

console.log("tacitServer.setConfig({'test':true}):");
tacitServer.setConfig({'test':true});
console.log(tacitServer.setConfig);

console.log("tacitServer.getConfig():");
console.log(tacitServer.getConfig);
var config = tacitServer.config;
console.log(config);

console.log("tacitServer.config:");
console.log(tacitServer.config);

console.log("testFunction1:");
console.log(tacitServer.testFunction1);

console.log("Server:");
console.log(tacitServer.Server);

//describe('#tacitServer', function() {
//  it('tacitServer', function() {
//    tacitServer.testFunction2('Hello World!').should.equal('Hello World!');
//  });
//});

describe('#testObject1', function() {
  it('testObject1', function() {
    //tacitServer('Hello World!').should.equal('Hello World!');
    //(new tacitServer()).should.be.a('function'); // fails: object is not a function, that's right!
    //(new tacitServer()).should.be.an('object'); // fails: object is not a function
    //expect(null).to.be.a('null'); // fails: object is not a function
    //expect(server).to.be.an.instanceof(Object); // fails: object is not a function
    testObject1('Hello Server!').should.equal('Hello Server!'); // passes!
  });
});

describe('#testFunction1', function() {
  it('testFunction1', function() {
    testFunction1('Hello World!').should.equal('Hello World!'); // passes!
  });
});

//describe('#server', function() {
//  it('server', function() {
//    (new server()).should.be.a('function');
//    //(new Object()).should.be.a('object');
//    //expect(server).to.be.an.instanceof(Object);
//    //expect(null).to.be.a('null');
//  });
//});

//describe('#setConfig', function() {
//  it('setConfig', function() {
//    (new server.setConfig()).should.be.a('function');
//    //(new setConfig()).should.be.a('function');
//    //setConfig('{"test":true}').should.equal(null); // no return
//  });
//});
