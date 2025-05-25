export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
} 