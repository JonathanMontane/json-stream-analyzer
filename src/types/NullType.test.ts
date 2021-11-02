import { ArrayType } from './ArrayType';
import { BooleanType } from './BooleanType';
import { MissingType } from './MissingType';
import { NullType } from './NullType';
import { NumberType } from './NumberType';
import { ObjectType } from './ObjectType';
import { StringType } from './StringType';
import type { UnionType } from './UnionType';

describe('NullType simple test case', () => {
  describe('constructor', () => {
    it('has type Null', () => {
      const b1 = new NullType();

      expect(b1.type).toBe('Null');
    });

    it('has counter set to 1', () => {
      const b1 = new NullType();

      expect(b1.counter).toBe(1);
    });

    it('has a tag', () => {
      const b1 = new NullType({ counter: 1, tag: 'someTag' });

      expect(b1.tag).toBe('someTag');
    });
  });

  describe('#combine', () => {
    it('combines with NullType', () => {
      const b1 = new NullType();
      const b2 = new NullType();

      const combined = b1.combine(b2);

      expect(combined.type).toBe('Null');
      expect(combined.counter).toBe(2);
    });

    it('combine does not mutate inputs', () => {
      const b1 = new NullType();
      const b2 = new NullType();

      b1.combine(b2);

      expect(b1.type).toBe('Null');
      expect(b2.type).toBe('Null');
      expect(b1.counter).toBe(1);
      expect(b2.counter).toBe(1);
    });

    it('combine can be chained', () => {
      const combined = new NullType()
        .combine(new NullType())
        .combine(new NullType())
        .combine(new NullType())
        .combine(new NullType())
        .combine(new NullType())
        .combine(new NullType())
        .combine(new NullType())
        .combine(new NullType())
        .combine(new NullType());

      expect(combined.type).toBe('Null');
      expect(combined.counter).toBe(10);
    });

    it('can combine with MissingType', () => {
      const combined = new NullType().combine(new MissingType()) as UnionType;

      expect(combined.type).toBe('Union');
      expect(combined.counter).toBe(2);
      expect(combined.types.Null.counter).toBe(1);
      expect(combined.types.Missing.counter).toBe(1);
    });

    it('can combine with NumberType', () => {
      const combined = new NullType().combine(new NumberType()) as UnionType;

      expect(combined.type).toBe('Union');
      expect(combined.counter).toBe(2);
      expect(combined.types.Null.counter).toBe(1);
      expect(combined.types.Number.counter).toBe(1);
    });

    it('can combine with StringType', () => {
      const combined = new NullType().combine(new StringType()) as UnionType;

      expect(combined.type).toBe('Union');
      expect(combined.counter).toBe(2);
      expect(combined.types.Null.counter).toBe(1);
      expect(combined.types.String.counter).toBe(1);
    });

    it('can combine with ObjectType', () => {
      const combined = new NullType().combine(new ObjectType()) as UnionType;

      expect(combined.type).toBe('Union');
      expect(combined.counter).toBe(2);
      expect(combined.types.Null.counter).toBe(1);
      expect(combined.types.Object.counter).toBe(1);
    });

    it('can combine with BooleanType', () => {
      const combined = new NullType().combine(new BooleanType()) as UnionType;

      expect(combined.type).toBe('Union');
      expect(combined.counter).toBe(2);
      expect(combined.types.Null.counter).toBe(1);
      expect(combined.types.Boolean.counter).toBe(1);
    });

    it('can combine with ArrayType', () => {
      const combined = new NullType().combine(new ArrayType()) as UnionType;

      expect(combined.type).toBe('Union');
      expect(combined.counter).toBe(2);
      expect(combined.types.Null.counter).toBe(1);
      expect(combined.types.Array.counter).toBe(1);
    });
  });
});
