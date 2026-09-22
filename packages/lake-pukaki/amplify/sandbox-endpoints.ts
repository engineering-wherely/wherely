import { Aspects, Stack } from "aws-cdk-lib";
import { CfnVPCEndpoint } from "aws-cdk-lib/aws-ec2";

// Keep development endpoint costs down. Branch deployments retain all zones.
export function configureSandboxEndpoints(stack: Stack) {
  if (stack.node.tryGetContext("amplify-backend-type") !== "sandbox") return;

  // The deployed SQL handler calls SSM GetParameter with WithDecryption; SSM
  // performs KMS decryption server-side. It doesn't call these other services.
  // Remove only the four audited Amplify SQL endpoints, before synthesis.
  for (const node of stack.node.findAll()) {
    if (
      node instanceof CfnVPCEndpoint &&
      node.node.id.startsWith("SQLVpcEndpoint") &&
      /(?:ssmmessages|ec2messages|ec2|kms)$/.test(node.node.id) &&
      node.vpcEndpointType === "Interface" &&
      node.vpcId === "vpc-034ece14ded8f8515"
    ) {
      node.node.scope?.node.tryRemoveChild(node.node.id);
    }
  }

  Aspects.of(stack).add({
    visit(node) {
      if (
        node instanceof CfnVPCEndpoint &&
        node.node.id.startsWith("SQLVpcEndpoint") &&
        node.vpcEndpointType === "Interface" &&
        node.vpcId === "vpc-034ece14ded8f8515"
      ) {
        // ap-southeast-2c. Lambda and database subnet placement stays unchanged.
        node.subnetIds = ["subnet-001c80181de57ec86"];
      }
    },
  });
}
