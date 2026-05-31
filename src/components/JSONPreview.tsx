import { useQueryStore } from "@/store/queryStore";
import React from "react";

const JSONPreview = () => {
  const tree = useQueryStore((state) => state.tree);
  return (
    <pre className="text-xs bg-primary p-2 rounded">
      {JSON.stringify(tree, null, 2)}
    </pre>
  );
};

export default JSONPreview;
