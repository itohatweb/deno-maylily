// Copyright shimataro. MIT License.
// Small parts were changed by itohatweb
// Ported from https://github.com/shimataro/maylily

// @deno-types="./src/bigInteger.d.ts"
import BigInteger from "./src/bigInteger.js";

const DEFAULT_BITS_MACHINE = 3; // up to 8 machines
const DEFAULT_BITS_GENERATOR = 10; // 0-1023
const DEFAULT_BITS_SEQUENCE = 8; // 0-255

const maylilyGlobalOptions = {
  radix: 10,
  timeBase: Date.parse("2000-01-01T00:00:00Z"),
  machineId: 0,
  machineBits: DEFAULT_BITS_MACHINE,
  generatorId: Deno.pid % (1 << DEFAULT_BITS_GENERATOR),
  generatorBits: DEFAULT_BITS_GENERATOR,
  sequenceBits: DEFAULT_BITS_SEQUENCE,
};

let timePrev = 0;
let sequence = 0;

/**
 * Generate an unique ID.
 * All options are optional for all not given options the default will be used.
 */
export function maylily(options?: MaylilyOptions) {
  // Merge options if specified.
  if (options !== undefined) {
    Object.assign(maylilyGlobalOptions, options);
  }

  return new Promise((resolve, reject) => {
    resolveId(resolve, reject);
  });
}

/**
 * generate and resolve ID
 */
function resolveId(
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void,
) {
  const time = Date.now();
  if (time < timePrev) {
    reject(errorTimeBackwards(time));
    return;
  }

  // Reset sequence when time is updated.
  if (time > timePrev) {
    sequence = 0;
  }

  const sequenceLimit = 1 << maylilyGlobalOptions.sequenceBits;
  if (sequence < sequenceLimit) {
    // Increment sequence when sequence DOESN'T reach to limit.
    resolve(buildId(time, maylilyGlobalOptions));
    return;
  }

  // next time...
  setTimeout(resolveId, 1, resolve, reject);
}

/**
 * build an unique ID 
 */
function buildId(time: number, options: MaylilyOptions) {
  timePrev = time;

  return BigInteger(time - options.timeBase!)
    .shiftLeft(options.machineBits!).add(options.machineId!)
    .shiftLeft(options.generatorBits!).add(options.generatorId!)
    .shiftLeft(options.sequenceBits!).add(sequence++)
    .toString(options.radix!);
}

/**
 * generate an error instance for time backwards error
 */
function errorTimeBackwards(time: number) {
  const message =
    `Clock moved backwards. Refusing to generate id for ${time} milliseconds`;
  return new Error(message);
}

export interface MaylilyOptions {
  /** radix of generated ID (2-36) */
  radix?: number;
  /** base time in unixtime (millisec) */
  timeBase?: number;
  /** identifier of machine; must be unique in service */
  machineId?: number;
  /** required bits to represent machineId */
  machineBits?: number;
  /** identifier of generator; must be unique in machine */
  generatorId?: number;
  /** required bits to represent generatorId */
  generatorBits?: number;
  /** required bits to represent sequence */
  sequenceBits?: number;
}
