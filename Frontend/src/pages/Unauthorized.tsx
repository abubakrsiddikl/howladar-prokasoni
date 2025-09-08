import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center gap-6 p-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Unauthorized
          </h1>

          <p className="text-center text-sm text-muted-foreground max-w-prose">
            You don’t have permission to access this page. If you think this is
            a mistake, contact the administrator or try returning to the
            homepage.
          </p>

          <div className="flex gap-3 w-full justify-center">
            <Link to="/">
              <Button className="px-6">Go to Home</Button>
            </Link>

            <a
              href="mailto:support@example.com"
              className="inline-flex items-center"
              aria-label="Contact support"
            >
              <Button variant="ghost" className="px-6">
                Contact Support
              </Button>
            </a>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            Tip: If you signed in with a different account, try signing out and
            signing in with the correct one.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
