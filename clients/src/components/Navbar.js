const Navbar = () => {
    return (
      <nav className="flex justify-between p-4 bg-gray-800 text-white">
        <div>Menü</div>
        <div className="flex gap-4">
          <span>Mesaj</span>
          <span>Bildirim</span>
          <span>Kişi Verileri</span>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  