import { convertRecordTypeNameToInterfaceName } from "./convertRecordTypeNameToInterfaceName.ts";
import { assertStrictEquals } from "../../deps.ts";

Deno.test("Type string with no system is assumed to be std.", () => {
  assertStrictEquals(
    convertRecordTypeNameToInterfaceName("testType"),
    "StdTestType",
  );
});

Deno.test("Type string with no system is assigned to given default.", () => {
  assertStrictEquals(
    convertRecordTypeNameToInterfaceName("testType", "default"),
    "DefaultTestType",
  );
});

Deno.test("Type string with system is extracted.", () => {
  assertStrictEquals(
    convertRecordTypeNameToInterfaceName("sys/testType"),
    "SysTestType",
  );
  assertStrictEquals(
    convertRecordTypeNameToInterfaceName("sys/testType", "default"),
    "SysTestType",
  );
});

Deno.test("Type string system is based on first forward slash.", () => {
  assertStrictEquals(
    convertRecordTypeNameToInterfaceName("sys/sys2/testType"),
    "SysSys2/testType",
  );
});
