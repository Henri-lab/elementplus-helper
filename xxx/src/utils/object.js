const obj = {};
Object.defineProperty(obj, 'myVar', {
  value: undefined,
  writable: true, // First write allowed
  configurable: false, // Prevent reconfiguration
});

Object.defineProperty(obj, 'myVar', {
  set(value) {
    if (this._hasValue) {
      console.error("This variable has already been set.");
    } else {
      Object.defineProperty(this, 'myVar', {
        value: value,
        writable: false, // Lock the value after the first write
      });
      this._hasValue = true;
    }
  },
  get() {
    return this._myVar;
  },
  configurable: false,
  enumerable: true,
});

// obj.myVar = 42; // Sets the value to 42
// console.log(obj.myVar); // Outputs: 42

// obj.myVar = 100; // Error: This variable has already been set.

const createWriteOnce = (initialValue) => {
    let value = initialValue;
    let isSet = false;
  
    return new Proxy(
      {},
      {
        set(target, prop, newValue) {
          if (isSet) {
            console.error("The variable has already been set.");
            return false; // Prevent further changes
          }
          value = newValue;
          isSet = true;
          return true;
        },
        get() {
          return value;
        },
      }
    );
  };
  
  const myVar = createWriteOnce(undefined);
  
//   myVar.value = 42; // Sets the value to 42
//   console.log(myVar.value); // Outputs: 42
  
//   myVar.value = 100; // Error: The variable has already been set.