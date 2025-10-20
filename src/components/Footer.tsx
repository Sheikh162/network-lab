export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground md:px-8">
        <p>
          &copy; {new Date().getFullYear()} Virtual Network Lab. Built by Sheikh Abdullah.
        </p>
      </div>
    </footer>
  );
}