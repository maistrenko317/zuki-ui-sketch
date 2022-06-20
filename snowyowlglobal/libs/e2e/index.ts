import {TestRig} from "@snowl/test/test-rig";
import {authE2e} from "@snowl/e2e/auth/auth.e2e";

export function runE2e(rig: TestRig): void {
  authE2e(rig);
}
