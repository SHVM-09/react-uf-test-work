/**
 * Utils Test Suite
 * 
 * Comprehensive unit tests for utility functions covering:
 * - String operations
 * - Array operations
 * - Arithmetic operations
 * - Object operations
 */

describe('Utility Functions', () => {
  
  // ============================
  // String Operations Tests
  // ============================
  
  describe('String Operations', () => {
    
    test('should capitalize first letter of a string', () => {
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('a')).toBe('A');
    });

    test('should convert string to lowercase', () => {
      const toLowerCase = (str) => str.toLowerCase();
      expect(toLowerCase('HELLO')).toBe('hello');
      expect(toLowerCase('HeLLo')).toBe('hello');
      expect(toLowerCase('WoRLD')).toBe('world');
    });

    test('should convert string to uppercase', () => {
      const toUpperCase = (str) => str.toUpperCase();
      expect(toUpperCase('hello')).toBe('HELLO');
      expect(toUpperCase('World')).toBe('WORLD');
      expect(toUpperCase('test')).toBe('TEST');
    });

    test('should reverse a string', () => {
      const reverseString = (str) => str.split('').reverse().join('');
      expect(reverseString('hello')).toBe('olleh');
      expect(reverseString('racecar')).toBe('racecar');
      expect(reverseString('world')).toBe('dlrow');
    });

    test('should trim whitespace from string', () => {
      const trimWhitespace = (str) => str.trim();
      expect(trimWhitespace('  hello  ')).toBe('hello');
      expect(trimWhitespace('\n\tworld\n')).toBe('world');
      expect(trimWhitespace('  test  ')).toBe('test');
    });

    test('should check if string contains substring', () => {
      const contains = (str, substr) => str.includes(substr);
      expect(contains('hello world', 'world')).toBe(true);
      expect(contains('hello world', 'foo')).toBe(false);
      expect(contains('javascript', 'script')).toBe(true);
    });

    test('should repeat string N times', () => {
      const repeatString = (str, times) => str.repeat(times);
      expect(repeatString('ab', 3)).toBe('ababab');
      expect(repeatString('x', 5)).toBe('xxxxx');
      expect(repeatString('hello', 2)).toBe('hellohello');
    });

    test('should split string by delimiter', () => {
      const splitString = (str, delim) => str.split(delim);
      expect(splitString('a,b,c', ',')).toEqual(['a', 'b', 'c']);
      expect(splitString('hello world', ' ')).toEqual(['hello', 'world']);
      expect(splitString('one-two-three', '-')).toEqual(['one', 'two', 'three']);
    });

  });

  // ============================
  // Array Operations Tests
  // ============================
  
  describe('Array Operations', () => {
    
    test('should find maximum value in array', () => {
      const findMax = (arr) => Math.max(...arr);
      expect(findMax([1, 5, 3, 9, 2])).toBe(9);
      expect(findMax([10, 20, 15])).toBe(20);
      expect(findMax([-5, -2, -10])).toBe(-2);
    });

    test('should find minimum value in array', () => {
      const findMin = (arr) => Math.min(...arr);
      expect(findMin([1, 5, 3, 9, 2])).toBe(1);
      expect(findMin([10, 20, 15])).toBe(10);
      expect(findMin([-5, -2, -10])).toBe(-10);
    });

    test('should calculate sum of array elements', () => {
      const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);
      expect(sum([1, 2, 3, 4])).toBe(10);
      expect(sum([5, 10, 15])).toBe(30);
      expect(sum([])).toBe(0);
    });

    test('should calculate average of array elements', () => {
      const average = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      expect(average([1, 2, 3, 4])).toBe(2.5);
      expect(average([10, 20, 30])).toBe(20);
      expect(average([5])).toBe(5);
    });

    test('should filter array elements', () => {
      const filterArray = (arr, predicate) => arr.filter(predicate);
      expect(filterArray([1, 2, 3, 4, 5], x => x > 2)).toEqual([3, 4, 5]);
      expect(filterArray([1, 2, 3, 4, 5], x => x % 2 === 0)).toEqual([2, 4]);
    });

    test('should map array elements', () => {
      const mapArray = (arr, fn) => arr.map(fn);
      expect(mapArray([1, 2, 3], x => x * 2)).toEqual([2, 4, 6]);
      expect(mapArray(['a', 'b', 'c'], x => x.toUpperCase())).toEqual(['A', 'B', 'C']);
    });

    test('should flatten nested array', () => {
      const flattenArray = (arr) => arr.flat(Infinity);
      expect(flattenArray([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
      expect(flattenArray([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
      expect(flattenArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test('should remove duplicates from array', () => {
      const removeDuplicates = (arr) => [...new Set(arr)];
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test('should check if array includes element', () => {
      const includes = (arr, element) => arr.includes(element);
      expect(includes([1, 2, 3], 2)).toBe(true);
      expect(includes([1, 2, 3], 5)).toBe(false);
      expect(includes(['a', 'b', 'c'], 'b')).toBe(true);
    });

    test('should reverse array', () => {
      const reverseArray = (arr) => [...arr].reverse();
      expect(reverseArray([1, 2, 3])).toEqual([3, 2, 1]);
      expect(reverseArray(['a', 'b', 'c'])).toEqual(['c', 'b', 'a']);
    });

  });

  // ============================
  // Arithmetic Operations Tests
  // ============================
  
  describe('Arithmetic Operations', () => {
    
    test('should add two numbers', () => {
      const add = (a, b) => a + b;
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 5)).toBe(4);
      expect(add(0, 0)).toBe(0);
    });

    test('should subtract two numbers', () => {
      const subtract = (a, b) => a - b;
      expect(subtract(5, 3)).toBe(2);
      expect(subtract(10, 20)).toBe(-10);
      expect(subtract(0, 5)).toBe(-5);
    });

    test('should multiply two numbers', () => {
      const multiply = (a, b) => a * b;
      expect(multiply(3, 4)).toBe(12);
      expect(multiply(-2, 5)).toBe(-10);
      expect(multiply(0, 100)).toBe(0);
    });

    test('should divide two numbers', () => {
      const divide = (a, b) => b !== 0 ? a / b : null;
      expect(divide(10, 2)).toBe(5);
      expect(divide(7, 2)).toBe(3.5);
      expect(divide(10, 0)).toBe(null);
    });

    test('should calculate remainder', () => {
      const remainder = (a, b) => a % b;
      expect(remainder(10, 3)).toBe(1);
      expect(remainder(20, 5)).toBe(0);
      expect(remainder(7, 2)).toBe(1);
    });

    test('should calculate power', () => {
      const power = (a, b) => Math.pow(a, b);
      expect(power(2, 3)).toBe(8);
      expect(power(5, 2)).toBe(25);
      expect(power(10, 0)).toBe(1);
    });

    test('should calculate square root', () => {
      const squareRoot = (a) => Math.sqrt(a);
      expect(squareRoot(16)).toBe(4);
      expect(squareRoot(9)).toBe(3);
      expect(squareRoot(25)).toBe(5);
    });

    test('should calculate absolute value', () => {
      const absolute = (a) => Math.abs(a);
      expect(absolute(-5)).toBe(5);
      expect(absolute(10)).toBe(10);
      expect(absolute(-3.14)).toBe(3.14);
    });

    test('should round number', () => {
      const round = (a) => Math.round(a);
      expect(round(3.4)).toBe(3);
      expect(round(3.5)).toBe(4);
      expect(round(3.6)).toBe(4);
    });

  });

  // ============================
  // Object Operations Tests
  // ============================
  
  describe('Object Operations', () => {
    
    test('should get object keys', () => {
      const getKeys = (obj) => Object.keys(obj);
      expect(getKeys({ a: 1, b: 2, c: 3 })).toEqual(['a', 'b', 'c']);
      expect(getKeys({ name: 'John', age: 30 })).toEqual(['name', 'age']);
    });

    test('should get object values', () => {
      const getValues = (obj) => Object.values(obj);
      expect(getValues({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3]);
      expect(getValues({ name: 'John', age: 30 })).toEqual(['John', 30]);
    });

    test('should get object entries', () => {
      const getEntries = (obj) => Object.entries(obj);
      expect(getEntries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]]);
      expect(getEntries({ x: 'hello' })).toEqual([['x', 'hello']]);
    });

    test('should merge two objects', () => {
      const merge = (obj1, obj2) => ({ ...obj1, ...obj2 });
      expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
      expect(merge({ x: 1, y: 2 }, { y: 3, z: 4 })).toEqual({ x: 1, y: 3, z: 4 });
    });

    test('should check if object has property', () => {
      const hasProperty = (obj, prop) => obj.hasOwnProperty(prop);
      expect(hasProperty({ a: 1, b: 2 }, 'a')).toBe(true);
      expect(hasProperty({ a: 1, b: 2 }, 'c')).toBe(false);
      expect(hasProperty({ name: 'John' }, 'name')).toBe(true);
    });

    test('should clone object', () => {
      const clone = (obj) => ({ ...obj });
      const original = { a: 1, b: 2 };
      const cloned = clone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    test('should delete object property', () => {
      const deleteProperty = (obj, prop) => {
        const newObj = { ...obj };
        delete newObj[prop];
        return newObj;
      };
      expect(deleteProperty({ a: 1, b: 2, c: 3 }, 'b')).toEqual({ a: 1, c: 3 });
      expect(deleteProperty({ x: 'test', y: 'hello' }, 'x')).toEqual({ y: 'hello' });
    });

    test('should count object properties', () => {
      const countProperties = (obj) => Object.keys(obj).length;
      expect(countProperties({ a: 1, b: 2, c: 3 })).toBe(3);
      expect(countProperties({ name: 'John', age: 30 })).toBe(2);
      expect(countProperties({})).toBe(0);
    });

    test('should filter object properties', () => {
      const filterObject = (obj, predicate) => {
        const result = {};
        Object.entries(obj).forEach(([key, value]) => {
          if (predicate(key, value)) {
            result[key] = value;
          }
        });
        return result;
      };
      expect(filterObject({ a: 1, b: 2, c: 3 }, (k, v) => v > 1)).toEqual({ b: 2, c: 3 });
      expect(filterObject({ name: 'John', age: 30 }, (k) => k === 'name')).toEqual({ name: 'John' });
    });

    test('should transform object values', () => {
      const transformValues = (obj, fn) => {
        const result = {};
        Object.entries(obj).forEach(([key, value]) => {
          result[key] = fn(value);
        });
        return result;
      };
      expect(transformValues({ a: 1, b: 2, c: 3 }, x => x * 2)).toEqual({ a: 2, b: 4, c: 6 });
      expect(transformValues({ x: 'hello', y: 'world' }, s => s.toUpperCase())).toEqual({ x: 'HELLO', y: 'WORLD' });
    });

  });

});
