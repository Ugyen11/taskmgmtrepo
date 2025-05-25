import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
} 