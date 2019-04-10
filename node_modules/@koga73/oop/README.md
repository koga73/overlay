# OOP
*By: AJ Savino*

This project when combined with design patterns adds common OOP functionality to JavaScript

Goals:
- Provide OOP like functionality including namespacing, classes, inheritance
- Provide methods for cloning and extending objects
- Provide a cross-browser event model that can be added onto to any object
- Provide common methods for type checking

## Install:
```
npm i @koga73/oop
```

## Simple class:
```
OOP.namespace("foo.bar.Shape", OOP.construct(
	//Instance
	{
		width:150,
		height:150
	}
));

var instance = new foo.bar.Shape();
console.log(instance);
```

Optionally you can add the OOP methods onto the window or any object.
This will allow you to exclude "OOP" in the examples. Same example as above:
```
OOP.init(); //Add OOP methods to the window
namespace("foo.bar.Shape", construct(
	//Instance
	{
		width:150,
		height:150
	}
));

var instance = new foo.bar.Shape();
console.log(instance);
```

### Add static methods and pass parameters to the instance:
```
OOP.namespace("foo.bar.Shape", OOP.construct(
	//Instance
	{
		width:150,
		height:150
	},
	//Static
	{
		getArea:function(obj){
			return obj.width * obj.height;
		}
	}
));

var instance = new foo.bar.Shape({
	width:100,
	height:100
});
console.log(foo.bar.Shape.getArea(instance));
```

## Inheritance:
```
OOP.namespace("foo.bar.Shape", OOP.construct(
	//Instance
	{
		width:150,
		height:150
	},
	//Static
	{
		getArea:function(obj){
			return obj.width * obj.height;
		}
	}
));

OOP.namespace("foo.bar.Triangle", OOP.inherit(foo.bar.Shape, OOP.createClass(
	//Instance
	{
		angles:[30, 60, 90]
	},
	//Static
	{
		getArea:function(obj){
			return obj.width * obj.height * 0.5;
		}
	}
)));

var instance = new foo.bar.Triangle();
console.log(OOP.isType(instance, foo.bar.Triangle)); //true
console.log(OOP.isType(instance, foo.bar.Shape)); //true
console.log(OOP._interface); //Triangle instance
console.log(OOP._super); //Shape instance
console.log(OOP._super._interface); //Triangle instance
console.log(OOP._type); //"foo.bar.Triangle"
console.log(OOP._super._type); //"foo.bar.Shape"
```

## Events:
```
OOP.namespace("foo.bar.Shape", OOP.construct(
	//Instance
	{
		width:150,
		height:150
	},
	//Static
	{
		getArea:function(obj){
			return obj.width * obj.height;
		}
	},
	//Events
	true
));

var instance = new foo.bar.Shape();
instance.addEventListener("test-event", function(evt, data){
	console.log("Got event", evt, data);
});

instance.dispatchEvent(new OOP.Event("test-event", 123));
```
Note that events fired from inherited classes (_super) will bubble up (they share the same _eventHandlers)

### Add events to any object
```
var myObj = {};
OOP.enableEvents(myObj);

myObj.addEventListener("test-event", function(evt, data){
	console.log("Got event", evt, data);
});

myObj.dispatchEvent(new OOP.Event("test-event", 123));
```

## Clone
```
var obj = OOP.clone({foo:{bar:"foobar"}}); //Makes a deep copy - The foo objects will be different
var obj = OOP.clone({foo:{bar:"foobar"}}, true); //Makes a shallow copy - The foo objects will be the same reference
```

## Extend
```
var foo = {abc:123};
var bar = {def:{ghi:456}};

//Extend bar onto foo - deep by default meaning foo.def will not equal bar.def
OOP.extend(foo, bar);

//Extend bar onto foo - shallow meaning foo.def and bar.def will be the same reference
OOP.extend(foo, false, bar);

//Extend bar onto foo - shallow meaning foo.def and bar.def will be the same reference but the third object is deep again
OOP.extend(foo, false, bar, true, {jkl:{mno:789}});
```
Note the number of arguments is unlimited. When a boolean is encountered it sets the "deep" flag for subsequent objects. The first object found in the arguments is what gets extended (you could pass true/false as the first argument).

## Type helpers
```
OOP.isType
OOP.isFunction
OOP.isArray
OOP.isObject
OOP.isString
OOP.isBoolean
```

## Full API
```
init:_methods.init,

//Class
namespace:_methods.namespace,
inherit:_methods.inherit,
createClass:_methods.createClass,
construct:_methods.createClass, //Alias

//Core
clone:_methods.clone,
extend:_methods.extend,

//Helpers
isType:_methods.isType,
isFunction:_methods.isFunction,
isArray:_methods.isArray,
isObject:_methods.isObject,
isString:_methods.isString,
isBoolean:_methods.isBoolean,

//Events
Event:_methods.event,

enableEvents:_methods.enableEvents,
disableEvents:_methods.disableEvents,

addEventListener:_methods.addEventListener,
on:_methods.addEventListener, //Alias

removeEventListener:_methods.removeEventListener,
off:_methods.removeEventListener, //Alias

dispatchEvent:_methods.dispatchEvent,
trigger:_methods.dispatchEvent, //Alias
emit:_methods.dispatchEvent //Alias
```