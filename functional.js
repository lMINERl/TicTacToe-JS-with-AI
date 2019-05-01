/* eslint-disable no-console */
const arrange = (arg) => arg.slice().sort();

const adding = (args) => {

    return args.reduce((el, acc) => { return 2 * el + 3 * acc });
};

const multiply = (x, y) => x * y;

//currying search for it

//composition : taking a few functions calling them together and return a new function
//1- associativity
const reverse = (val = []) => {
    return val.slice().reverse();
}//1st function

const multiplyBy2 = (val) => {
    return val.map(x => multiply(x, 2));
}; //2nd function

const arr = Object.freeze([1, 2, 3]);


const composition = (...args) => {
    return args.reduce((arg, acc) => {
        return (...val) => {
            return arg(acc(val))
        };
    });
}


// Ramda github fb library

const MultRevev = composition(reverse, multiplyBy2, reverse);
// console.log(MultRevev(arr));

//1st pattern
//getters/setters => lenses (set/view/over)
const makeLenses = (arr) => {
    const temp = Object.assign({}, { ...arr });
    Object.freeze(temp);

    return temp;
}

const setter = (name, val, obj) => {
    return ({ ...obj, [name]: val })
}
const view = (lensObj) => {
    const temp = Object.entries(lensObj).map((a, b) => {
        return a[b];
    });
    // obj[lensObj[0]]);   
    temp
    return temp;
}

var user = Object.freeze({ id: 1, name: 'Alicia' });
var L = makeLenses(['name', 'age']);
// console.log(setter(`name`, 'ahmed', user))
// console.log(view(L, user))


//2nd pattern Null Checking
//missing null /0 validation

// const fmap = (f, mappable) => {
//     return f(mappable);
// }

// console.log(fmap(reverse, maybe([1, 2, 3])));


//3rd pattern error handling
const maybe = (val) => {
    return !(val == [] || val === null || val == undefined);
}
const evaluate = (val, errorVal) => {
    return (maybe(val)) ? val : errorVal;
}

// console.log(either("value of not null", "value if null"));

// justify why using the function


const justifable = (reason, fn) => {
    const closure = reason;
    return (...params) => {
        if (Show.reason) {
            console.log(`${closure}`);
        }
        return fn(...params);
    };
}
// justify why calling the function
// const call = (fn, reason, ...params) => {

//     return justifable(reason, fn)(...params);
// }


// change State
const Show = {
    prev: (x) => x,
    current: () => false,
    Listener: function () { },
    set reason(val) {
        this.prev = this.current;
        this.current = () => val

        // this.current = Object.freeze({ reason: Boolean(val) });
        this.Listener(val);
    },
    get reason() {
        return this.current();
    },
    registerListener: function (callback) {
        this.Listener = callback;
    }
}
// Show.registerListener(function (val) {
//     console.log(val);
// });

const call = (reason, fn, displayReason) => {
    // if (displayReason) {
    //     Show.switchReason();
    // }
    Show.reason = displayReason;
    return justifable(reason, fn);
}

{
    const add = composition(
        justifable("adding the params for result", adding),
        justifable("arrange parameters", arrange),
    );
    // console.log(call("for adding", add, false)(1, 2));
}


{// create an event
    function customEvent(name) {
        this.name = name;
        this.callbacks = [];
    }
    customEvent.prototype.registerCallback = function (callback) {
        this.callbacks.push(callback);
    }

    function Reactor() {
        this.events = {};
    }

    Reactor.prototype.registerEvent = function (eventName) {
        var event = new customEvent(eventName);
        this.events[eventName] = event;
    };

    Reactor.prototype.dispatchEvent = function (eventName, eventArgs) {
        this.events[eventName].callbacks.forEach(function (callback) {
            callback(eventArgs);
        });
    };

    Reactor.prototype.addEventListener = function (eventName, callback) {
        this.events[eventName].registerCallback(callback);
    };

    var reactor = new Reactor();
    reactor.registerEvent('onChange');
    reactor.addEventListener('onChange', function () { });
    reactor.dispatchEvent('onChange');

}


// const sub1 = composition(adding, arrange);
// add(1, 2);


// call(add, "just for test", 1, 4);

// tracer(add, add(1, 2), 4);
// tracer(add, 1, add(2, 4));

// console.log(add(1, 2))
// console.log(add(1, add(2, 4)));
//associative
// console.log(add(add(1, 2), 4) == add(1, add(2, 4)));

//commutative
// console.log(add(4, 1) == add(1, 4));

//identiy
// const n = 7;//any number
// console.log(add(n, 0));

//distributive
// console.log(multiply(2, add(3, 4)) == add(multiply(2, 3), multiply(2, 4)));

//polymorphic
// console.log(add(2.2, 3.3));

// console.log(addsorted(1,2));

module.exports = {Show, composition, justifable, call, evaluate, maybe }