var should = require('chai').should(),
    expect = require('chai').expect(),
    tacitServer = require('../index'),
    testFunction1 = tacitServer.testFunction1, // Note: no () at end of function name
    testObject1 = tacitServer.testObject1,
    server = tacitServer.Server;

console.log("tacitServer:");
console.log(tacitServer);

console.log("tacitServer.Server:");
console.log(tacitServer.Server);

//console.log("tacitServer.Server.setConfig({'test':true}):");
//tacitServer.Server.setConfig({'test':true});

//console.log("tacitServer.Server.getConfig():");
//var config = tacitServer.Server.getConfig();
//console.log(config);

console.log("tacitServer.config:");
console.log(tacitServer.config);

console.log("testFunction1():");
console.log(tacitServer.testFunction1);

// describe('#testObject1', function() {
//   it('testObject1', function() {
//     //tacitServer('Hello World!').should.equal('Hello World!');
//     //(new tacitServer()).should.be.a('function'); // fails: object is not a function, that's right!
//     //(new testObject1.should.be.an('object'); // fails: object is not a function
//     //expect(null).to.be.a('null'); // fails: object is not a function
//     //expect(testObject1).to.be.an.instanceof(Object); // fails: object is not a function
//     //testObject1('Hello Server!').should.equal('Hello Server!'); // passes!
//   });
// });

describe('#testFunction1()', function() {
  it('testFunction1()', function() {
    testFunction1('Hello World!').should.equal('Hello World!'); // passes!
  });
});

// describe('#tacitServer.Server', function() {
//   it('tacitServer.Server', function() {
// //    (new server()).should.be.a('function');
// //    tacitServer.Server.should.be.a('object');
// //    expect(tacitServer.Server).to.be.an.instanceof(Object);
// //    //expect(null).to.be.a('null');
//   });
// });

describe('#tacitServer.Server.listen()', function() {
  it('tacitServer.Server.listen()', function() {
    tacitServer.Server.listen.should.be.a('function'); // passes!
  });
});
