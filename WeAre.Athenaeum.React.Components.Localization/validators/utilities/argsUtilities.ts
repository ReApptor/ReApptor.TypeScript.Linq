export abstract class ArgsUtilities {
  public static read() {
    const args: Record<string, string> = {};
    process.argv.slice(2, process.argv.length).forEach((arg) => {
      // long arg
      if (arg.slice(0, 2) === '--') {
        const longArg = arg.split('=');
        const longArgFlag = longArg[0].slice(2, longArg[0].length);
        args[longArgFlag] = longArg.length > 1 ? longArg[1] : 'true';
      }
    });
    return args;
  }
}
