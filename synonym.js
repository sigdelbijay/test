((synonym) => {
    'use strict';

    var synonyms = require("synonyms");
    var tcom = require('thesaurus-com');
    var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
    const axios = require('axios');
    const conceptnet = require('./conceptnet');
    const wordnet = require('./wordnet');


    synonym.init = (app) => {
        // var a =    synonyms("laptop"); 
        // wordpos.lookupNoun('laptop')
        //     .then((result) => {
        //         console.log("results from wordpos", result)
        //     })

        // var c = tcom.search('laptop');
        // console.log("thesaurus", c);
        // console.log("synonyms", a);



        setTimeout(function() {
            main();
        }, 3000)


        function main() {
            // var x = {};
            // var find,replace = [];
            var question = "What is the only divisor besides 1 that a prime number can have?";
            wordpos.getNouns(question)
                    .then(async(result) => {
                        console.log("classifiers", result)
    
                        for(let item of result) {
                            let y = {};
                            y['word'] = item;
                            let tempArray = [];
                            let count = await app.locals.db.collection('Synonym').countDocuments({word: item}, {limit:1});
                            console.log("count", count);
                            if(!count) {
                                console.log("item not found in database")
                                const conceptNetData =  await conceptnet.init(item);
                                // console.log("conceptnet", b);
                                const wordNetData =  await wordnet.init(item);
                                // console.log("wordnet", c);
                                tempArray = [...conceptNetData, ...wordNetData];
                                y['synonyms'] = [tempArray[0]];


                                // removing duplicate synonyms
                                for(let i=1; i<tempArray.length; i++) {
                                    // check if two synonym word are same
                                    let index = y.synonyms.findIndex(item => item.synWord === tempArray[i].synWord);                               
                                    if(index === -1) {
                                        // two synonym words are different so keep it
                                        y.synonyms.push(tempArray[i]);
                                    } else{
                                        //synonym words are same so check for source
                                        //if source are same keep only one, if source are diff update the source

                                        if(!y.synonyms[index].source.some(item => tempArray[i].source.includes(item))) {
                                            y.synonyms[index].source = [...y.synonyms[index].source, ...tempArray[i].source]
                                            if(!y.synonyms[index].context && tempArray[i].context)
                                                y.synonyms[index].context = tempArray[i].context
                                            
                                        }
                                    }
                                }
                                console.log("y---------------------->", y)
                                app.locals.db.collection('Synonym', function (err, collection) {

                                    collection.insert(y);

                                });
                            }

                        }

                    
                        // let index;
                        // for(let item in x) {
                        //     x[item] = [];
                        //     console.log("item", x[item])
                        //     console.log("orgi item", item)
                        //     for(let value in x[item]) {
                        //         console.log("value", x[item][value])
                        //         if(x[item][value] == item ) {
                        //             x[item].splice(x[item].indexOf(x[item][value]), 1);
                        //         }                            
                        //     }
                        //     for(let value in x[item]) {
                        //         if(x[item][value].length == 1) {
                        //             x[item].splice(x[item].indexOf(x[item][value]), 1);
                        //         }
                        //     }
                        //     if(x[item].length == 0) {
                        //         delete x[item]
                        //     }
                        // }

                        // find = Object.keys(x);
                        // replace = Object.values(x);

                        // String.prototype.replaceArray = function(find, replace) {
                        //     console.log("find", find);
                        //     console.log("replace", replace)
                        //     var replaceString = this;
                        //     for (var i = 0; i < find.length; i++) {
                        //       replaceString = replaceString.replace(find[i], replace[i]);
                        //     }
                        //     return replaceString;
                        // };
                        // if(app.locals.db) {
                        //     console.log("db is here", app.locals.db)
                            // app.locals.db.collection('Synonym', function (err, collection) {
        
                            //     collection.insert({question, synonyms: x, newQuestion: question.replaceArray(find, replace)});
                            
                            // });
                        // }
    
    
                    })
        }

    }

})(module.exports);