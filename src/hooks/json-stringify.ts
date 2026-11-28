import { configRead } from '../config';

const originalStringify = JSON.stringify;

type FunctionReplacer = (this: any, key: string, value: any) => any;
type WhitelistReplacer = (string | number)[] | null;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Only copy the request objects that require a change. Do not structuredClone
 * arbitrary JSON inputs: functions, symbols and toJSON are valid inputs to
 * native stringify, and a clone error can prevent player requests.
 *
 * Keep the native serialization path when ad blocking is disabled or the
 * object is not a plain playback payload. Related: upstream PR #499.
 */
function withPlaybackContext(value: unknown): unknown {
  if (!isPlainRecord(value) || typeof value.toJSON === 'function') return value;
  const playback = value.playbackContext;
  if (!isPlainRecord(playback) || typeof playback.toJSON === 'function') {
    return value;
  }
  const context = playback.contentPlaybackContext;
  if (
    !isPlainRecord(context) ||
    typeof context.toJSON === 'function' ||
    context.isInlinePlaybackNoAd === true
  ) {
    return value;
  }

  return {
    ...value,
    playbackContext: {
      ...playback,
      contentPlaybackContext: { ...context, isInlinePlaybackNoAd: true }
    }
  };
}

function stringify(
  value: unknown,
  replacer?: FunctionReplacer | WhitelistReplacer,
  space?: string | number
): string {
  try {
    if (configRead('enableAdBlock')) {
      value = withPlaybackContext(value);
    }
  } catch {
    // Never prevent native JSON serialization if inspection fails.
  }

  return originalStringify(value, replacer as any, space);
}

JSON.stringify = stringify;
