import { addNode } from "@/utils/addNode";
import { createRule } from "@/utils/createNode";
import { createGroup } from "@/utils/createNode";
import { QueryNode } from "@/types/query";

const root: QueryNode = createGroup();

const rule = createRule();

const updated = addNode(root, root.id, rule);

console.log(JSON.stringify(updated, null, 2));
