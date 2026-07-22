// INTENTIONAL INERT FIXTURE: the fixture directory is excluded from production builds and normal scans.
export function unsafe(userInput: string): unknown {
  return eval(userInput);
}
