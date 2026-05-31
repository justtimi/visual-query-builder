"use client";
import QueryBuilder from "./query-builder/QueryBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JSONPreview from "./JSONPreview";

const Home = () => {
  return (
    <Tabs defaultValue="builder" className="w-full">
      <TabsList>
        <TabsTrigger value="builder">Builder</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="builder">
        <QueryBuilder />
      </TabsContent>

      <TabsContent value="json">
        <JSONPreview/>
      </TabsContent>
    </Tabs>
  );
};

export default Home;
