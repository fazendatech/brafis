export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint;

/**
 * @description Keep string literal intellisense while allowing any string.
 * More info at https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts
 */
export type LiteralStringUnion<T> = LiteralUnion<T, string>;

export type LiteralUnion<LiteralType, BaseType extends Primitive> =
	| LiteralType
	| (BaseType & Record<never, never>);
