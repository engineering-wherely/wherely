import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { configureSandboxEndpoints } from "./sandbox-endpoints";

const backend = defineBackend({
  data,
});

configureSandboxEndpoints(backend.stack);
