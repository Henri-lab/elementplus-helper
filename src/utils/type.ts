export function createTypedObject(schema) {
  function validateValue(prop, value, expectedSchema, path) {
    const { type, optional, validator } = expectedSchema;
    
    // 处理可选属性
    if (optional && (value === undefined || value === null)) return true;

    // 检查嵌套对象
    if (typeof type === 'object' && !Array.isArray(type)) {
      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new TypeError(`Error at "${path}": Expected an object.`);
      }
      // 深度验证对象的子属性
      for (const key in type) {
        validateValue(key, value[key], type[key], `${path}.${key}`);
      }
      return true;
    }

    // 检查数组
    if (type === 'array' && Array.isArray(value)) {
      if (expectedSchema.items) {
        // 验证数组中每个项的类型
        value.forEach((item, index) => {
          validateValue(prop, item, expectedSchema.items, `${path}[${index}]`);
        });
      }
      return true;
    }

    // 基础类型检查
    if (typeof value !== type) {
      throw new TypeError(`Error at "${path}": Expected ${type}, got ${typeof value}.`);
    }

    // 自定义验证器
    if (validator && !validator(value)) {
      throw new Error(`Validation failed at "${path}".`);
    }

    return true;
  }

  // 创建代理对象
  const handler = {
    set(target, prop, value) {
      const path = prop;
      const expectedSchema = schema[prop];

      if (expectedSchema) {
        validateValue(prop, value, expectedSchema, path);
      } else {
        console.warn(`Warning: Property "${prop}" is not defined in schema.`);
      }

      target[prop] = value;
      return true;
    },
    get(target, prop) {
      const expectedSchema = schema[prop];
      // 返回默认值
      if (!(prop in target) && expectedSchema && expectedSchema.default !== undefined) {
        return expectedSchema.default;
      }
      return target[prop];
    },
  };

  // 返回代理对象
  const proxy = new Proxy({}, handler);

  // 初始化对象中的默认值
  for (const key in schema) {
    const expectedSchema = schema[key];
    if (expectedSchema.default !== undefined) {
      proxy[key] = expectedSchema.default;
    }
  }

  return proxy;
}

// 使用示例
const personSchema = {
  name: { type: 'string', default: 'Unknown' },
  age: { type: 'number', optional: true, default: 18 },
  email: {
    type: 'string',
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
  address: {
    type: {
      street: { type: 'string', default: 'Unknown St' },
      city: { type: 'string' },
      zipcode: { type: 'number' },
    },
  },
  hobbies: {
    type: 'array',
    items: { type: 'string' },
    optional: true,
  },
};

// 创建对象并测试
const person = createTypedObject(personSchema);

// 设置正确值
person.name = 'Alice';
person.age = 25;
person.email = 'alice@example.com';
person.address = { street: '123 Main St', city: 'Metropolis', zipcode: 12345 };
person.hobbies = ['reading', 'coding'];

console.log(person);

// 设置错误类型的值进行测试
try {
  person.age = 'twenty'; // 错误：年龄必须是数字
} catch (e) {
  console.error(e.message);
}

try {
  person.hobbies = [42]; // 错误：hobbies 必须是字符串数组
} catch (e) {
  console.error(e.message);
}