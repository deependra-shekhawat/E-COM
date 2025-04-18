import mongoose from "mongoose";

const testSchema = mongoose.Schema({
    test: [{
        type: String,
    }]
})

const testModel = mongoose.model('test', testSchema);

export default testModel;

// Input 1

// {

//   "strings": [

//     "a",

//     "ab"

//   ]

// }

 

// Output 1

// {

//   "strings": [

//     "a",

//     "ab"

//   ]

// }

 

// Input 2

// {

//   "strings": [

//     “bc”,

//     "abc”

//   ]

// }

 

// Output 2

// {

//   "strings": [

//     "a",

//     "ab”,

//     “bc”,

//     "abc”

//   ]

// }