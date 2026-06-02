"use client";
import QueryBuilder from "./query-builder/QueryBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JSONPreview from "./JSONPreview";
import { ResultsPanel } from "./query-builder/ResultsPanel";

const Home = () => {
  return (
    <Tabs defaultValue="builder" className="w-full">
      <TabsList>
        <TabsTrigger value="builder">Builder</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>

      <TabsContent value="builder">
        <QueryBuilder />
      </TabsContent>

      <TabsContent value="json">
        <JSONPreview/>
      </TabsContent>
      <TabsContent value="results">
        <ResultsPanel/>
      </TabsContent>
    </Tabs>
  );
};

export default Home;
