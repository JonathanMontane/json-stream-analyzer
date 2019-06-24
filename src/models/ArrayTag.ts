import { SchemaType, Diagnostic, Model } from '../interfaces';
import convertToSchema from '../convert';

export class ArrayTagModel implements Model {
  public tag: (record: any) => any;
  private size: number;
  public schema?: SchemaType;

  public constructor({
    tag,
    size,
  }: {
    tag: (record: any) => any;
    size: number;
  }) {
    this.tag = tag;
    this.size = size;
  }

  public convert = (record: any): SchemaType => {
    const tag = [this.tag(record)];
    return convertToSchema(record, tag);
  };

  public combineTag = (thisTag: any, otherTag: any): any => {
    if (Array.isArray(thisTag) && thisTag.length >= this.size) {
      return thisTag;
    }

    if (Array.isArray(thisTag) && Array.isArray(otherTag)) {
      return [...thisTag, ...otherTag].slice(0, this.size);
    }

    if (Array.isArray(thisTag)) {
      return [...thisTag, otherTag];
    }

    if (Array.isArray(otherTag)) {
      return [thisTag, ...otherTag].slice(0, this.size);
    }

    return [thisTag, otherTag];
  };

  public combine = (first: SchemaType, second: SchemaType): SchemaType => {
    return first.combine(second, { combineTag: this.combineTag });
  };

  public diagnose = (): Diagnostic[] => {
    if (this.schema) {
      return this.schema.diagnose();
    }

    return [];
  };

  public diagnoseRecord = (record: any): Diagnostic[] => {
    const tag = [this.tag(record)];
    const recordModel = convertToSchema(record, tag);

    let combined;
    if (this.schema) {
      combined = this.combine(record, this.schema);
    } else {
      combined = recordModel;
    }

    return combined.diagnose().filter((diagnostic: Diagnostic) => {
      if (!Array.isArray(diagnostic.tag)) {
        return false;
      }

      return diagnostic.tag.includes(tag[0]);
    });
  };

  public addToModel = (record: any): void => {
    const recordModel = this.convert(record);
    if (!this.schema) {
      this.schema = recordModel;
    } else {
      this.schema = this.combine(this.schema, recordModel);
    }
  };

  public traverseSchema = (path: string[]) => {
    if (!this.schema) {
      return { path, schema: this.schema };
    }
    return this.schema.traverse(path);
  };
}