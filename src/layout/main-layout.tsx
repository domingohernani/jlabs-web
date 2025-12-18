import { useUser } from "@/stores/user";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <nav>
        <h1 className="text-xl font-black bg-black/90 text-white p-5">
          Hernani
        </h1>
      </nav>
      <Outlet />
    </div>
  );
};

export default MainLayout;
