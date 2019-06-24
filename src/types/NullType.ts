import {
  SchemaTypeParams,
  SchemaType,
  SchemaTypeID,
  CombineOptions,
  Diagnostic,
} from '../interfaces';
import { keepFirst } from '../tags/combiners';
import { UnionType } from './UnionType';

export class NullType implements SchemaType {
  /**
   * Unique type ID that can be used to discriminate between different Schema
   * Types like NumberType, StringType, ObjectType
   */
  public type: SchemaTypeID;

  /**
   * A user-defined identifier that is used to label every node of the schema.
   * In the context of an Algolia Record, the objectID could be used as a tag.
   *
   * The tags are useless during the conversion of a JSON object but can be very
   * useful during the combination of the models, as models that are different can
   * then show different tags, which the user can then use to find what caused
   * the difference.
   *
   * Note: In the model, we will only ever keep only one tag on every node of the
   * tree representation of the schema type
   */
  public tag?: any;

  /**
   * A simple counter that counts how many times this part of the model was combined.
   * This is useful to measure how many times an attribute is Missing, and compare it to
   * how many times the parent object is present, for instance.
   */
  public counter: number;

  public constructor({ counter = 1, tag }: SchemaTypeParams = { counter: 1 }) {
    this.counter = counter;
    this.tag = tag;
    this.type = 'Null';
  }

  /**
   * Generic method to merge two SchemaType into a single model of the correct
   * type, and that can be overriden when a more advanced logic is needed
   * (e.g. for Object, Arrays, etc.).
   *
   * If the 2 models are of the same type, we can safely merge them together,
   * otherwise we combine them into a UnionType
   *
   * Important: If you override this method to have a more specific combination
   * behaviour, it **MUST** first check that the types are identical, and combine
   * the two different SchemaTypes into a UnionType if they are not.
   *
   * @param {SchemaType} other - the schema to combine it with
   * @param {number} counter - the number of times the other schema was seen
   * @param {TagCombiner} combineTag - a method used
   * to combine tags together. If unset, it uses a keep-first strategy.
   * @returns {SchemaType} a SchemaType that is the combination of both models
   */
  public combine = (
    other: SchemaType,
    { counter, combineTag = keepFirst }: CombineOptions = {
      combineTag: keepFirst,
    }
  ): SchemaType => {
    if (other.type === this.type) {
      // @ts-ignore ts(2351)
      const result = new other.constructor({
        counter: counter || this.counter + other.counter,
        tag: combineTag(this.tag, other.tag),
      });
      return result;
    }

    const union = new UnionType();
    return union
      .combine(this, { counter, combineTag })
      .combine(other, { counter, combineTag });
  };

  /**
   * Generic method to create a copy of the current model. It is overriden when
   * a more advanced logic is needed.
   *
   * For immutability purposes.
   * @returns {SchemaType} the copy
   */
  public copy = () => {
    // @ts-ignore ts(2351)
    return new this.constructor({ counter: this.counter, tag: this.tag });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public diagnose = (path: string[] = []): Diagnostic[] => {
    return [];
  };

  public traverse = () => {
    const invalidPathSchema: { path: string[]; schema: SchemaType } = {
      path: [],
      schema: this as SchemaType,
    };

    return invalidPathSchema;
  };
}
