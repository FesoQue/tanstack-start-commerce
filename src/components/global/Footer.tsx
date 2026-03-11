export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t px-10 pb-14 pt-10 ">
      <div className="text-center space-y-10">
        <p>This is the footer</p>
        <p className="text-sm text-gray-500">All rights reserved {year}</p>
      </div>
    </footer>
  );
}
