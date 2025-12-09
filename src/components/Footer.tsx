export default function Footer() {
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#131313' }}>
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

