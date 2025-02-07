import { Pointer } from './pointer';
/**
All diff* functions should return a list of operations, often empty.

Each operation should be an object with two to four fields:
* `op`: the name of the operation; one of "add", "remove", "replace", "move",
  "copy", or "test".
* `path`: a JSON pointer string
* `from`: a JSON pointer string
* `value`: a JSON value

The different operations have different arguments.
* "add": [`path`, `value`]
* "remove": [`path`]
* "replace": [`path`, `value`]
* "move": [`from`, `path`]
* "copy": [`from`, `path`]
* "test": [`path`, `value`]

Currently this only really differentiates between Arrays, Objects, and
Everything Else, which is pretty much just what JSON substantially
differentiates between.
*/
export interface AddOperation {
    op: 'add';
    path: string;
    value: any;
}
export interface RemoveOperation {
    op: 'remove';
    path: string;
}
export interface ReplaceOperation {
    op: 'replace';
    path: string;
    value: any;
}
export interface MoveOperation {
    op: 'move';
    from: string;
    path: string;
}
export interface CopyOperation {
    op: 'copy';
    from: string;
    path: string;
}
export interface TestOperation {
    op: 'test';
    path: string;
    value: any;
}
export declare type Operation = AddOperation | RemoveOperation | ReplaceOperation | MoveOperation | CopyOperation | TestOperation;
export declare function isDestructive({ op }: Operation): boolean;
export declare type Diff = (input: any, output: any, ptr: Pointer) => Operation[];
export declare type VoidableDiff = (input: any, output: any, ptr: Pointer) => Operation[] | void;
/**
List the keys in `minuend` that are not in `subtrahend`.

A key is only considered if it is both 1) an own-property (o.hasOwnProperty(k))
of the object, and 2) has a value that is not undefined. This is to match JSON
semantics, where JSON object serialization drops keys with undefined values.

@param minuend Object of interest
@param subtrahend Object of comparison
@returns Array of keys that are in `minuend` but not in `subtrahend`.
*/
export declare function subtract(minuend: object, subtrahend: object): string[];
/**
List the keys that shared by all `objects`.

The semantics of what constitutes a "key" is described in {@link subtract}.

@param objects Array of objects to compare
@returns Array of keys that are in ("own-properties" of) every object in `objects`.
*/
export declare function intersection(objects: ArrayLike<object>): string[];
/**
Calculate the shortest sequence of operations to get from `input` to `output`,
using a dynamic programming implementation of the Levenshtein distance algorithm.

To get from the input ABC to the output AZ we could just delete all the input
and say "insert A, insert Z" and be done with it. That's what we do if the
input is empty. But we can be smarter.

          output
               A   Z
               -   -
          [0]  1   2
input A |  1  [0]  1
      B |  2  [1]  1
      C |  3   2  [2]

1) start at 0,0 (+0)
2) keep A (+0)
3) remove B (+1)
4) replace C with Z (+1)

If the `input` (source) is empty, they'll all be in the top row, resulting in an
array of 'add' operations.
If the `output` (target) is empty, everything will be in the left column,
resulting in an array of 'remove' operations.

@returns A list of add/remove/replace operations.
*/
export declare function diffArrays<T>(input: T[], output: T[], ptr: Pointer, diff?: Diff): Operation[];
export declare function diffObjects(input: any, output: any, ptr: Pointer, diff?: Diff): Operation[];
export declare function diffValues(input: any, output: any, ptr: Pointer): Operation[];
export declare function diffDates(input: Date, output: Date, ptr: Pointer): Operation[];
export declare function diffAny(input: any, output: any, ptr: Pointer, diff?: Diff): Operation[];
