type MatchFilter = any;
type MatchFilters<T> = any;
type PathMatch = any;

export function createMatcher<S extends string>(
  path: S,
  partial?: boolean,
  matchFilters?: MatchFilters<S>,
) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;

  return (location: string): PathMatch | null => {
    const locSegments = location.split("/").filter(Boolean);
    const lenDiff = locSegments.length - len;
    if (lenDiff < 0 || (lenDiff > 0 && splat === undefined && !partial)) {
      return null;
    }

    const match: PathMatch = {
      path: len ? "" : "/",
      params: {},
    };

    const matchFilter = (s: string) =>
      matchFilters === undefined
        ? undefined
        : (matchFilters as Record<string, MatchFilter>)[s];

    for (let i = 0; i < len; i++) {
      const segment = segments[i];
      const locSegment = locSegments[i];
      const dynamic = segment[0] === ":";
      const key = dynamic ? segment.slice(1) : segment;

      if (dynamic && matchSegment(locSegment, matchFilter(key))) {
        match.params[key] = locSegment;
      } else if (dynamic || !matchSegment(locSegment, segment)) {
        return null;
      }
      match.path += `/${locSegment}`;
    }

    if (splat) {
      const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
      if (matchSegment(remainder, matchFilter(splat))) {
        match.params[splat] = remainder;
      } else {
        return null;
      }
    }

    return match;
  };
}

function matchSegment(input: string, filter?: string | MatchFilter): boolean {
  const isEqual = (s: string) =>
    s.localeCompare(input, undefined, { sensitivity: "base" }) === 0;

  if (filter === undefined) {
    return true;
  } else if (typeof filter === "string") {
    return isEqual(filter);
  } else if (typeof filter === "function") {
    return (filter as Function)(input);
  } else if (Array.isArray(filter)) {
    return (filter as string[]).some(isEqual);
  } else if (filter instanceof RegExp) {
    return (filter as RegExp).test(input);
  }
  return false;
}
