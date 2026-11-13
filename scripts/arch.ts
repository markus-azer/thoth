import { cruise, format, type ICruiseResult } from "dependency-cruiser";
import extractConfig from "dependency-cruiser/config-utl/extract-depcruise-config";

// Run from a package dir. The depcruise CLI can't fail on a blind run, so use the API.
// TODO: depcruise can't read TypeScript 7 yet. Bump the root typescript once it can.
const SOURCE_DIR = "src";
const RULES_FILE = "./.dependency-cruiser.cjs";

const ruleSet = await extractConfig(RULES_FILE);
const options = { ...ruleSet.options, ruleSet, validate: true };

const { output } = await cruise([SOURCE_DIR], options);
const result = output as ICruiseResult;
const { totalCruised, error: errorCount } = result.summary;

// An unsupported TypeScript version cruises 0 modules and passes silently.
if (totalCruised === 0) throw new Error("arch: cruised 0 modules");

const report = await format(result, { outputType: "err" });
console.log(report.output);

process.exitCode = errorCount > 0 ? 1 : 0;
