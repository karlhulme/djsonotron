# djsonotron

The parsing and validating code is readable and covered well by the tests.

The code generation is harder to work with. There's lots of concatenating of
string arrays, and the handing of imports is difficult to parse logically. It
may be better to have a CodeGenerationContext object that represents all the
code to be outputted. Then different logical paths can add imports or interfaces
or functions. Perhaps build those artifacts as a series of objects and then
convert to code right at the end.

## Commands

Run `deno test --coverage=cov_profile` to test.

Run `deno coverage cov_profile` to view coverage report.

## Todo

Add tests for forSengi. Add tests for forOpenApi Re-write forRuntimeValidation
using toasty and add tests. Re-write forOakService using toasty and add tests.
