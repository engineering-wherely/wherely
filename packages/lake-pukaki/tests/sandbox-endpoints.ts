import assert from "node:assert/strict";
import { App, NestedStack, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CfnVPCEndpoint } from "aws-cdk-lib/aws-ec2";
import { configureSandboxEndpoints } from "../amplify/sandbox-endpoints";

const subnets = [
  "subnet-001c80181de57ec86",
  "subnet-06cdf05ea64bed404",
  "subnet-0dbf5f7fd49eacbca",
];
for (const environment of ["sandbox", "branch"]) {
  const app = new App({ context: { "amplify-backend-type": environment } });
  const root = new Stack(app, "Backend");
  const nested = new NestedStack(root, "SQL");
  for (const service of ["ssm", "ssmmessages", "ec2", "ec2messages", "kms"]) {
    new CfnVPCEndpoint(nested, `SQLVpcEndpoint${service}`, {
      vpcEndpointType: "Interface",
      vpcId: "vpc-034ece14ded8f8515",
      serviceName: `com.amazonaws.ap-southeast-2.${service}`,
      subnetIds: subnets,
    });
  }
  new CfnVPCEndpoint(nested, "UnrelatedEndpoint", {
    vpcEndpointType: "Interface",
    vpcId: "vpc-034ece14ded8f8515",
    serviceName: "com.amazonaws.ap-southeast-2.logs",
    subnetIds: subnets,
  });
  configureSandboxEndpoints(root);
  const resources = Template.fromStack(nested).findResources(
    "AWS::EC2::VPCEndpoint",
  );
  assert.equal(
    Object.keys(resources).length,
    environment === "sandbox" ? 2 : 6,
  );
  if (environment === "sandbox") {
    assert.deepEqual(
      Object.values(resources)
        .map((resource) => resource.Properties.ServiceName)
        .sort(),
      ["com.amazonaws.ap-southeast-2.logs", "com.amazonaws.ap-southeast-2.ssm"],
    );
  }
  for (const [id, resource] of Object.entries(resources)) {
    assert.deepEqual(
      resource.Properties.SubnetIds,
      environment === "sandbox" && id.startsWith("SQLVpcEndpoint")
        ? [subnets[0]]
        : subnets,
    );
  }
}
console.log(
  "Endpoint synthesis passed: sandbox retains only SSM in one zone; branch and unrelated endpoints are unchanged.",
);
