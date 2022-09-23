import { assert } from "../../deps.ts";
import { generateOneTimePassword } from "./generateOneTimePassword.ts";

Deno.test("Generate a one-time password.", () => {
  for (let i = 0; i < 1000; i++) {
    const otp = generateOneTimePassword();
    assert(/^[0-9]{6}$/.test(otp));
  }
});
