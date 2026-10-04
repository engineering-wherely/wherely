import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { configureSandboxEndpoints } from "./sandbox-endpoints";

const backend = defineBackend({
  auth,
  data,
});

configureSandboxEndpoints(backend.stack);
