'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">{error.message || 'An error occurred while loading the page.'}</p>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 