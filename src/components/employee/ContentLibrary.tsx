import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DocumentManagement from "@/components/DocumentManagement";

export default function ContentLibrary() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Content & Asset Library</h3>
      </div>
      <Separator className="mb-3" />
      <div className="space-y-4">
        <DocumentManagement />
      </div>
    </Card>
  );
}
