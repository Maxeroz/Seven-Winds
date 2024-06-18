import Layout from "./feautres/Layout/Layout";
import LowerNavbar from "./feautres/Navbar/LowerNavbar";
import Navbar from "./feautres/Navbar/Nabar";

export default function App() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <LowerNavbar />
      <Layout />
    </div>
  );
}
